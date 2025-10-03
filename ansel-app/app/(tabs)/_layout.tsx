import { Tabs, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { auth, db } from '@/src/firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { t } from '@/src/i18n';

export default function TabLayout() {
  const [unreadTotal, setUnreadTotal] = useState<number>(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) { setUnreadTotal(0); return; }
    const chatsCol = collection(db, 'chats');
    const q = query(chatsCol, where('participants', 'array-contains', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      let sum = 0;
      snap.forEach((d: any) => {
        const data = d.data() as any;
        if (data?.unreadCount && data.unreadCount[user.uid]) sum += Number(data.unreadCount[user.uid]) || 0;
      });
      setUnreadTotal(sum);
    });
    return () => unsub();
  }, [auth.currentUser?.uid]);

  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme as 'light' | 'dark'];

  const MessageIcon = ({ color, size }: { color: string; size: number }) => (
    <View>
      <Feather name="message-circle" size={size} color={color} />
      {unreadTotal > 0 && (
        <View style={[styles.badge, { backgroundColor: C.error }]}>
          <Text style={[styles.badgeText, { color: C.white }]}>{unreadTotal > 99 ? '99+' : unreadTotal}</Text>
        </View>
      )}
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.tabIconDefault,
      }}>
      <Tabs.Screen
        name="kalemler"
        options={{
          title: t('kalemler_title'),
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mesajlar"
        options={{
          title: t('messages_title'),
          headerShown: true,
          tabBarIcon: ({ color, size }) => <MessageIcon color={color} size={size} />,
          headerRight: () => (
            <Pressable onPress={() => router.push('/kullanicilar')} style={{ marginRight: 15 }} accessibilityLabel={t('start_new_chat')}>
              <Feather name="plus-square" size={24} color={C.accent} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: t('profile_title'),
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#ef4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});