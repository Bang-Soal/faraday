import {StyleSheet, Text, View} from 'react-native';
import {AuthLayout} from '../../../components/Layout/AuthLayout';
import {colors, fonts, fontWeights} from '../../../theme';

/** Placeholder Belajar tab — latihan soal lands here (Phase 9). */
export function BelajarScreen() {
  return (
    <AuthLayout>
      <View style={styles.wrap}>
        <Text style={styles.title}>Belajar</Text>
        <Text style={styles.subtitle}>Latihan soal segera hadir.</Text>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 80,
  },
  title: {
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
});
