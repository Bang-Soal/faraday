import {StyleSheet, Text, View} from 'react-native';
import {AuthLayout} from '../../../components/Layout/AuthLayout';
import {colors, fonts, fontWeights} from '../../../theme';

/** Placeholder Sosial tab (community features come later). */
export function SosialScreen() {
  return (
    <AuthLayout>
      <View style={styles.wrap}>
        <Text style={styles.title}>Sosial</Text>
        <Text style={styles.subtitle}>Fitur komunitas segera hadir.</Text>
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
