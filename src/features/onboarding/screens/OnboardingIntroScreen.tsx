import {StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthLayout} from '../../../components/Layout/AuthLayout';
import {BangSoalButton} from '../../../components/Button/BangSoalButton';
import {colors, fonts, fontWeights} from '../../../theme';
import {AuthStackParamList} from '../../../app/navigation/types';

export function OnboardingIntroScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  return (
    <AuthLayout>
      <View style={styles.headlineWrap}>
        <Text style={styles.title}>
          Teman terbaikmu dalam segala hal SNBT dan Ujian Mandiri lainnya
        </Text>
      </View>

      <View style={styles.actions}>
        <BangSoalButton
          label="Masuk"
          variant="white"
          onPress={() => navigation.navigate('SignIn')}
        />
        <BangSoalButton
          label="Bikin akun"
          variant="secondary"
          onPress={() => navigation.navigate('SignUp')}
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
