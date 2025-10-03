/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Background colors
    backgroundStart: '#F8FAFC',
    backgroundMid: '#CFEFF6',
    backgroundEnd: '#BEEEDC',
    background: '#FFFFFF', // Default solid background for components

    // Accent colors
    accentStart: '#4A90E2',
    accentEnd: '#50C878',
    accent: '#4A90E2', // Primary accent color

    // Text colors
    primaryText: '#2D3748',
    secondaryText: '#4A5568',
    mutedText: '#718096',
    placeholderText: '#718096',
    white: '#FFFFFF',
    lightBlue: '#E6F7FF', // Used in Kalemler and Messages for circles

    // Component specific colors
    cardBackground: '#FFFFFF',
    inputBackground: '#FFFFFF',
    inputBorder: '#E2E8F0', // A light grey for borders if needed
    divider: '#CBD5E0', // For the 'veya' divider

    // Icon colors
    icon: '#687076',
    iconDefault: '#687076',
    iconSelected: '#4A90E2', // Using accent color for selected icons

    // Tab bar colors (assuming light theme for now)
    tabIconDefault: '#687076',
    tabIconSelected: '#4A90E2',

    // State colors
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
  },
  dark: {
    // Background colors
    backgroundStart: '#0B1220',
    backgroundMid: '#0E1A2B',
    backgroundEnd: '#0F1F33',
    background: '#101418',

    // Accent colors
    accentStart: '#4A90E2',
    accentEnd: '#50C878',
    accent: '#7AB3F0',

    // Text colors
    primaryText: '#ECEDEE',
    secondaryText: '#C9D1D9',
    mutedText: '#9BA1A6',
    placeholderText: '#808891',
    white: '#FFFFFF',
    lightBlue: '#1B2A41',

    // Component specific colors
    cardBackground: '#151A20',
    inputBackground: '#0F1520',
    inputBorder: '#2A2F3A',
    divider: '#22262E',

    // Icon colors
    icon: '#9BA1A6',
    iconDefault: '#9BA1A6',
    iconSelected: '#FFFFFF',

    // Tab bar colors
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',

    // State colors
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter_700Bold', // Using the loaded font name
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter_700Bold', // Using the loaded font name
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Inter_700Bold, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", // Using the loaded font name
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

console.log("Fonts object:", Fonts);

// Export a default theme for easier access
export const defaultTheme = Colors.light;