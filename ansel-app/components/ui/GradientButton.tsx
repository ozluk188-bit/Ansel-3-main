import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, PressableProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme'; // Import Colors

interface GradientButtonProps extends PressableProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  startColor?: string;
  endColor?: string;
  textColor?: string;
}

export function GradientButton({
  title,
  onPress,
  loading = false,
  startColor = Colors.light.accentStart,
  endColor = Colors.light.accentEnd,
  textColor = Colors.light.white,
  style,
  ...rest
}: GradientButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={(state) => [
        styles.buttonWrapper,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      <LinearGradient
        colors={[startColor, endColor]}
        style={styles.buttonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter_700Bold', // Directly use the loaded font name
    fontSize: 16,
    fontWeight: '700',
  },
});
