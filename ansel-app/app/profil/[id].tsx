import { Pressable, StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import { auth, db } from '@/src/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';

import { Colors, Fonts } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';

interface ProfileUser {
  id: string;
  ad: string;
  email: string;
  photoURL?: string;
  bio?: string;
}

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    marginBottom: 20,
  },
  headerTitle: {
    color: Colors.light.primaryText,
    textAlign: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  avatarImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: Colors.light.background,
  },
  avatarFallback: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: Colors.light.background,
    backgroundColor: Colors.light.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.light.white,
    fontSize: 60,
    fontFamily: Fonts.sans,
    fontWeight: 'bold',
  },
  userName: {
    color: Colors.light.primaryText,
    marginBottom: 8,
    fontSize: 26,
  },
  userBio: {
    color: Colors.light.secondaryText,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  messageButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.light.accent,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14, // Adjust padding to match GradientButton height
  },
  messageButtonText: {
    color: Colors.light.accent,
  },
  logoutButton: {
    marginTop: 'auto', // Push to the bottom
    marginBottom: 40,
  },
  logoutButtonText: {
    color: Colors.light.secondaryText,
  },
});

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const currentUser = auth.currentUser;
  const isCurrentUserProfile = currentUser?.uid === id;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const userDocRef = doc(db, 'kullanicilar', id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUser({ id: userDocSnap.id, ...userDocSnap.data() } as ProfileUser);
        } else {
          console.log('No such user!');
          // Optionally, redirect or show a not found message
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleLogout = () => {
    setLoadingLogout(true);
    signOut(auth)
      .then(() => {
        router.replace('/login');
      })
      .catch((error) => {
        console.error('Logout Error', error);
      })
      .finally(() => {
        setLoadingLogout(false);
      });
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.light.accent} style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!user) {
    return <View style={styles.container}><ThemedText>Kullanıcı bulunamadı.</ThemedText></View>;
  }

  // Placeholder data for stats
  const postsCount = 120;
  const followersCount = 340;
  const followingCount = 180;

  return (
    <LinearGradient
      colors={[Colors.light.backgroundStart, Colors.light.backgroundMid, Colors.light.backgroundEnd]}
      style={styles.fullScreenGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" font="bold" style={styles.headerTitle}>{user.ad || 'Profil'}</ThemedText>
        </View>

        <View style={styles.avatarContainer}>
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <ThemedText style={styles.avatarText}>{user.ad?.charAt(0).toUpperCase()}</ThemedText>
            </View>
          )}
        </View>

        <ThemedText type="title" font="bold" style={styles.userName}>{user.ad}</ThemedText>

        <ThemedText type="secondary" style={styles.userBio}>{user.bio || 'Henüz bir bio eklenmemiş.'}</ThemedText>

        <Card style={styles.statsCard}>
          <View style={styles.statItem}>
            <ThemedText type="default" font="bold">{postsCount}</ThemedText>
            <ThemedText type="muted" style={styles.statLabel}>Gönderi</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="default" font="bold">{followersCount}</ThemedText>
            <ThemedText type="muted" style={styles.statLabel}>Takipçi</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="default" font="bold">{followingCount}</ThemedText>
            <ThemedText type="muted" style={styles.statLabel}>Takip</ThemedText>
          </View>
        </Card>

        {isCurrentUserProfile ? (
          <View style={styles.actionButtonsContainer}>
            <GradientButton
              title="Profili Düzenle"
              onPress={() => console.log('Edit Profile')}
              style={styles.actionButton}
            />
          </View>
        ) : (
          <View style={styles.actionButtonsContainer}>
            <GradientButton
              title="Takip Et"
              onPress={() => console.log('Follow User')}
              style={styles.actionButton}
            />
            <Pressable
              onPress={() => router.push(`/sohbet/${id}`)}
              style={[styles.actionButton, styles.messageButtonOutline]}
            >
              <ThemedText type="default" font="semiBold" style={styles.messageButtonText}>Mesaj</ThemedText>
            </Pressable>
          </View>
        )}

        {isCurrentUserProfile && (
          <Pressable onPress={handleLogout} disabled={loadingLogout} style={styles.logoutButton}>
            {loadingLogout ? (
              <ActivityIndicator color={Colors.light.primaryText} />
            ) : (
              <ThemedText type="link" style={styles.logoutButtonText}>Çıkış Yap</ThemedText>
            )}
          </Pressable>
        )}
      </View>
    </LinearGradient>
  );
}