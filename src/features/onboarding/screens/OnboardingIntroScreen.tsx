import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AuthLayout} from '../../../components/Layout/AuthLayout';
import {BangSoalButton} from '../../../components/Button/BangSoalButton';
import {colors, fonts, fontWeights} from '../../../theme';

export function OnboardingIntroScreen({
  onSignIn,
  onSignUp,
}: {
  onSignIn: () => void;
  onSignUp: () => void;
}) {
  return (
    <AuthLayout>
      <View style={styles.headlineWrap}>
        <Text style={styles.title}>
          Teman terbaikmu dalam segala hal SNBT dan Ujian Mandiri lainnya
        </Text>
      </View>

      <View style={styles.actions}>
        <BangSoalButton label="Masuk" variant="white" onPress={onSignIn} />
        <BangSoalButton
          label="Bikin akun"
          variant="secondary"
          onPress={onSignUp}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  headlineWrap: {
    paddingTop: 100,
  },
  title: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 36,
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
    lineHeight: 45,
  },
  actions: {
    gap: 12,
  },
});
