import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, fonts, fontWeights} from '../../theme';

type ButtonVariant = 'white' | 'secondary' | 'grayLight';

export function BangSoalButton({
  label,
  variant,
  onPress,
  disabled,
  children,
  trailing,
}: {
  label?: string;
  variant: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  trailing?: string;
}) {
  const buttonStyle =
    variant === 'secondary'
      ? styles.secondaryButton
      : variant === 'grayLight'
        ? styles.grayButton
        : styles.whiteButton;

  const textStyle =
    variant === 'secondary'
      ? styles.buttonTextSecondary
      : styles.buttonTextPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        buttonStyle,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}>
      {variant === 'white' ? (
        <>
          <View style={styles.whiteButtonTopHighlight} />
          <View style={styles.whiteButtonBottomInset} />
        </>
      ) : null}
      {variant === 'secondary' ? (
        <View style={styles.secondaryButtonTopHighlight} />
      ) : null}
      {children ?? (
        <View style={styles.buttonContentRow}>
          <Text style={[textStyle, disabled && styles.disabledButtonText]}>
            {label}
          </Text>
          {trailing ? <Text style={styles.trailingIcon}>{trailing}</Text> : null}
        </View>
      )}
    </Pressable>
  );
}

export const buttonTextStyles = StyleSheet.create({
  primary: {
    color: colors.primary[600],
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
    lineHeight: 20,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 30,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  buttonPressed: {
    transform: [{scale: 0.985}],
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  whiteButton: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  whiteButtonTopHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  whiteButtonBottomInset: {
    backgroundColor: 'rgba(107, 114, 128, 0.25)',
    bottom: 0,
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  secondaryButton: {
    backgroundColor: 'rgba(209, 250, 229, 0.4)',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  secondaryButtonTopHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  grayButton: {
    backgroundColor: '#F3F4F6',
  },
  buttonContentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  buttonTextPrimary: buttonTextStyles.primary,
  buttonTextSecondary: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 18,
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
    lineHeight: 22,
    textAlign: 'center',
  },
  disabledButtonText: {
    color: colors.primary[600],
  },
  trailingIcon: {
    color: colors.primary[600],
    fontFamily: fonts.quicksand,
    fontSize: 20,
    fontWeight: fontWeights.bold,
    lineHeight: 20,
    marginLeft: 8,
  },
});
