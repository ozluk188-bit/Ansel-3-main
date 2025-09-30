/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

console.log("!!!!!!!!!! DEBUGGING THEME.TS !!!!!!!!!!");
console.log("Platform.OS:", Platform.OS);

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
  },
  dark: {
    // Keeping dark theme as is for now, as the new designs are light-themed.
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',

    // Icon colors
    icon: '#9BA1A6',
    iconDefault: '#9BA1A6',
    iconSelected: '#fff',  

    // Tab bar colors
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
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