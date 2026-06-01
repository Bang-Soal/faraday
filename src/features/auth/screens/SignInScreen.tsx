import {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import {AuthLayout} from '../../../components/Layout/AuthLayout';
import {BackButton} from '../../../components/IconButton/BackButton';
import {BangSoalTextField} from '../../../components/TextField/BangSoalTextField';
import {BangSoalButton} from '../../../components/Button/BangSoalButton';
import {colors, fonts, fontWeights} from '../../../theme';
import {isValidEmail} from '../../../utils/validation';
import {FieldErrors} from '../types';
import {GoogleAuthButton} from '../components/GoogleAuthButton';
import {loginEmail} from '../api/authApi';
import {ApiError} from '../../../lib/api/client';
import {useAuthStore} from '../../../app/store/authStore';
import {useToast} from '../../../components/Toast/ToastProvider';

/** Map every login failure to a clear Indonesian message. */
function loginErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    // 500 today means the account has no password (Google/phone signup) — newton
    // calls bcrypt.compare(input, null). Until the backend guard lands, treat it
    // as the OAuth-account case.
    if (err.status >= 500) {
      return 'Akun ini sepertinya terdaftar lewat Google. Coba masuk dengan Google.';
    }
    // 401: backend already returns a readable message:
    // "Email atau password salah!" or "Email belum terdaftar!".
    return err.message;
  }
  // fetch threw (no/blocked network) — not an ApiError.
  return 'Gagal terhubung ke server. Periksa koneksi internetmu.';
}

export function SignInScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  // true after a failed login → red field borders (cleared on edit), curie-style.
  const [loginFailed, setLoginFailed] = useState(false);
  const hasError = Object.keys(errors).some(key => errors[key]) || loginFailed;
  const setSession = useAuthStore(state => state.setSession);
  const toast = useToast();

  // On success, setSession stores the token+user; AppNavigator reacts and
  // routes by user.onboard_date (onboarding vs home).
  const loginMutation = useMutation({
    mutationFn: () => loginEmail(email, password),
    onSuccess: res => setSession(res.token, res.user),
    onError: err => {
      // curie pattern: snackbar + mark fields invalid + clear the password.
      toast.show({message: loginErrorMessage(err), variant: 'error'});
      setLoginFailed(true);
      setPassword('');
    },
  });

  const submit = () => {
    const nextErrors: FieldErrors = {};
    if (!email) {
      nextErrors.email = 'Email tidak boleh kosong';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'Email tidak valid';
    }
    // Login only requires a non-empty password — min-length is a signup rule,
    // enforcing it here would wrongly block valid existing passwords.
    if (!password) {
      nextErrors.password = 'Password tidak boleh kosong';
    }
    setErrors(nextErrors);
    setLoginFailed(false);
    if (Object.keys(nextErrors).length === 0) {
      loginMutation.mutate();
    }
  };

  return (
    <AuthLayout>
      <View style={styles.headingBlock}>
        <BackButton onPress={() => navigation.goBack()} />
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
            setLoginFailed(false);
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
            setLoginFailed(false);
            if (errors.password) setErrors({...errors, password: undefined});
          }}
          secureTextEntry
          errorText={errors.password}
          isOnError={hasError}
        />
        <View style={styles.forgotWrap}>
          <Text style={styles.forgotText}>Lupa email atau password?</Text>
        </View>
        <BangSoalButton
          label={loginMutation.isPending ? 'Memproses...' : 'Masuk'}
          variant="white"
          onPress={submit}
          disabled={loginMutation.isPending}
        />
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
