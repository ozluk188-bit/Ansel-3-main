
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';

// Önceki ekrandan gelen Icerik interface'i ile aynı yapıyı kullanabiliriz.
interface Icerik {
  id: string;
  tip: 'yazi' | 'foto';
  metin?: string;
  medyaURL?: string;
  olusturanId: string;
  // Timestamp gibi diğer alanlar da olabilir.
}

export default function IcerikDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [icerik, setIcerik] = useState<Icerik | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      Alert.alert('Hata', "İçerik ID'si bulunamadı.");
      return;
    }

    setLoading(true);
    const docRef = doc(db, 'icerikler', id);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setIcerik({ id: doc.id, ...doc.data() } as Icerik);
      } else {
        Alert.alert('Hata', 'Bu içerik artık mevcut değil.');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

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
});
