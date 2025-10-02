import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastOptions = {
  type?: ToastType;
  duration?: number; // ms
};

type ToastContextType = {
  show: (message: string, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const TYPE_COLORS: Record<ToastType, string> = {
  success: '#16a34a',
  error: '#dc2626',
  info: Colors.light.accent,
  warning: '#f59e0b',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }>= ({ children }) => {
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<ToastType>('info');
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
      Animated.timing(translateY, { toValue: 20, duration: 180, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
    ]).start();
  }, [opacity, translateY]);

  const show = useCallback((msg: string, opts?: ToastOptions) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(msg);
    setType(opts?.type ?? 'info');
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
    ]).start();
    timeoutRef.current = setTimeout(hide, opts?.duration ?? 2200);
  }, [hide, opacity, translateY]);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[styles.container, { opacity, transform: [{ translateY }] }]}
      >
        {message ? (
          <View style={[styles.toast, { backgroundColor: TYPE_COLORS[type] }]}> 
            <Text style={styles.text}>{message}</Text>
          </View>
        ) : null}
      </Animated.View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  text: {
    color: Colors.light.white,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
});

export default ToastProvider;
