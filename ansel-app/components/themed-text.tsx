import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors, Fonts } from '@/constants/theme'; // Import Colors and Fonts

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'subtitle' | 'link' | 'primary' | 'secondary' | 'muted';
  font?: 'default' | 'semiBold' | 'bold'; // New font prop
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  font = 'default', // Default font weight
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor },
    type === 'primary' ? 'primaryText' :
    type === 'secondary' ? 'secondaryText' :
    type === 'muted' ? 'mutedText' :
    type === 'link' ? 'accent' :
    'primaryText' // Default to primaryText
  );

  const fontFamily = Fonts.sans; // Use the sans font from the theme
  let fontWeight: 'normal' | 'bold' | '600' | '700' = 'normal';

  switch (font) {
    case 'semiBold':
      fontWeight = '600';
      break;
    case 'bold':
      fontWeight = '700';
      break;
    default:
      fontWeight = 'normal';
      break;
  }

  return (
    <Text
      style={[
        { color, fontFamily, fontWeight }, // Apply font family and weight
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 28, // Adjusted based on SVG
    fontWeight: '700', // Adjusted based on SVG
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20, // Adjusted based on SVG
    fontWeight: '600', // Adjusted based on SVG
  },
  link: {
    fontSize: 16,
    lineHeight: 30,
    color: Colors.light.accent, // Use theme color
  },
});
