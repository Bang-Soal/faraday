import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AuthLayout} from '../../../components/Layout/AuthLayout';
import {BackButton} from '../../../components/IconButton/BackButton';
import {BangSoalTextField} from '../../../components/TextField/BangSoalTextField';
import {BangSoalButton} from '../../../components/Button/BangSoalButton';
import {colors, fonts, fontWeights} from '../../../theme';
import {isValidEmail} from '../../../utils/validation';
import {GoogleAuthButton} from '../components/GoogleAuthButton';

export function SignUpScreen({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: (email: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();

  const submit = () => {
    if (!email) {
      setError('Email tidak boleh kosong');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Email tidak valid');
      return;
    }
    setError(undefined);
    onContinue(email);
  };

  return (
    <AuthLayout>
      <View style={styles.headingBlock}>
        <BackButton onPress={onBack} />
        <View style={styles.headingTextWrap}>
          <Text style={styles.title}>
            Mulai latihan UTBK dan UM kamu bersama BangSoal!
          </Text>
        </View>
      </View>

      <View style={styles.formBlock}>
        <BangSoalTextField
          hintText="Email"
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (error) setError(undefined);
          }}
          keyboardType="email-address"
          errorText={error}
        />
        <View style={styles.formSpacing14} />
        <BangSoalButton label="Lanjut" variant="white" onPress={submit} />
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>atau</Text>
          <View style={styles.divider} />
        </View>
        <GoogleAuthButton />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  headingBlock: {
    alignItems: 'flex-start',
  },
  headingTextWrap: {
    paddingTop: 50,
  },
  title: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 38,
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
    lineHeight: 47.5,
  },
  formBlock: {
    alignItems: 'stretch',
  },
  formSpacing14: {
    height: 14,
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 20,
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.semiBold,
    lineHeight: 19,
  },
});
