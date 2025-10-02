import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '@/src/firebaseConfig';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts } from '@/constants/theme';
import { useToast } from '@/components/ui/Toast';
import { hapticError, hapticLight, hapticSuccess } from '@/src/utils/haptics';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard, SkeletonLine, SkeletonAvatar } from '@/components/ui/Skeleton';
import { t } from '@/src/i18n';

interface Icerik {
  id: string;
  tip: 'yazi' | 'foto';
  metin?: string;
  medyaURL?: string;
  olusturanId: string;
  olusturanAdi?: string;
  olusturanAvatar?: string;
  // olusturmaTarihi gibi diğer alanlar da olabilir
}

interface Kalem {
  id: string;
  baslik: string;
}

export default function KalemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [kalem, setKalem] = useState<Kalem | null>(null);
  const [icerikler, setIcerikler] = useState<Icerik[]>([]);
  const [yeniIcerikMetin, setYeniIcerikMetin] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Kalem bilgisini getir
    const kalemRef = doc(db, 'kalemler', id);
    const unsubscribeKalem = onSnapshot(kalemRef, (doc) => {
      if (doc.exists()) {
        setKalem({ id: doc.id, ...doc.data() } as Kalem);
      } else {
        Alert.alert('Hata', 'Kalem bulunamadı.');
      }
    });

    // İçerikleri getir
    const iceriklerQuery = query(
      collection(db, 'icerikler'),
      where('kalemId', '==', id),
      orderBy('olusturmaTarihi', 'desc') // Yeni içerikler üstte
    );

    const unsubscribeIcerikler = onSnapshot(iceriklerQuery, async (snapshot) => {
      const iceriklerData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Icerik)
      );

      if (iceriklerData.length > 0) {
        // Use denormalized creator fields populated by Cloud Functions
        const populatedIcerikler = iceriklerData.map(ic => ({
          ...ic,
          olusturanAdi: ic.olusturanAdi || 'Bilinmeyen',
          olusturanAvatar: ic.olusturanAvatar || undefined,
        }));
        setIcerikler(populatedIcerikler);
      } else {
        setIcerikler([]);
      }

      setLoading(false);
    });

    return () => {
      unsubscribeKalem();
      unsubscribeIcerikler();
    };
  }, [id]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Galerinize erişmek için izin vermelisiniz.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    if (!auth.currentUser || !id) return;
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `icerikler/${id}/${new Date().getTime()}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'icerikler'), {
        kalemId: id,
        olusturanId: auth.currentUser.uid,
        olusturmaTarihi: serverTimestamp(),
        tip: 'foto',
        medyaURL: downloadURL,
      });
      hapticSuccess();
      toast.show('Fotoğraf yüklendi', { type: 'success' });
    } catch (e) {
      console.error('Image upload error:', e);
      Alert.alert('Hata', 'Fotoğraf yüklenirken bir sorun oluştu.');
      hapticError();
    } finally {
      setUploading(false);
    }
  };

  const handleAddMetin = async () => {
    if (yeniIcerikMetin.trim() === '' || !auth.currentUser || !id) return;
    try {
      await addDoc(collection(db, 'icerikler'), {
        kalemId: id,
        metin: yeniIcerikMetin,
        olusturanId: auth.currentUser.uid,
        olusturmaTarihi: serverTimestamp(),
        tip: 'yazi',
      });
      setYeniIcerikMetin('');
      hapticSuccess();
      toast.show('Gönderildi', { type: 'success' });
    } catch (e) {
      console.error('Add text error:', e);
      Alert.alert('Hata', 'Mesaj gönderilirken bir sorun oluştu.');
      hapticError();
    }
  };
  
  const navigateToDetail = (item: Icerik) => {
    // Detay sayfasına yönlendirme. Detay sayfası `icerik/[id].tsx` olacak.
    router.push((`/icerik/${item.id}` as any));
  };

  const renderIcerik = ({ item }: { item: Icerik }) => (
    <Pressable onPress={() => navigateToDetail(item)} style={styles.card}>
      <Pressable onPress={() => router.push((`/profil/${item.olusturanId}` as any))} style={styles.cardHeader}>
        {item.olusturanAvatar ? (
          <Image source={{ uri: item.olusturanAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar} />
        )}
        <Text style={styles.username}>{item.olusturanAdi}</Text>
      </Pressable>
      {item.tip === 'foto' && item.medyaURL ? (
        <Image source={{ uri: item.medyaURL }} style={styles.cardImage} />
      ) : (
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardText} numberOfLines={5}>{item.metin}</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <LinearGradient
      colors={[Colors.light.backgroundStart, Colors.light.backgroundEnd]}
      style={styles.container}
    >
      <Stack.Screen options={{ title: kalem?.baslik || 'Yükleniyor...' }} />
      
      {loading ? (
        <View style={{ padding: 16 }}>
          {[...Array(4)].map((_, idx) => (
            <View key={idx} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
                <SkeletonAvatar size={40} style={{ marginRight: 12 }} />
                <SkeletonLine width={'40%'} height={14} />
              </View>
              <SkeletonCard height={180} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={icerikler}
          renderItem={renderIcerik}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={
            <EmptyState title="Henüz hiç içerik yok." subtitle="İlk içeriği sen ekle!" style={styles.emptyContainer} />
          }
        />
      )}

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <Pressable style={styles.iconButton} onPress={pickImage} disabled={uploading}>
            <Feather name="paperclip" size={22} color={Colors.light.secondaryText} />
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="Bir şeyler yaz..."
            placeholderTextColor={Colors.light.placeholderText}
            value={yeniIcerikMetin}
            onChangeText={setYeniIcerikMetin}
            multiline
          />
          <Pressable style={styles.sendButton} onPress={handleAddMetin} disabled={uploading}>
            {uploading ? <ActivityIndicator size="small" color={Colors.light.white} /> : <Feather name="send" size={22} color={Colors.light.white} />}
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
  listContentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: Colors.light.divider,
  },
  username: {
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    fontSize: 15,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  cardTextContainer: {
    padding: 16,
  },
  cardText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Colors.light.primaryText,
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '40%',
  },
  emptyText: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primaryText,
    marginTop: 16,
  },
  emptySubText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.light.cardBackground,
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
  iconButton: {
    padding: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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