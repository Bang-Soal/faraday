import type {ReactNode} from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {colors} from '../../theme';

const meshBackground = require('../../assets/images/bg-mesh-vertical.png');

export function AuthLayout({children}: {children: ReactNode}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={meshBackground}
          resizeMode="cover"
          style={styles.screen}>
          <View style={styles.content}>{children}</View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  screen: {
    backgroundColor: colors.primary[500],
    flex: 1,
    minHeight: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 60,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
});
