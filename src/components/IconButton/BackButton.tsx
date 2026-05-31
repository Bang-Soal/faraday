import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {ArrowLeft} from 'lucide-react-native';
import {colors} from '../../theme';

export function BackButton({onPress}: {onPress: () => void}) {
  return (
    <Pressable
      accessibilityRole="button"
      style={styles.button}
      onPress={onPress}>
      <ArrowLeft color={colors.white} size={36} strokeWidth={3} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
});
