import React, {useState} from 'react';
import {SignInScreen} from '../../features/auth/screens/SignInScreen';
import {SignUpScreen} from '../../features/auth/screens/SignUpScreen';
import {SignUpOtpScreen} from '../../features/auth/screens/SignUpOtpScreen';
import {OnboardingIntroScreen} from '../../features/onboarding/screens/OnboardingIntroScreen';
import {ProfileOnboardingScreen} from '../../features/onboarding/screens/ProfileOnboardingScreen';
import {AppScreen} from './types';

export function AppNavigator() {
  const [screen, setScreen] = useState<AppScreen>('intro');
  const [emailForOtp, setEmailForOtp] = useState('');

  const goToOtp = (email: string) => {
    setEmailForOtp(email);
    setScreen('otp');
  };

  if (screen === 'signIn') {
    return (
      <SignInScreen
        onBack={() => setScreen('intro')}
        onSignedIn={() => setScreen('onboarding')}
      />
    );
  }

  if (screen === 'signUp') {
    return <SignUpScreen onBack={() => setScreen('intro')} onContinue={goToOtp} />;
  }

  if (screen === 'otp') {
    return (
      <SignUpOtpScreen
        email={emailForOtp}
        onBack={() => setScreen('signUp')}
        onVerified={() => setScreen('onboarding')}
      />
    );
  }

  if (screen === 'onboarding') {
    return <ProfileOnboardingScreen onLogout={() => setScreen('intro')} />;
  }

  return (
    <OnboardingIntroScreen
      onSignIn={() => setScreen('signIn')}
      onSignUp={() => setScreen('signUp')}
    />
  );
}
