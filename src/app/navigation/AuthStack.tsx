import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OnboardingIntroScreen} from '../../features/onboarding/screens/OnboardingIntroScreen';
import {SignInScreen} from '../../features/auth/screens/SignInScreen';
import {SignUpScreen} from '../../features/auth/screens/SignUpScreen';
import {SignUpOtpScreen} from '../../features/auth/screens/SignUpOtpScreen';
import {AuthStackParamList} from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // each screen renders its own full-screen AuthLayout (green mesh bg)
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Intro" component={OnboardingIntroScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Otp" component={SignUpOtpScreen} />
    </Stack.Navigator>
  );
}
