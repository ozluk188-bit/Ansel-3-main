
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { db, auth } from '@/src/firebaseConfig';
import { addDoc, serverTimestamp } from 'firebase/firestore';

import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { StyledInput } from '@/components/ui/StyledInput';
import { SkeletonCard, SkeletonLine } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Kalem {
  id: string;
  baslik: string;
  olusturanId: string;
  olusturmaTarihi: any;
}

export default function KalemlerScreen() {
  const [kalemler, setKalemler] = useState<Kalem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [yeniKalemBaslik, setYeniKalemBaslik] = useState('');
  const [loadingAddKalem, setLoadingAddKalem] = useState(false);
  const [loading, setLoading] = useState(true);
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme as 'light' | 'dark'];

  useEffect(() => {
    const q = query(collection(db, 'kalemler'), orderBy('olusturmaTarihi', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const kalemlerData: Kalem[] = [];
      querySnapshot.forEach((doc) => {
        kalemlerData.push({ id: doc.id, ...doc.data() } as Kalem);
      });
      setKalemler(kalemlerData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddKalem = async () => {
    if (yeniKalemBaslik.trim() === '' || !auth.currentUser) return;
    setLoadingAddKalem(true);

    try {
      await addDoc(collection(db, 'kalemler'), {
        baslik: yeniKalemBaslik,
        olusturanId: auth.currentUser.uid,
        olusturmaTarihi: serverTimestamp(),
      });
      setYeniKalemBaslik('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding document: ', error);
    } finally {
      setLoadingAddKalem(false);
    }
  };

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
          <ThemedText type="title" font="bold" style={[styles.headerTitle, { color: C.primaryText }]}>Kalemler</ThemedText>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 8 }}>
            {[...Array(6)].map((_, i) => (
              <Card key={i} style={{ marginVertical: 8, marginHorizontal: 16, padding: 15 }}>
                <SkeletonLine width={'70%'} height={18} />
                <SkeletonLine width={'40%'} height={14} style={{ marginTop: 10 }} />
              </Card>
            ))}
          </View>
        ) : (
        <FlatList
          data={kalemler}
          keyExtractor={(item: Kalem) => item.id}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <Link href={`/kalem/${item.id}`} asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Kaleme git: ${item.baslik}`}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Card style={[styles.kalemCard, { backgroundColor: C.cardBackground }] }>
                  <ThemedText type="subtitle" font="semiBold" style={styles.kalemTitle}>{item.baslik}</ThemedText>
                  {/* Kalem listesinde oluşturucu bilgisi ve sayaçlar gösterilmez */}
                </Card>
              </Pressable>
            </Link>
          )}
          ListEmptyComponent={
            <EmptyState title="Henüz kalem yok." subtitle="İlkini sen ekleyebilirsin." style={styles.emptyContainer} />
          }
        />
        )}

        {/* Yeni Kalem Ekleme Modalı */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalView, { backgroundColor: C.cardBackground }]}>
              <ThemedText type="title" font="bold" style={[styles.modalTitle, { color: C.primaryText }]}>Yeni Kalem Oluştur</ThemedText>
              <StyledInput
                placeholder="Kalem başlığı..."
                value={yeniKalemBaslik}
                onChangeText={setYeniKalemBaslik}
                style={{ marginBottom: 20 }}
              />
              <GradientButton
                title="Oluştur"
                onPress={handleAddKalem}
                loading={loadingAddKalem}
                style={{ marginBottom: 10 }}
                accessibilityLabel="Yeni kalemi oluştur"
              />
              <Pressable onPress={() => setModalVisible(false)} accessibilityRole="button" accessibilityLabel="İptal et" hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <ThemedText type="link">İptal</ThemedText>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Yeni Kalem Ekle Butonu */}
        <GradientButton
          title="+" // Using + as title for FAB
          onPress={() => setModalVisible(true)}
          style={styles.fab}
          startColor={C.accentStart}
          endColor={C.accentEnd}
          textColor={C.white}
          accessibilityLabel="Yeni kalem oluştur"
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
  flatListContent: {
    paddingBottom: 100, // Space for FAB
  },
  kalemCard: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 15,
  },
  kalemCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.lightBlue,
    marginRight: 10,
  },
  kalemTitle: {
    marginBottom: 10,
  },
  kalemStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 80, // Larger for +
    height: 80, // Larger for +
    borderRadius: 40, // Half of width/height for perfect circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  modalTitle: {
    marginBottom: 15,
    color: Colors.light.primaryText,
  },
});
