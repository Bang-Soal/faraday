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
}) {
  return (
    <View>
      {label ? <FieldLabel label={label} required={required} /> : null}
      <View
        style={[
          styles.shell,
          (errorText || isOnError) && styles.shellError,
        ]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={hintText}
          placeholderTextColor="rgba(255, 255, 255, 0.47)"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          cursorColor={colors.white}
          style={styles.input}
        />
      </View>
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
}

function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
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
  shell: {
    backgroundColor: 'rgba(6, 78, 59, 0.3)',
    borderRadius: 12,
    shadowColor: colors.primary[900],
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 99,
  },
  shellError: {
    borderColor: colors.danger,
    borderWidth: 1,
  },
  input: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.bold,
    lineHeight: 17,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 16,
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
