import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme'; // Import Colors

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor || Colors.light.background, dark: darkColor || Colors.dark.background },
    'background' // This 'background' key is still needed for the useThemeColor logic
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
