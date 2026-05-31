import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {fonts, fontWeights} from '../../theme';
import {TOAST_VARIANTS, ToastVariant} from './toastConfig';

type ToastInput = {message: string; variant?: ToastVariant};
type ToastContextValue = {show: (input: ToastInput) => void};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within <ToastProvider>');
  }
  return ctx;
}

const VISIBLE_MS = 2400;

/**
 * Floating top toast, modeled on curie's BangSoalSnackbar: slides in from the
 * top, auto-dismisses, one at a time. Use via useToast().show({message, variant}).
 */
export function ToastProvider({children}: {children: React.ReactNode}) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastInput | null>(null);
  const translateY = useRef(new Animated.Value(-140)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -140,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => setToast(null));
  }, [opacity, translateY]);

  const show = useCallback(
    (input: ToastInput) => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
      setToast(input);
      translateY.setValue(-140);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          bounciness: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      hideTimer.current = setTimeout(hide, VISIBLE_MS);
    },
    [hide, opacity, translateY],
  );

  const style = toast ? TOAST_VARIANTS[toast.variant ?? 'success'] : null;
  const Icon = style?.Icon;

  return (
    <ToastContext.Provider value={{show}}>
      {children}
      {toast && style ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.host,
            {top: insets.top + 8, opacity, transform: [{translateY}]},
          ]}>
          <View style={[styles.card, {backgroundColor: style.background}]}>
            {Icon ? <Icon size={26} color={style.color} /> : null}
            <Text
              style={[styles.message, {color: style.color}]}
              numberOfLines={3}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  host: {
    left: 12,
    position: 'absolute',
    right: 12,
  },
  card: {
    alignItems: 'center',
    borderRadius: 24,
    boxShadow:
      '0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
    flexDirection: 'row',
    gap: 10,
    padding: 16,
  },
  message: {
    flex: 1,
    fontFamily: fonts.quicksand,
    fontSize: 15,
    fontWeight: fontWeights.semiBold,
    lineHeight: 19,
  },
});
