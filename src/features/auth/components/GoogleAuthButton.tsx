import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import {
  BangSoalButton,
  buttonTextStyles,
} from '../../../components/Button/BangSoalButton';

const googleLogo = require('../../../assets/images/google.png');

export function GoogleAuthButton() {
  return (
    <BangSoalButton variant="white" onPress={showGoogleAuthUnavailable}>
      <View style={styles.content}>
        <Image source={googleLogo} style={styles.logo} />
        <Text style={buttonTextStyles.primary}>Gunakan email Google</Text>
      </View>
    </BangSoalButton>
  );
}

function showGoogleAuthUnavailable() {
  Alert.alert(
    'Google sign-in belum aktif',
    'Tombol ini belum disambungkan ke Firebase/Google auth.',
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  logo: {
    height: 16,
    width: 16,
  },
});
