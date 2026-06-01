import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, fonts, fontWeights} from '../../../theme';

export type PerfTab = 'latihan' | 'tryout';

export function PerformanceTabs({
  active,
  onChange,
}: {
  active: PerfTab;
  onChange: (tab: PerfTab) => void;
}) {
  return (
    <View>
      <Text style={styles.section}>Performa kamu</Text>
      <View style={styles.tabs}>
        <Tab
          label="Latihan Soal"
          active={active === 'latihan'}
          onPress={() => onChange('latihan')}
        />
        <Tab
          label="Try Out"
          active={active === 'tryout'}
          onPress={() => onChange('tryout')}
        />
      </View>
    </View>
  );
}

function Tab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    color: colors.gray[900],
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    marginBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    paddingVertical: 10,
  },
  tabActive: {
    backgroundColor: colors.white,
    boxShadow: '0px 4px 10px -2px rgba(0,0,0,0.10)',
  },
  tabText: {
    color: colors.slate[400],
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.semiBold,
  },
  tabTextActive: {
    color: colors.gray[900],
    fontWeight: fontWeights.bold,
  },
});
