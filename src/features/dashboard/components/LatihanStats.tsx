import type {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ArrowBigUp, Droplet} from 'lucide-react-native';
import {colors, fonts, fontWeights} from '../../../theme';
import {DashboardHeaders} from '../api/dashboardApi';

export function LatihanStats({headers}: {headers?: DashboardHeaders}) {
  return (
    <View style={styles.statsRow}>
      <Stat
        label="Mengerjakan"
        value={`${headers?.finished.done ?? 0}`}
        unit="soal"
        valueColor={colors.slate[800]}
        unitColor={colors.slate[400]}
      />
      <Stat
        label="Akurasi"
        value={`${headers?.accuracy.percentage ?? 0}%`}
        unit={`${headers?.accuracy.correct_answers ?? 0}/${headers?.accuracy.total_attempted_question ?? 0}`}
        valueColor={colors.primary[800]}
        unitColor={colors.primary[600]}
        shape={
          <ArrowBigUp size={66} strokeWidth={0} fill={colors.primary[400]} />
        }
      />
      <Stat
        label="Streak hari"
        value={`${headers?.streak ?? 0}`}
        unit="hari"
        valueColor={colors.rose[900]}
        unitColor={colors.rose[600]}
        shape={<Droplet size={62} strokeWidth={0} fill={colors.rose[400]} />}
      />
    </View>
  );
}

function Stat({
  label,
  value,
  unit,
  valueColor,
  unitColor,
  shape,
}: {
  label: string;
  value: string;
  unit: string;
  valueColor: string;
  unitColor: string;
  shape?: ReactNode;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.valueWrap}>
        {shape ? <View style={styles.shape}>{shape}</View> : null}
        <Text style={[styles.statValue, {color: valueColor}]}>{value}</Text>
      </View>
      <Text style={[styles.statUnit, {color: unitColor}]}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: colors.gray[900],
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.semiBold,
  },
  valueWrap: {
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
    marginVertical: 4,
  },
  shape: {
    position: 'absolute',
  },
  statValue: {
    fontFamily: fonts.quicksand,
    fontSize: 30,
    fontWeight: fontWeights.bold,
  },
  statUnit: {
    fontFamily: fonts.quicksand,
    fontSize: 12,
    fontWeight: fontWeights.semiBold,
  },
});
