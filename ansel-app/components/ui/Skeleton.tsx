import React from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';

const Shimmer: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const opacity = React.useRef(new Animated.Value(0.3)).current;
  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[styles.shimmer, style, { opacity }]} />;
};

export const SkeletonLine: React.FC<{ width?: number | string; height?: number; style?: ViewStyle }> = ({ width = '100%', height = 14, style }) => (
  <Shimmer style={[styles.base, { width, height, borderRadius: 6 }, style]} />
);

export const SkeletonAvatar: React.FC<{ size?: number; style?: ViewStyle }> = ({ size = 40, style }) => (
  <Shimmer style={[styles.base, { width: size, height: size, borderRadius: size / 2 }, style]} />
);

export const SkeletonCard: React.FC<{ height?: number; style?: ViewStyle }> = ({ height = 120, style }) => (
  <Shimmer style={[styles.base, { height, borderRadius: 12 }, style]} />
);

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#E5E7EB',
  },
  shimmer: {
    backgroundColor: '#E5E7EB',
  },
});

export default { SkeletonLine, SkeletonAvatar, SkeletonCard };
