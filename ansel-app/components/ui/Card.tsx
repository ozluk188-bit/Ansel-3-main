import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '@/constants/theme';

interface CardProps extends ViewProps {
  // You can add custom props here if needed
}

export function Card({ style, children, ...rest }: CardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
});
