import {StyleSheet, Text, View} from 'react-native';
import {ArrowBigUp} from 'lucide-react-native';
import {colors, fonts, fontWeights} from '../../../theme';
import {MobileRank} from '../api/dashboardApi';

export function RankCard({ranks}: {ranks: MobileRank[]}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Peringkat kamu</Text>
      <View style={styles.divider} />
      {ranks.map((r, i) => (
        <View key={`${r.university}-${i}`} style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.uni}>{r.university}</Text>
            <Text style={styles.major}>{r.major}</Text>
          </View>
          <View style={styles.rankCluster}>
            <ArrowBigUp
              size={26}
              strokeWidth={0}
              fill={colors.primary[400]}
            />
            <Text>
              <Text style={styles.rankNum}>{r.rank}</Text>
              <Text style={styles.rankTotal}>/{r.total_rank}</Text>
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    boxShadow:
      '0px 8px 16px -4px rgba(6,78,59,0.12), 0px 4px 8px -4px rgba(0,0,0,0.08)',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  title: {
    color: colors.gray[900],
    fontFamily: fonts.quicksand,
    fontSize: 17,
    fontWeight: fontWeights.bold,
  },
  divider: {
    backgroundColor: colors.gray[100],
    height: 1,
    marginTop: 16,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
  },
  info: {
    flex: 1,
  },
  uni: {
    color: colors.gray[900],
    fontFamily: fonts.quicksand,
    fontSize: 15,
    fontWeight: fontWeights.bold,
  },
  major: {
    color: colors.slate[400],
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.medium,
    marginTop: 2,
  },
  rankCluster: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  rankNum: {
    color: colors.primary[800],
    fontFamily: fonts.quicksand,
    fontSize: 22,
    fontWeight: fontWeights.bold,
  },
  rankTotal: {
    color: colors.primary[600],
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.semiBold,
  },
});
