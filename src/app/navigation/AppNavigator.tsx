import {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuthStore} from '../store/authStore';
import {colors} from '../../theme';
import {AuthStack} from './AuthStack';
import {MainTabs} from './MainTabs';
import {ProfileOnboardingScreen} from '../../features/onboarding/screens/ProfileOnboardingScreen';
import {SubscriptionScreen} from '../../features/payment/screens/SubscriptionScreen';
import {RootStackParamList} from './types';

const OnboardingStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function OnboardingFlow() {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <OnboardingStack.Screen
        name="Onboarding"
        component={ProfileOnboardingScreen}
      />
    </OnboardingStack.Navigator>
  );
}

export function AppNavigator() {
  const token = useAuthStore(state => state.token);
  const onboardDate = useAuthStore(state => state.user?.onboard_date);
  const isHydrated = useAuthStore(state => state.isHydrated);
  const hydrate = useAuthStore(state => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  // Auth state decides which navigator mounts (standard RN auth-flow pattern).
  return (
    <NavigationContainer>
      {!token ? (
        <AuthStack />
      ) : !onboardDate ? (
        <OnboardingFlow />
      ) : (
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {backgroundColor: 'transparent'},
          }}>
          <RootStack.Screen name="Main" component={MainTabs} />
          <RootStack.Screen name="Langganan" component={SubscriptionScreen} />
        </RootStack.Navigator>
      )}
    </NavigationContainer>
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
