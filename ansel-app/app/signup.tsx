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
import { LinearGradient } from 'expo-linear-gradient';

import { auth, db } from '@/src/firebaseConfig';
import {
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { Colors, Fonts } from '@/constants/theme';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (loading) return;
    if (password !== confirmPassword) {
      Alert.alert('Kayıt Hatası', 'Şifreler uyuşmuyor.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Firestore'da kullanıcı belgesi oluştur
      await setDoc(doc(db, 'kullanicilar', user.uid), {
        ad: fullName,
        email: user.email,
        photoURL: '', // Başlangıçta boş
        uid: user.uid,
      });

      router.replace('/(tabs)/kalemler');
    } catch (error: any) {
      console.error('Authentication error (Register):', error);
      let errorMessage = 'Bilinmeyen bir hata oluştu.';
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      Alert.alert('Kayıt Hatası', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/login');
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
      <Text style={styles.title}>Kayıt Ol</Text>

      {/* Input fields */}
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="Ad Soyad"
          placeholderTextColor={Colors.light.placeholderText}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
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
        <TextInput
          style={styles.input}
          placeholder="Şifre (Tekrar)"
          placeholderTextColor={Colors.light.placeholderText}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      {/* Sign Up button */}
      <Pressable onPress={handleRegister} disabled={loading} style={styles.signUpButtonWrapper}>
        <LinearGradient
          colors={[Colors.light.accentStart, Colors.light.accentEnd]}
          style={styles.signUpButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {loading ? (
            <ActivityIndicator color={Colors.light.white} />
          ) : (
            <Text style={styles.signUpButtonText}>Kayıt Ol</Text>
          )}
        </LinearGradient>
      </Pressable>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>veya</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social sign up buttons */}
      <Pressable style={styles.socialButton}>
        <Text style={styles.socialButtonText}>Google ile kayıt ol</Text>
      </Pressable>
      <Pressable style={styles.socialButton}>
        <Text style={styles.socialButtonText}>Apple ile kayıt ol</Text>
      </Pressable>

      {/* Already have account link */}
      <Pressable onPress={navigateToLogin} style={styles.loginLinkContainer}>
        <Text style={styles.loginText}>
          Zaten hesabın var mı?{' '}
          <Text style={styles.loginLink}>Giriş Yap</Text>
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
    paddingHorizontal: 40,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
  logoText: {
    fontFamily: Fonts.sans,
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.accent,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.primaryText,
    marginBottom: 20,
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
  signUpButtonWrapper: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  signUpButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
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
    backgroundColor: 'transparent',
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
  loginLinkContainer: {
    marginTop: 20,
  },
  loginText: {
    fontFamily: Fonts.sans,
    color: Colors.light.secondaryText,
    fontSize: 14,
  },
  loginLink: {
    fontFamily: Fonts.sans,
    color: Colors.light.accent,
    fontWeight: '600',
  },
});