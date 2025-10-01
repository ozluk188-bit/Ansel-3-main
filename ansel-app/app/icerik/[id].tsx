
import { Stack, useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { collection, doc, getDoc, onSnapshot, orderBy, query, type DocumentData, type DocumentSnapshot, type QuerySnapshot } from 'firebase/firestore';
import { db, auth } from '@/src/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts } from '@/constants/theme';
import { voteOnIcerik, addYorum, createReport } from '@/src/api/interactions';
import { Feather } from '@expo/vector-icons';

// Önceki ekrandan gelen Icerik interface'i ile aynı yapıyı kullanabiliriz.
interface Icerik {
  id: string;
  tip: 'yazi' | 'foto';
  metin?: string;
  medyaURL?: string;
  olusturanId: string;
  begeniSayisi?: number;
  begenmemeSayisi?: number;
  netBegeniOrani?: number;
  yorumSayisi?: number;
  // Timestamp gibi diğer alanlar da olabilir.
}

interface Yorum {
  id: string;
  kullaniciId: string;
  metin: string;
  olusturmaTarihi?: any;
}

export default function IcerikDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [icerik, setIcerik] = useState<Icerik | null>(null);
  const [loading, setLoading] = useState(true);
  const [yorumMetin, setYorumMetin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [yorumlar, setYorumlar] = useState<Yorum[]>([]);
  const [myVote, setMyVote] = useState<1 | -1 | 0>(0);

  useEffect(() => {
    if (!id) {
      Alert.alert('Hata', "İçerik ID'si bulunamadı.");
      return;
    }

    setLoading(true);
    const docRef = doc(db, 'icerikler', id);

    const unsubscribe = onSnapshot(docRef, (docSnap: DocumentSnapshot<DocumentData>) => {
      if (docSnap.exists()) {
        setIcerik({ id: docSnap.id, ...docSnap.data() } as Icerik);
      } else {
        Alert.alert('Hata', 'Bu içerik artık mevcut değil.');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  // Yorumları dinle (desc by olusturmaTarihi)
  useEffect(() => {
    if (!id) return;
    const yorumCol = collection(db, 'icerikler', String(id), 'yorumlar');
    const q = query(yorumCol, orderBy('olusturmaTarihi', 'desc'));
    const unsub = onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
      const arr: Yorum[] = snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) })) as any;
      setYorumlar(arr);
    });
    return () => unsub();
  }, [id]);

  // Kendi oyumu oku
  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!id || !auth.currentUser) { setMyVote(0); return; }
      const voteDoc = await getDoc(doc(db, 'icerikler', String(id), 'oylar', auth.currentUser.uid));
      if (!active) return;
      if (voteDoc.exists()) {
        const oy = (voteDoc.data() as any)?.oy;
        setMyVote(oy === 1 ? 1 : oy === -1 ? -1 : 0);
      } else {
        setMyVote(0);
      }
    };
    run();
    return () => { active = false; };
  }, [id, auth.currentUser?.uid]);

  const renderContent = () => {
    if (!icerik) return null;

    if (icerik.tip === 'foto' && icerik.medyaURL) {
      return (
        <Image source={{ uri: icerik.medyaURL }} style={styles.image} resizeMode="contain" />
      );
    }

    if (icerik.tip === 'yazi' && icerik.metin) {
      return (
        <View style={styles.textContainer}>
          <Text style={styles.textContent}>{icerik.metin}</Text>
        </View>
      );
    }

    return (
        <View style={styles.emptyContainer}>
            <Feather name="alert-circle" size={48} color={Colors.light.mutedText} />
            <Text style={styles.emptyText}>İçerik görüntülenemiyor.</Text>
      </View>
    );
  };

  const requireAuth = () => {
    if (auth.currentUser) return true;
    Alert.alert('Giriş gerekli', 'Devam etmek için giriş yap.', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Giriş yap', onPress: () => router.push('/login') },
    ]);
    return false;
  };

  return (
    <LinearGradient
      colors={[Colors.light.backgroundStart, Colors.light.backgroundEnd]}
      style={styles.container}
    >
      <Stack.Screen options={{ title: 'İçerik Detayı' }} />
      
      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.accent} style={styles.loading} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderContent()}
          {/* Etkileşim Butonları */}
          <View style={styles.actionsRow}>
            <Pressable style={[styles.actionBtn, myVote === 1 ? styles.likeBtnActive : styles.likeBtn]} onPress={async () => { if (!id) return; if (!requireAuth()) return; setProcessing(true); try { await voteOnIcerik(id as string, 1); setMyVote(1); } finally { setProcessing(false); } }} disabled={processing}>
              <Feather name="thumbs-up" size={18} color={Colors.light.white} />
            </Pressable>
            <Pressable style={[styles.actionBtn, myVote === -1 ? styles.dislikeBtnActive : styles.dislikeBtn]} onPress={async () => { if (!id) return; if (!requireAuth()) return; setProcessing(true); try { await voteOnIcerik(id as string, -1); setMyVote(-1); } finally { setProcessing(false); } }} disabled={processing}>
              <Feather name="thumbs-down" size={18} color={Colors.light.white} />
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.reportBtn]} onPress={async () => { if (!id) return; if (!requireAuth()) return; setProcessing(true); try { await createReport('icerik', `icerikler/${id}`, 'Uygunsuz içerik'); } finally { setProcessing(false); } }} disabled={processing}>
              <Feather name="flag" size={18} color={Colors.light.white} />
            </Pressable>
          </View>

          {/* Sayaçlar */}
          <View style={styles.statsRow}>
            <Text style={styles.statText}>👍 {icerik?.begeniSayisi ?? 0}</Text>
            <Text style={styles.statText}>👎 {icerik?.begenmemeSayisi ?? 0}</Text>
            <Text style={styles.statText}>💬 {icerik?.yorumSayisi ?? yorumlar.length}</Text>
            {'netBegeniOrani' in (icerik || {}) && (
              <Text style={styles.statText}>⭐ {Math.round((icerik?.netBegeniOrani ?? 0) * 100) / 100}%</Text>
            )}
          </View>

          {/* Yorum Alanı */}
          <View style={styles.commentBox}>
            <TextInput
              style={styles.commentInput}
              placeholder="Yorum yaz..."
              placeholderTextColor={Colors.light.placeholderText}
              value={yorumMetin}
              onChangeText={setYorumMetin}
              multiline
            />
            <Pressable style={styles.commentSend} onPress={async () => { if (!id || !yorumMetin.trim()) return; if (!auth.currentUser) { Alert.alert('Giriş gerekli','Devam etmek için giriş yap.'); return; } setProcessing(true); try { await addYorum(id as string, yorumMetin.trim()); setYorumMetin(''); } finally { setProcessing(false); } }} disabled={processing}>
              <Feather name="send" size={18} color={Colors.light.white} />
            </Pressable>
          </View>

          {/* Yorum listesi */}
          {yorumlar.map((y) => (
            <View key={y.id} style={styles.commentItem}>
              <Text style={styles.commentAuthor}>{y.kullaniciId.slice(0, 6)}...</Text>
              <Text style={styles.commentText}>{y.metin}</Text>
            </View>
          ))}
        </ScrollView>
      )}
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1, // Orjinal oranını korumak için
    borderRadius: 16,
  },
  textContainer: {
    padding: 24,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  textContent: {
    fontFamily: Fonts.sans,
    fontSize: 17,
    lineHeight: 28,
    color: Colors.light.primaryText,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primaryText,
    marginTop: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  likeBtn: { backgroundColor: '#22c55e' },
  dislikeBtn: { backgroundColor: '#ef4444' },
  reportBtn: { backgroundColor: '#f59e0b' },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    paddingHorizontal: 12,
    color: Colors.light.primaryText,
  },
  commentSend: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentItem: {
    marginTop: 10,
    padding: 12,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 10,
  },
  commentAuthor: {
    fontSize: 12,
    color: Colors.light.mutedText,
    marginBottom: 6,
  },
  commentText: {
    fontSize: 15,
    color: Colors.light.primaryText,
  },
  likeBtnActive: { backgroundColor: '#16a34a' },
  dislikeBtnActive: { backgroundColor: '#dc2626' },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    marginTop: 8,
  },
  statText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.light.mutedText,
  },
});
