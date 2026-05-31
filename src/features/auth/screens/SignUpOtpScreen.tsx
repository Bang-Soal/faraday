import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {useMutation} from '@tanstack/react-query';
import {AuthLayout} from '../../../components/Layout/AuthLayout';
import {BackButton} from '../../../components/IconButton/BackButton';
import {colors, fonts, fontWeights} from '../../../theme';
import {sendMailOtp, verifyMail} from '../api/authApi';
import {ApiError} from '../../../lib/api/client';
import {useAuthStore} from '../../../app/store/authStore';

export function SignUpOtpScreen({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | undefined>();
  const setSession = useAuthStore(state => state.setSession);

  // On success, setSession stores token + a user whose onboard_date is null →
  // AppNavigator routes to onboarding.
  const verifyMutation = useMutation({
    mutationFn: (code: string) => verifyMail(email, code),
    onSuccess: res => setSession(res.token, res.user),
    onError: err => {
      setOtp('');
      setError(err instanceof ApiError ? err.message : 'Kode OTP salah.');
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => sendMailOtp(email),
    onSuccess: startCooldown,
    onError: () => setError('Gagal mengirim ulang OTP.'),
  });

  function startCooldown() {
    setCooldown(10);
    const timer = setInterval(() => {
      setCooldown(current => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  }

  const updateOtp = (value: string) => {
    const numeric = value.replace(/\D/g, '').slice(0, 6);
    setOtp(numeric);
    setError(undefined);
    if (numeric.length === 6 && !verifyMutation.isPending) {
      verifyMutation.mutate(numeric);
    }
  };

  const resend = () => {
    setError(undefined);
    resendMutation.mutate();
  };

  return (
    <AuthLayout>
      <View style={styles.top}>
        <BackButton onPress={onBack} />
        <View style={styles.headingWrap}>
          <Text style={styles.title}>Kami mengirim kode OTP ke Email</Text>
        </View>
        <View style={styles.emailBadge}>
          <Text style={styles.emailBadgeText}>{email || 'email@example.com'}</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <TextInput
          value={otp}
          onChangeText={updateOtp}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.hiddenInput}
          autoFocus
        />
        <View style={styles.pinRow}>
          {Array.from({length: 6}).map((_, index) => (
            <Pressable key={index} style={styles.pinBox}>
              <Text style={styles.pinText}>{otp[index] ?? ''}</Text>
            </Pressable>
          ))}
        </View>
        {verifyMutation.isPending ? (
          <Text style={styles.statusText}>Memverifikasi...</Text>
        ) : error ? (
          <Text style={styles.statusText}>{error}</Text>
        ) : null}
        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Belum dapat OTP? </Text>
          <Pressable
            disabled={cooldown > 0 || resendMutation.isPending}
            onPress={resend}>
            <Text style={styles.resendLink}>
              {cooldown > 0
                ? ` 00:${String(cooldown).padStart(2, '0')}`
                : 'Kirim ulang'}
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.footerSpace} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  top: {
    alignItems: 'flex-start',
  },
  headingWrap: {
    paddingTop: 100,
  },
  title: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 36,
    fontWeight: fontWeights.bold,
    lineHeight: 45,
  },
  emailBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginTop: 16,
    padding: 8,
  },
  emailBadgeText: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.semiBold,
    lineHeight: 19,
  },
  bottom: {
    alignItems: 'center',
  },
  hiddenInput: {
    height: 1,
    opacity: 0,
    position: 'absolute',
    width: 1,
  },
  pinRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  pinBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(6, 78, 59, 0.3)',
    borderRadius: 8,
    height: 58,
    justifyContent: 'center',
    shadowColor: colors.primary[900],
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    width: 52,
  },
  pinText: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 24,
    fontWeight: fontWeights.semiBold,
    lineHeight: 29,
  },
  statusText: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.semiBold,
    marginTop: 18,
    textAlign: 'center',
  },
  resendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendText: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.semiBold,
    lineHeight: 17,
  },
  resendLink: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.semiBold,
    lineHeight: 17,
    textDecorationLine: 'underline',
  },
  footerSpace: {
    height: 20,
  },
});
