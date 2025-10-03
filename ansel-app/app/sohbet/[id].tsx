
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { db, auth } from '@/src/firebaseConfig';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonLine } from '@/components/ui/Skeleton';
import { t } from '@/src/i18n';

interface Message {
  id: string;
  text: string;
  createdAt: any;
  userId: string;
}

interface OtherUser {
  id: string;
  ad: string;
  photoURL?: string;
}

export default function SohbetScreen() {
  const { id: otherUserId } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme as 'light' | 'dark'];

  useEffect(() => {
    const fetchOtherUser = async () => {
      if (!otherUserId) return;
      const userDoc = await getDoc(doc(db, 'kullanicilar', otherUserId));
      if (userDoc.exists()) {
        setOtherUser({ id: userDoc.id, ...userDoc.data() } as OtherUser);
      }
    };
    fetchOtherUser();
  }, [otherUserId]);

  useEffect(() => {
    if (!currentUser || !otherUserId) return;

    const getOrCreateChat = async () => {
      const sortedIds = [currentUser.uid, otherUserId].sort();
      const generatedChatId = sortedIds.join('_');
      setChatId(generatedChatId);

      const chatRef = doc(db, 'chats', generatedChatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        // Build participantsMeta snapshot at creation
        let meName: string | undefined;
        let mePhoto: string | undefined | null;
        let otherName: string | undefined;
        let otherPhoto: string | undefined | null;
        try {
          const meDoc = await getDoc(doc(db, 'kullanicilar', currentUser.uid));
          if (meDoc.exists()) {
            const d = meDoc.data() as any;
            meName = d?.ad;
            mePhoto = (d?.photoURL ?? d?.profilFotoURL) ?? undefined;
          }
          const oDoc = await getDoc(doc(db, 'kullanicilar', otherUserId));
          if (oDoc.exists()) {
            const d = oDoc.data() as any;
            otherName = d?.ad;
            otherPhoto = (d?.photoURL ?? d?.profilFotoURL) ?? undefined;
          }
        } catch {}

        await setDoc(chatRef, {
          participants: sortedIds,
          createdAt: serverTimestamp(),
          lastMessage: null,
          participantsMeta: [
            { uid: currentUser.uid, ad: meName, photoURL: mePhoto ?? null },
            { uid: otherUserId, ad: otherName, photoURL: otherPhoto ?? null },
          ],
          unreadCount: { [currentUser.uid]: 0, [otherUserId]: 0 },
        });
      }

      const messagesCol = collection(db, 'chats', generatedChatId, 'messages');
      const q = query(messagesCol, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesData: Message[] = [];
        querySnapshot.forEach((doc) => {
          messagesData.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(messagesData);
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribePromise = getOrCreateChat();

    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe && unsubscribe());
    };
  }, [currentUser, otherUserId]);

  // Reset unread count when user views the chat
  useEffect(() => {
    if (!currentUser || !chatId) return;
    const run = async () => {
      try {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
          [`unreadCount.${currentUser.uid}`]: 0,
          [`lastOpenedAt.${currentUser.uid}`]: serverTimestamp(),
        });
      } catch (e) {
        console.log('Failed to reset unread count', e);
      }
    };
    run();
  }, [chatId, currentUser]);

  const handleSend = async () => {
    if (newMessage.trim() === '' || !currentUser || !chatId) return;
    const tempMessage = newMessage;
    setNewMessage('');

    try {
      const messagesCol = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesCol, {
        text: tempMessage,
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
      });

      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: {
          text: tempMessage,
          createdAt: serverTimestamp(),
          userId: currentUser.uid,
        },
      });
    } catch (error) {
      console.error("Error sending message: ", error);
      setNewMessage(tempMessage); // Restore message on error
    }
  };

  const renderItem = useCallback(({ item }: { item: Message }) => {
    const isMyMessage = item.userId === currentUser?.uid;
    const messageDate = item.createdAt?.toDate();

    return (
      <View style={[styles.messageRow, {
        justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
      }]}>
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessage : styles.otherMessage,
          ]}>
          <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>{item.text}</Text>
          {messageDate && (
             <Text style={isMyMessage ? styles.myMessageTimestamp : styles.otherMessageTimestamp}>
                {messageDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
             </Text>
          )}
        </View>
      </View>
    );
  }, [currentUser]);

  return (
    <LinearGradient
      colors={[C.backgroundStart, C.backgroundEnd]}
      style={styles.container}>
      <Stack.Screen options={{ title: otherUser?.ad || 'Sohbet' }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>

        {loading ? (
          <View style={styles.loadingContainer}>
            <SkeletonLine width="70%" height={18} style={{ alignSelf: 'flex-start', marginVertical: 6 }} />
            <SkeletonLine width="55%" height={18} style={{ alignSelf: 'flex-end', marginVertical: 6 }} />
            <SkeletonLine width="62%" height={18} style={{ alignSelf: 'flex-start', marginVertical: 6 }} />
            <SkeletonLine width="44%" height={18} style={{ alignSelf: 'flex-end', marginVertical: 6 }} />
            <SkeletonLine width="68%" height={18} style={{ alignSelf: 'flex-start', marginVertical: 6 }} />
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            inverted
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <EmptyState
                  title={t('start_chat')}
                  subtitle={t('type_first_message')}
                  actionTitle={t('write_message')}
                  onPress={() => inputRef.current?.focus()}
                />
              </View>
            }
          />
        )}

        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={t('write_message')}
            placeholderTextColor={C.placeholderText}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            accessibilityLabel="Mesaj yaz"
            accessibilityHint="Mesajınızı bu alana yazın"
          />
          <Pressable
            style={styles.sendButton}
            onPress={handleSend}
            accessibilityRole="button"
            accessibilityLabel={t('send')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="send" size={22} color={C.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageRow: {
    marginVertical: 4,
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    maxWidth: '75%',
  },
  myMessage: {
    backgroundColor: Colors.light.accent,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: Colors.light.cardBackground,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  myMessageText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Colors.light.white,
    lineHeight: 22,
  },
  otherMessageText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Colors.light.primaryText,
    lineHeight: 22,
  },
  myMessageTimestamp: {
    fontSize: 10,
    color: Colors.light.white,
    opacity: 0.8,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  otherMessageTimestamp: {
    fontSize: 10,
    color: Colors.light.mutedText,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scaleY: -1 }], // Inverted FlatList için içeriği düzelt
  },
  emptyText: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primaryText,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    backgroundColor: Colors.light.inputBackground,
    borderRadius: 20,
    fontSize: 15,
    fontFamily: Fonts.sans,
    color: Colors.light.primaryText,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
});
