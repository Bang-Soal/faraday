import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  ArrowDownWideNarrow,
  CheckCircle2,
  MinusCircle,
  TriangleAlert,
  XCircle,
} from 'lucide-react-native';
import {colors, fonts, fontWeights} from '../../../theme';
import {useTryoutSubjectAnalytics} from '../api/tryoutDashboardApi';
import {getSubjectAccent} from './SubjectCard';
import {SubjectIcon, subjectIconUrl} from './SubjectIcon';

// Fixed UTBK subtests (mirrors dijkstra's topicIndex constant).
const SUBJECTS = [
  'Kemampuan Penalaran Umum',
  'Pengetahuan Kuantitatif',
  'Pengetahuan dan Pemahaman Umum',
  'Pemahaman Bacaan dan Menulis',
  'Penalaran Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
];

type SubjectStat = {
  name: string;
  poin: number;
  benar: number;
  salah: number;
  kosong: number;
};

export function TryoutDetailNilai() {
  const {data} = useTryoutSubjectAnalytics();
  const analytics = data?.subject_analytics ?? {};

  const stats: SubjectStat[] = SUBJECTS.map(name => {
    const s = analytics[name];
    const benar =
      s?.topics.reduce((sum, t) => sum + t.correct_answers_count, 0) ?? 0;
    const total =
      s?.topics.reduce((sum, t) => sum + t.questions_count, 0) ?? 0;
    return {
      name,
      poin: Math.floor(s?.avg_score ?? 0),
      benar,
      // salah/kosong split isn't exposed by the endpoint yet — approximate.
      salah: Math.max(0, total - benar),
      kosong: 0,
    };
  });

  // lowest non-zero subject → danger highlight (like the web).
  const scored = stats.filter(s => s.poin > 0);
  const minPoin = scored.length ? Math.min(...scored.map(s => s.poin)) : -1;

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Detail Nilai TO</Text>

      <View style={styles.chipsRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          <View style={[styles.chip, styles.chipActive]}>
            <Text style={[styles.chipText, styles.chipTextActive]}>Semua</Text>
          </View>
        </ScrollView>
        <ArrowDownWideNarrow size={20} color={colors.slate[400]} />
      </View>

      <View style={styles.cards}>
        {stats.map((s, i) => (
          <SubjectScoreCard
            key={s.name}
            stat={s}
            accent={getSubjectAccent(i)}
            iconUri={subjectIconUrl(s.name)}
            danger={s.poin > 0 && s.poin === minPoin && scored.length > 1}
          />
        ))}
      </View>
    </View>
  );
}

function SubjectScoreCard({
  stat,
  accent,
  iconUri,
  danger,
}: {
  stat: SubjectStat;
  accent: {tint: string; color: string};
  iconUri?: string;
  danger: boolean;
}) {
  return (
    <View style={[styles.card, danger && styles.cardDanger]}>
      <View
        style={[
          styles.header,
          {backgroundColor: danger ? colors.rose[100] : accent.tint},
        ]}>
        {iconUri ? (
          <View style={styles.icon}>
            <SubjectIcon uri={iconUri} />
          </View>
        ) : null}
        <View style={styles.headerLeft}>
          <Text style={styles.subject} numberOfLines={2}>
            {stat.name}
          </Text>
          <View style={styles.poinRow}>
            <Text
              style={[
                styles.poin,
                {color: danger ? colors.rose[600] : accent.color},
              ]}>
              {stat.poin}
            </Text>
            <Text style={styles.poinUnit}>Poin</Text>
            {danger ? (
              <View style={styles.badge}>
                <TriangleAlert size={12} color={colors.rose[600]} />
                <Text style={styles.badgeText}>Subjek perlu latihan</Text>
              </View>
            ) : null}
          </View>
        </View>
        <ArrowDownWideNarrow size={20} color={colors.slate[400]} />
      </View>

      <View style={styles.pills}>
        <Pill
          icon={<CheckCircle2 size={14} color={colors.primary[600]} />}
          text={`${stat.benar} soal`}
          bg={colors.primary[50]}
          color={colors.primary[700]}
        />
        <Pill
          icon={<XCircle size={14} color={colors.rose[600]} />}
          text={`${stat.salah} soal`}
          bg={colors.rose[50]}
          color={colors.rose[600]}
        />
        <Pill
          icon={<MinusCircle size={14} color={colors.slate[500]} />}
          text={`${stat.kosong} Kosong`}
          bg={colors.slate[100]}
          color={colors.slate[600]}
        />
      </View>
    </View>
  );
}

function Pill({
  icon,
  text,
  bg,
  color,
}: {
  icon: React.ReactNode;
  text: string;
  bg: string;
  color: string;
}) {
  return (
    <View style={[styles.pill, {backgroundColor: bg}]}>
      {icon}
      <Text style={[styles.pillText, {color}]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 14,
  },
  heading: {
    color: colors.gray[900],
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
  },
  chipsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  chips: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    backgroundColor: colors.gray[100],
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: colors.primary[600],
  },
  chipText: {
    color: colors.slate[500],
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.semiBold,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  cards: {
    gap: 14,
  },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.gray[200],
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardDanger: {
    backgroundColor: colors.rose[50],
    borderColor: colors.rose[300],
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  icon: {
    height: 28,
    width: 28,
  },
  headerLeft: {
    flex: 1,
  },
  subject: {
    color: colors.gray[900],
    fontFamily: fonts.quicksand,
    fontSize: 15,
    fontWeight: fontWeights.bold,
  },
  poinRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  poin: {
    fontFamily: fonts.quicksand,
    fontSize: 20,
    fontWeight: fontWeights.bold,
  },
  poinUnit: {
    color: colors.slate[500],
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.semiBold,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.rose[600],
    fontFamily: fonts.quicksand,
    fontSize: 11,
    fontWeight: fontWeights.bold,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  pill: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: {
    fontFamily: fonts.quicksand,
    fontSize: 12,
    fontWeight: fontWeights.semiBold,
  },
});
