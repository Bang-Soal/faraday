import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AuthLayout} from '../../../components/Layout/AuthLayout';
import {BackButton} from '../../../components/IconButton/BackButton';
import {BangSoalTextField} from '../../../components/TextField/BangSoalTextField';
import {BangSoalButton} from '../../../components/Button/BangSoalButton';
import {colors, fonts, fontWeights} from '../../../theme';
import {isValidEmail} from '../../../utils/validation';
import {FieldErrors} from '../types';
import {GoogleAuthButton} from '../components/GoogleAuthButton';

export function SignInScreen({
  onBack,
  onSignedIn,
}: {
  onBack: () => void;
  onSignedIn: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const hasError = Object.keys(errors).some(key => errors[key]);

  const submit = () => {
    const nextErrors: FieldErrors = {};
    if (!email) {
      nextErrors.email = 'Email tidak boleh kosong';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'Email tidak valid';
    }
    if (!password) {
      nextErrors.password = 'Password tidak boleh kosong';
    } else if (password.length < 8) {
      nextErrors.password = 'Password minimal 8 karakter';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSignedIn();
    }
  };

  return (
    <AuthLayout>
      <View style={styles.headingBlock}>
        <BackButton onPress={onBack} />
        <View style={styles.headingTextWrap}>
          <Text style={styles.title}>Ayo lanjut latihanmu!</Text>
        </View>
      </View>

      <View style={styles.formBlock}>
        <BangSoalTextField
          hintText="Email"
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (errors.email) setErrors({...errors, email: undefined});
          }}
          keyboardType="email-address"
          errorText={errors.email}
          isOnError={hasError}
        />
        <View style={styles.fieldGap} />
        <BangSoalTextField
          hintText="Password"
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (errors.password) setErrors({...errors, password: undefined});
          }}
          secureTextEntry
          errorText={errors.password}
          isOnError={hasError}
        />
        <View style={styles.forgotWrap}>
          <Text style={styles.forgotText}>Lupa email atau password?</Text>
        </View>
        <BangSoalButton label="Masuk" variant="white" onPress={submit} />
        <View style={styles.authButtonGap} />
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
    width: '80%',
  },
  title: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 48,
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
    lineHeight: 72,
  },
  formBlock: {
    alignItems: 'stretch',
  },
  fieldGap: {
    height: 12,
  },
  forgotWrap: {
    alignItems: 'center',
    paddingBottom: 14,
    paddingTop: 12,
  },
  forgotText: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.semiBold,
    lineHeight: 17,
    textDecorationLine: 'underline',
  },
  authButtonGap: {
    height: 20,
  },
});
