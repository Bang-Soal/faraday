import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useAuthStore} from '../store/authStore';
import {colors} from '../../theme';
import {SignInScreen} from '../../features/auth/screens/SignInScreen';
import {SignUpScreen} from '../../features/auth/screens/SignUpScreen';
import {SignUpOtpScreen} from '../../features/auth/screens/SignUpOtpScreen';
import {OnboardingIntroScreen} from '../../features/onboarding/screens/OnboardingIntroScreen';
import {ProfileOnboardingScreen} from '../../features/onboarding/screens/ProfileOnboardingScreen';
import {HomeScreen} from '../../features/home/screens/HomeScreen';

type AuthScreen = 'intro' | 'signIn' | 'signUp' | 'otp';

export function AppNavigator() {
  const token = useAuthStore(state => state.token);
  const onboardDate = useAuthStore(state => state.user?.onboard_date);
  const isHydrated = useAuthStore(state => state.isHydrated);
  const hydrate = useAuthStore(state => state.hydrate);

  const [authScreen, setAuthScreen] = useState<AuthScreen>('intro');
  const [emailForOtp, setEmailForOtp] = useState('');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Avoid a flash of the intro before the persisted session loads.
  if (!isHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  // Authenticated: route by the backend onboarding flag (take #1).
  if (token) {
    return onboardDate ? <HomeScreen /> : <ProfileOnboardingScreen />;
  }

  // Unauthenticated stack.
  if (authScreen === 'signIn') {
    return <SignInScreen onBack={() => setAuthScreen('intro')} />;
  }
  if (authScreen === 'signUp') {
    return (
      <SignUpScreen
        onBack={() => setAuthScreen('intro')}
        onOtpSent={email => {
          setEmailForOtp(email);
          setAuthScreen('otp');
        }}
      />
    );
  }
  if (authScreen === 'otp') {
    return (
      <SignUpOtpScreen
        email={emailForOtp}
        onBack={() => setAuthScreen('signUp')}
      />
    );
  }
  return (
    <OnboardingIntroScreen
      onSignIn={() => setAuthScreen('signIn')}
      onSignUp={() => setAuthScreen('signUp')}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    flex: 1,
    justifyContent: 'center',
  },
});
