/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light | keyof typeof Colors.dark // Allow colorName to be in either
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Safely access color, falling back to a default or undefined if not found
    // For light theme, prioritize light colors
    if (theme === 'light' && Colors.light[colorName as keyof typeof Colors.light]) {
      return Colors.light[colorName as keyof typeof Colors.light];
    }
    // For dark theme, prioritize dark colors
    if (theme === 'dark' && Colors.dark[colorName as keyof typeof Colors.dark]) {
      return Colors.dark[colorName as keyof typeof Colors.dark];
    }
    // Fallback if colorName is not found in the specific theme
    // This might happen if a light-only colorName is requested in dark theme or vice-versa
    return theme === 'dark' ? Colors.dark.text : Colors.light.primaryText; // Fallback to generic text color
  }
}
