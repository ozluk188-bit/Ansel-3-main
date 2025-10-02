import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  icon?: React.ReactNode;
  actionTitle?: string;
  onPress?: () => void;
};

export const EmptyState: React.FC<Props> = ({ title, subtitle, style, titleStyle, subtitleStyle, icon, actionTitle, onPress }) => {
  return (
    <View style={[styles.container, style]}>
      {icon}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
      {actionTitle && onPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionTitle}
          onPress={onPress}
          style={styles.button}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.buttonText}>{actionTitle}</Text>
        </Pressable>
      ) : null}
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
  button: {
    marginTop: 12,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.light.white,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
});

export default EmptyState;
