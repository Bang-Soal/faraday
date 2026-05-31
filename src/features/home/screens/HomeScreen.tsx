import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AuthLayout} from '../../../components/Layout/AuthLayout';
import {BangSoalButton} from '../../../components/Button/BangSoalButton';
import {colors, fonts, fontWeights} from '../../../theme';
import {useAuthStore} from '../../../app/store/authStore';

/**
 * Placeholder landing for onboarded users. The real dashboard is Phase 8;
 * for now this confirms a session exists and hosts logout.
 */
export function HomeScreen() {
  const user = useAuthStore(state => state.user);
  const clear = useAuthStore(state => state.clear);

  return (
    <AuthLayout>
      <View style={styles.wrap}>
        <Text style={styles.greeting}>
          Halo, {user?.full_name ?? 'Sobat BangSoal'}!
        </Text>
        <Text style={styles.subtitle}>Kamu sudah masuk. 🎉</Text>
        <View style={styles.spacer} />
        <BangSoalButton label="Logout" variant="grayLight" onPress={() => clear()} />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 80,
  },
  greeting: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 32,
    fontWeight: fontWeights.bold,
    lineHeight: 40,
  },
  subtitle: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.semiBold,
    marginTop: 8,
  },
  spacer: {
    height: 40,
  },
});
