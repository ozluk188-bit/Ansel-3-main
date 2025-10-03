import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { db, auth } from '@/src/firebaseConfig';
import { Colors, Fonts } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/Card';
import { StyledInput } from '@/components/ui/StyledInput';
import { GradientButton } from '@/components/ui/GradientButton';
import { SkeletonAvatar, SkeletonLine } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { t } from '@/src/i18n';
import { Image as ExpoImage } from 'expo-image';

interface Chat {
  id: string;
  participants: string[];
  participantsMeta?: Array<{ uid: string; ad?: string; photoURL?: string | null }>;
  lastMessage?: {
    text: string;
    type?: string;
    createdAt: any;
    userId: string;
    userName?: string | null;
    userPhotoURL?: string | null;
  } | null;
  unreadCount?: Record<string, number>;
}

const formatTimestamp = (timestamp: any) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  // Check if it's today, yesterday, or a date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Dün';
  } else {
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
  }
};

function ChatListItem({ chat, currentUid, C }: { chat: Chat; currentUid: string; C: typeof Colors.light }) {
  const other = chat.participantsMeta?.find(p => p.uid !== currentUid);
  if (!other) return null;

  const handlePress = () => {
    router.push(`/sohbet/${other.uid}` as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Sohbet aç: ${other.ad || 'Kullanıcı'}`}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <Card style={styles.chatItemCard}>
        {other.photoURL ? (
          <ExpoImage
            source={{ uri: other.photoURL }}
            style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: C.lightBlue }]} />
        )}
        <View style={styles.chatInfo}>
          <ThemedText type="default" font="semiBold" style={styles.userName}>{other.ad || 'Kullanıcı'}</ThemedText>
          {chat.lastMessage && (
            <ThemedText type="muted" style={styles.lastMessage} numberOfLines={1}>
              {chat.lastMessage.text}
            </ThemedText>
          )}
        </View>
        {chat.lastMessage?.createdAt && (
          <ThemedText type="muted" style={styles.timestamp}>
            {formatTimestamp(chat.lastMessage.createdAt)}
          </ThemedText>
        )}
        {!!chat.unreadCount && chat.unreadCount[currentUid] > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: C.accent }]}>
            <ThemedText style={[styles.unreadText, { color: C.white }]}>{chat.unreadCount[currentUid]}</ThemedText>
          </View>
        )}
      </Card>
    </Pressable>
  );
}

export default function MesajlarScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // For search bar
  const currentUser = auth.currentUser;
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme as 'light' | 'dark'];

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const chatsCollection = collection(db, 'chats');
    const q = query(
      chatsCollection,
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsData: Chat[] = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Chat));

      const sortedChats = chatsData.sort((a, b) => {
        const timeA = a.lastMessage?.createdAt?.toMillis?.() || 0;
        const timeB = b.lastMessage?.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });

      setChats(sortedChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredChats = chats.filter(chat => {
    const other = chat.participantsMeta?.find(p => p.uid !== currentUser?.uid);
    const nameMatch = other?.ad?.toLowerCase().includes(searchQuery.toLowerCase());
    const msgMatch = chat.lastMessage?.text?.toLowerCase().includes(searchQuery.toLowerCase());
    return Boolean(nameMatch || msgMatch);
  });

  if (loading) {
    return (
      <LinearGradient
        colors={[C.backgroundStart, C.backgroundMid, C.backgroundEnd]}
        style={styles.fullScreenGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={{ paddingTop: 60 }} />
        {[...Array(6)].map((_, idx) => (
          <Card key={idx} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, marginVertical: 8, marginHorizontal: 16 }}>
            <SkeletonAvatar size={48} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <SkeletonLine width={'60%'} height={14} />
              <SkeletonLine width={'40%'} height={12} style={{ marginTop: 8 }} />
            </View>
          </Card>
        ))}
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[C.backgroundStart, C.backgroundMid, C.backgroundEnd]}
      style={styles.fullScreenGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" font="bold" style={[styles.headerTitle, { color: C.primaryText }]}>{t('messages_title')}</ThemedText>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <StyledInput
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => currentUser ? <ChatListItem chat={item} currentUid={currentUser.uid} C={C} /> : null}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={
            <EmptyState
              title={t('empty_chats_title')}
              subtitle={t('empty_chats_sub')}
              actionTitle={t('start_new_chat')}
              onPress={() => router.push('/kullanicilar' as any)}
              icon={null}
              style={styles.emptyContainer}
            />
          }
        />

        {/* Floating new message button */}
        <GradientButton
          title="+"
          onPress={() => router.push('/kullanicilar' as any)} // Navigate to users list to start new chat
          style={styles.fab}
          startColor={C.accentStart}
          endColor={C.accentEnd}
          textColor={C.white}
          accessibilityLabel="Yeni sohbet başlat"
          accessibilityHint="Kullanıcı listesine gider"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60, // Adjust for header
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: Colors.light.primaryText,
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  flatListContent: {
    paddingBottom: 100, // Space for FAB
  },
  chatItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.lightBlue,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 13,
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 10,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.light.accent,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: Colors.light.white,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyLink: {
    fontSize: 16,
    marginTop: 8,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
