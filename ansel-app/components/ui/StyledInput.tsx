import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';
import { Colors } from '@/constants/theme'; // Import Colors
import { useColorScheme } from '@/hooks/use-color-scheme';

interface StyledInputProps extends TextInputProps {
  // You can add custom props here if needed
}

export function StyledInput({ style, placeholderTextColor, ...rest }: StyledInputProps) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme as 'light' | 'dark'];
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { backgroundColor: C.inputBackground, color: C.primaryText }, style]}
        placeholderTextColor={placeholderTextColor || C.placeholderText}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 12, // Apply border radius to container for shadow
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.light.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Inter_700Bold', // Directly use the loaded font name
    color: Colors.light.primaryText,
  },
});
