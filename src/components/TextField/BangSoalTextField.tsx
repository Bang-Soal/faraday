import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {colors, fonts, fontWeights} from '../../theme';

type KeyboardType = 'default' | 'email-address' | 'number-pad' | 'phone-pad';

export function BangSoalTextField({
  hintText,
  value,
  onChangeText,
  label,
  required,
  secureTextEntry,
  keyboardType,
  errorText,
  isOnError,
  leadingIcon,
  trailingIcon,
}: {
  hintText: string;
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardType;
  errorText?: string;
  isOnError?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}) {
  const invalid = !!(errorText || isOnError);
  return (
    <View>
      {label ? <FieldLabel label={label} required={required} /> : null}
      <View style={[styles.shell, invalid && styles.shellError]}>
        {leadingIcon}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={hintText}
          placeholderTextColor="rgba(236, 253, 245, 0.5)"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          cursorColor={colors.primary[50]}
          style={styles.input}
        />
        {trailingIcon}
      </View>
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
}

function FieldLabel({label, required}: {label: string; required?: boolean}) {
  return (
    <View style={styles.labelRow}>
      <Text style={styles.label}>{label}</Text>
      {required ? <Text style={styles.requiredMark}> *</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    lineHeight: 19,
  },
  requiredMark: {
    color: colors.danger,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    lineHeight: 19,
  },
  // Figma "Frame 63": translucent dark-green field — bg rgba(6,78,59,0.3),
  // inset highlight + inner top shadow, 6px radius, 12px padding, 10px gap, h44.
  // Array boxShadow form (more reliable than the string parser in RN).
  shell: {
    alignItems: 'center',
    backgroundColor: 'rgba(6, 78, 59, 0.3)',
    borderRadius: 6,
    boxShadow: [
      {
        inset: true,
        offsetX: 0,
        offsetY: -2,
        blurRadius: 0,
        spreadDistance: -1,
        color: 'rgba(255, 255, 255, 0.5)',
      },
      {
        inset: true,
        offsetX: 0,
        offsetY: 3,
        blurRadius: 4,
        spreadDistance: -1,
        color: 'rgba(6, 78, 59, 0.15)',
      },
    ],
    flexDirection: 'row',
    gap: 10,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  shellError: {
    borderColor: colors.danger,
    borderWidth: 1,
  },
  input: {
    color: colors.primary[50],
    flex: 1,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.semiBold,
    lineHeight: 20,
    padding: 0,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fonts.quicksand,
    fontSize: 12,
    fontWeight: fontWeights.semiBold,
    lineHeight: 15,
    paddingLeft: 8,
    paddingTop: 4,
  },
});
