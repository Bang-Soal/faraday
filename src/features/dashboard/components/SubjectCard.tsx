import type {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ArrowDownWideNarrow, ArrowRight, TriangleAlert} from 'lucide-react-native';
import {colors, fonts, fontWeights} from '../../../theme';
import {DashboardSubject} from '../api/dashboardApi';
import {SubjectIcon} from './SubjectIcon';

type Accent = {tint: string; color: string};

// Per-subject accent tints, cycled by index (mirrors the colored cards in Figma).
const ACCENTS: Accent[] = [
  {tint: colors.blue[50], color: colors.blue[600]},
  {tint: colors.primary[50], color: colors.primary[600]},
  {tint: colors.yellow[50], color: '#A16207'},
  {tint: colors.orange[50], color: colors.orange[600]},
  {tint: colors.rose[50], color: colors.rose[600]},
  {tint: colors.lime[50], color: colors.lime[700]},
];

export function getSubjectAccent(index: number): Accent {
  return ACCENTS[index % ACCENTS.length];
}

const LOW_TOPIC_PCT = 60;
const NEEDS_PRACTICE_PCT = 40;

export function SubjectCard({
  subject,
  accent,
  icon,
}: {
  subject: DashboardSubject;
  accent: Accent;
  icon?: ReactNode;
}) {
  const totalCorrect = subject.topics.reduce((s, t) => s + t.correct, 0);
  const totalQuestion = subject.topics.reduce((s, t) => s + t.total_question, 0);
  const overallPct = totalQuestion
    ? Math.round((totalCorrect / totalQuestion) * 100)
    : 0;
  const isDanger = overallPct < NEEDS_PRACTICE_PCT;
  const headerTint = isDanger ? colors.rose[100] : accent.tint;
  const accentColor = isDanger ? colors.rose[600] : accent.color;
  const topics = subject.topics.slice(0, 5);
  // Caller may override the icon; otherwise use the subject's bucket icon URL.
  const resolvedIcon =
    icon ?? (subject.icon ? <SubjectIcon uri={subject.icon} /> : null);

  return (
    <View style={[styles.card, isDanger && styles.cardDanger]}>
      <View style={[styles.header, {backgroundColor: headerTint}]}>
        {resolvedIcon ? <View style={styles.icon}>{resolvedIcon}</View> : null}
        <View style={styles.headerLeft}>
          <Text style={styles.subject} numberOfLines={2}>
            {subject.subject}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.pct, {color: accentColor}]}>
              {overallPct}%
            </Text>
            <Text style={[styles.count, {color: accentColor}]}>
              {totalCorrect}/{totalQuestion}
            </Text>
            {isDanger ? (
              <View style={styles.badge}>
                <TriangleAlert size={12} color={colors.rose[600]} />
                <Text style={styles.badgeText}>Subjek perlu latihan</Text>
              </View>
            ) : null}
          </View>
        </View>
        <ArrowDownWideNarrow size={20} color={colors.slate[400]} />
      </View>

      <View style={styles.topics}>
        {topics.map((t, i) => {
          const tpct = t.total_question
            ? Math.round((t.correct / t.total_question) * 100)
            : 0;
          const low = tpct < LOW_TOPIC_PCT;
          return (
            <View
              key={t.topic_id}
              style={[
                styles.topicRow,
                i > 0 && !low && styles.topicBorder,
                low && styles.topicRowLow,
              ]}>
              <Text
                style={[styles.topicName, low && styles.topicNameLow]}
                numberOfLines={1}>
                {t.topic}
              </Text>
              <View style={styles.topicRight}>
                <Text style={[styles.topicPct, low && styles.topicPctLow]}>
                  {tpct}% · {t.correct}/{t.total_question}
                </Text>
                {low ? (
                  <TriangleAlert size={14} color={colors.rose[500]} />
                ) : (
                  <ArrowRight size={15} color={colors.slate[400]} />
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  pct: {
    fontFamily: fonts.quicksand,
    fontSize: 20,
    fontWeight: fontWeights.bold,
  },
  count: {
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
  topics: {
    paddingBottom: 4,
    paddingHorizontal: 16,
  },
  topicRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  topicRowLow: {
    backgroundColor: colors.rose[100],
    borderColor: colors.rose[200],
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  topicBorder: {
    borderTopColor: colors.gray[100],
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  topicName: {
    color: colors.gray[700],
    flex: 1,
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.semiBold,
  },
  topicNameLow: {
    color: colors.rose[600],
  },
  topicRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  topicPct: {
    color: colors.slate[500],
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.semiBold,
  },
  topicPctLow: {
    color: colors.rose[600],
  },
});
