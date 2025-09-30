
import { collection, getDocs, query, where } from 'firebase/firestore';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

import { db, auth } from '@/src/firebaseConfig';
import { ThemedText } from '@/components/themed-text';

interface User {
  id: string;
  ad: string;
  email: string;
}

export default function KullanicilarScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const usersCollection = collection(db, 'kullanicilar');
        // Mevcut kullanıcıyı listelememek için sorgu
        const q = query(usersCollection, where('uid', '!=', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const usersData: User[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          usersData.push({
            id: doc.id,
            ad: data.ad || 'İsimsiz',
            email: data.email,
          });
        });
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const handleUserPress = (user: User) => {
    // Kullanıcıya tıklandığında sohbet ekranına yönlendir
    // Sohbet ekranı `app/sohbet/[id].tsx` olarak oluşturulacak
    router.push(`/sohbet/${user.id}`);
  };

  const renderItem = ({ item }: { item: User }) => (
    <Pressable style={styles.userItem} onPress={() => handleUserPress(item)}>
      <View>
        <ThemedText style={styles.userName}>{item.ad}</ThemedText>
        <ThemedText style={styles.userEmail}>{item.email}</ThemedText>
      </View>
    </Pressable>
  );

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" color="#4A90E2" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<ThemedText style={styles.emptyText}>Sohbet edilecek kullanıcı bulunamadı.</ThemedText>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});
