import type {ReactNode} from 'react';
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
  children?: ReactNode;
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

// Figma "Frame 60": drop shadow + inset top highlight + inset bottom shadow.
// Shared by the white and grayLight variants for the BangSoal "puffy" look.
const neumorphicShadow = `0px 4px 8px -4px rgba(0, 0, 0, 0.3), inset 0px -4px 4px ${colors.gray[200]}, inset 0px 4px 4px ${colors.white}`;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 9999,
    flexDirection: 'row',
    minHeight: 44,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  buttonPressed: {
    transform: [{scale: 0.985}],
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  whiteButton: {
    backgroundColor: colors.gray[50],
    boxShadow: neumorphicShadow,
    // override base overflow:hidden so the outer drop shadow isn't clipped
    overflow: 'visible',
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
    backgroundColor: colors.gray[50],
    boxShadow: neumorphicShadow,
    overflow: 'visible',
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
