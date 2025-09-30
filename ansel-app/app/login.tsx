
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

import { auth } from '@/src/firebaseConfig';
import {
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { Colors, Fonts } from '@/constants/theme'; // Import Colors from theme

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const loginPromise = signInWithEmailAndPassword(auth, email, password);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                'İstek zaman aşımına uğradı. İnternet bağlantınızı kontrol edin.'
              )
            ),
          10000
        )
      );

      await Promise.race([loginPromise, timeoutPromise]);

      router.replace('/(tabs)/kalemler');
    } catch (error: any) {
      console.error('Authentication error (Login):', error);
      let errorMessage = 'Bilinmeyen bir hata oluştu.';
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      Alert.alert('Giriş Hatası', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push('/signup'); // Assuming a signup.tsx will be created
  };

  const navigateToForgotPassword = () => {
    // Implement navigation to forgot password screen or modal
    Alert.alert('Şifremi Unuttum', 'Şifre sıfırlama özelliği henüz mevcut değil.');
  };

  const handleGuestLogin = () => {
    router.replace('/(tabs)/kalemler');
  };

  return (
    <LinearGradient
      colors={[Colors.light.backgroundStart, Colors.light.backgroundMid, Colors.light.backgroundEnd]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>A</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Giriş Yap</Text>

      {/* Input fields */}
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          placeholderTextColor={Colors.light.placeholderText}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor={Colors.light.placeholderText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Forgot password */}
      <Pressable onPress={navigateToForgotPassword} style={styles.forgotPasswordButton}>
        <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
      </Pressable>

      {/* Login button */}
      <Pressable onPress={handleLogin} disabled={loading} style={styles.loginButtonWrapper}>
        <LinearGradient
          colors={[Colors.light.accentStart, Colors.light.accentEnd]}
          style={styles.loginButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {loading ? (
            <ActivityIndicator color={Colors.light.white} />
          ) : (
            <Text style={styles.loginButtonText}>Giriş Yap</Text>
          )}
        </LinearGradient>
      </Pressable>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>veya</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social login buttons */}
      <Pressable style={styles.socialButton}>
        <Text style={styles.socialButtonText}>Google ile devam et</Text>
      </Pressable>
      <Pressable style={styles.socialButton}>
        <Text style={styles.socialButtonText}>Apple ile devam et</Text>
      </Pressable>

      {/* Guest button */}
      <Pressable onPress={handleGuestLogin} style={styles.guestButton}>
        <Text style={styles.guestButtonText}>Misafir olarak devam et</Text>
      </Pressable>

      {/* Sign up link */}
      <Pressable onPress={navigateToRegister} style={styles.signUpLinkContainer}>
        <Text style={styles.signUpText}>
          Hesabın yok mu?{' '}
          <Text style={styles.signUpLink}>Kayıt Ol</Text>
        </Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40, // Adjusted padding
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Adjusted margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: {
    fontFamily: Fonts.sans,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.accent,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.primaryText,
    marginBottom: 30, // Adjusted margin
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.light.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.light.primaryText,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.light.accent,
  },
  loginButtonWrapper: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    overflow: 'hidden', // Ensure gradient respects border radius
    marginBottom: 20,
  },
  loginButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontFamily: Fonts.sans,
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.divider,
  },
  dividerText: {
    fontFamily: Fonts.sans,
    color: Colors.light.mutedText,
    fontSize: 12,
    marginHorizontal: 10,
    backgroundColor: 'transparent', // Ensure text background is transparent over gradient
  },
  socialButton: {
    width: '100%',
    height: 44,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  socialButtonText: {
    fontFamily: Fonts.sans,
    color: Colors.light.primaryText,
    fontSize: 14,
  },
  guestButton: {
    marginTop: 15,
  },
  guestButtonText: {
    fontFamily: Fonts.sans,
    color: Colors.light.secondaryText,
    fontSize: 14,
    textAlign: 'center',
  },
  signUpLinkContainer: {
    marginTop: 20,
  },
  signUpText: {
    fontFamily: Fonts.sans,
    color: Colors.light.secondaryText,
    fontSize: 14,
  },
  signUpLink: {
    fontFamily: Fonts.sans,
    color: Colors.light.accent,
    fontWeight: '600',
  },
});
