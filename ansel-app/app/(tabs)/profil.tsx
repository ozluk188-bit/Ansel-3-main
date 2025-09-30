import { Pressable, StyleSheet, View, ActivityIndicator } from 'react-native';
import { auth } from '@/src/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';

import { Colors, Fonts } from '@/constants/theme'; // Import Colors
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';

export default function ProfilScreen() {
  const user = auth.currentUser;
  const router = useRouter();
  const [loadingLogout, setLoadingLogout] = useState(false);

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

  // Placeholder data for profile
  const userName = user?.email ? user.email.split('@')[0] : 'Misafir';
  const userBio = 'Dijital süreçleri optimize eden, kalemleriyle üreten';
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
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" font="bold" style={styles.headerTitle}>Profil</ThemedText>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <ThemedText style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</ThemedText>
        </View>

        {/* Name */}
        <ThemedText type="title" font="bold" style={styles.userName}>{userName}</ThemedText>

        {/* Bio */}
        <ThemedText type="secondary" style={styles.userBio}>{userBio}</ThemedText>

        {/* Stats */}
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

        {/* Action buttons */}
        <View style={styles.actionButtonsContainer}>
          <GradientButton
            title="Düzenle"
            onPress={() => console.log('Edit Profile')}
            style={styles.actionButton}
          />
          <Pressable
            onPress={() => console.log('Send Message')}
            style={[styles.actionButton, styles.messageButtonOutline]}
          >
            <ThemedText type="default" font="semiBold" style={styles.messageButtonText}>Mesaj</ThemedText>
          </Pressable>
        </View>

        {/* Content Cards (Placeholder) */}
        <View style={styles.contentCardsContainer}>
          <Card style={styles.contentCardPlaceholder}>
            <View style={styles.contentCardImagePlaceholder} />
            <View style={styles.contentCardTextPlaceholder} />
          </Card>
          <Card style={styles.contentCardPlaceholder}>
            <View style={styles.contentCardImagePlaceholder} />
            <View style={styles.contentCardTextPlaceholder} />
          </Card>
        </View>

        {/* Logout Button */}
        <Pressable onPress={handleLogout} disabled={loadingLogout} style={styles.logoutButton}>
          {loadingLogout ? (
            <ActivityIndicator color={Colors.light.primaryText} />
          ) : (
            <ThemedText type="link" style={styles.logoutButtonText}>Çıkış Yap</ThemedText>
          )}
        </Pressable>
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
    alignItems: 'center',
    paddingTop: 60, // Adjust for header
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.light.primaryText,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontFamily: Fonts.sans, // Directly use the loaded font name
    fontSize: 40,
    fontWeight: '700',
    color: Colors.light.accent,
  },
  userName: {
    marginBottom: 5,
    color: Colors.light.primaryText,
  },
  userBio: {
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.light.secondaryText,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 15,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  messageButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.6,
    borderColor: Colors.light.accent,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageButtonText: {
    color: Colors.light.accent,
  },
  contentCardsContainer: {
    width: '100%',
  },
  contentCardPlaceholder: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  contentCardImagePlaceholder: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.light.lightBlue,
    marginRight: 15,
  },
  contentCardTextPlaceholder: {
    flex: 1,
    height: 16,
    borderRadius: 6,
    backgroundColor: Colors.light.mutedText,
    opacity: 0.2,
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 10,
  },
  logoutButtonText: {
    color: Colors.light.mutedText,
    fontSize: 16,
  },
});