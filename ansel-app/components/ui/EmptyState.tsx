import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  icon?: React.ReactNode;
};

export const EmptyState: React.FC<Props> = ({ title, subtitle, style, titleStyle, subtitleStyle, icon }) => {
  return (
    <View style={[styles.container, style]}>
      {icon}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    color: Colors.light.primaryText,
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.light.secondaryText,
    textAlign: 'center',
    marginTop: 6,
  },
});

export default EmptyState;
