import {useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ArrowRight,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react-native';
import {colors, fonts, fontWeights} from '../../../theme';
import {Sparkline} from './Sparkline';
import {
  TryoutAttempt,
  useTryoutScoreAnalytics,
} from '../api/tryoutDashboardApi';

const floor = (n?: number) => Math.floor(n ?? 0);

function deltaPct(current: number, prev?: number): number | null {
  if (prev === undefined || prev === 0) {
    return null;
  }
  return Math.round(((current - prev) / prev) * 100);
}

export function TryoutOverview() {
  const {data, isLoading} = useTryoutScoreAnalytics();
  const attempts = data?.attempts ?? [];
  const hasAttempts = attempts.length > 0;
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <ActivityIndicator color={colors.primary[600]} style={styles.loading} />
    );
  }

  const current = hasAttempts ? attempts[index % attempts.length] : undefined;
  const cardDelta = current
    ? deltaPct(current.score, attempts[index - 1]?.score)
    : null;
  const avgDelta =
    attempts.length >= 2
      ? deltaPct(attempts[attempts.length - 1].score, attempts[0].score)
      : null;
  const next = () => setIndex(i => (i + 1) % attempts.length);
  const prev = () => setIndex(i => (i - 1 + attempts.length) % attempts.length);

  return (
    <View style={styles.wrap}>
      {/* Nilai Rata-rata + sparkline */}
      <View>
        <Text style={styles.label}>Nilai Rata-rata</Text>
        <View style={styles.avgRow}>
          <Text style={styles.bigNumber}>{floor(data?.average_score)}</Text>
          {attempts.length >= 2 ? (
            <View style={styles.sparkWrap}>
              <Sparkline data={attempts.map(a => Math.floor(a.score))} />
              {avgDelta !== null ? (
                <View style={styles.avgDelta}>
                  <ArrowUp size={14} color={colors.primary[600]} />
                  <Text style={styles.avgDeltaText}>
                    {avgDelta >= 0 ? '+' : ''}
                    {avgDelta}%
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>

      {/* Tertinggi / Terendah */}
      <View style={styles.minmaxRow}>
        <View style={styles.minmaxCol}>
          <View
            style={[styles.minmaxBar, {backgroundColor: colors.primary[400]}]}
          />
          <Text style={styles.minmaxLabel}>Nilai Tertinggi</Text>
          <Text style={styles.minmaxValue}>{floor(data?.max_score)}</Text>
        </View>
        <View style={[styles.minmaxCol, styles.minmaxRight]}>
          <View
            style={[styles.minmaxBar, {backgroundColor: colors.rose[400]}]}
          />
          <Text style={styles.minmaxLabel}>Nilai Terendah</Text>
          <Text style={styles.minmaxValue}>{floor(data?.min_score)}</Text>
        </View>
      </View>

      {/* Set TO yang sudah dikerjakan */}
      <View>
        <Text style={styles.section}>Set TO yang sudah dikerjakan</Text>
        {hasAttempts && current ? (
          <View style={styles.carousel}>
            {attempts.length > 1 ? (
              <Pressable onPress={prev} hitSlop={8} style={styles.chevron}>
                <ChevronLeft size={22} color={colors.slate[400]} />
              </Pressable>
            ) : null}
            <SetCard
              attempt={current}
              delta={cardDelta}
              onPress={() => setOpen(true)}
            />
            {attempts.length > 1 ? (
              <Pressable onPress={next} hitSlop={8} style={styles.chevron}>
                <ChevronRight size={22} color={colors.slate[400]} />
              </Pressable>
            ) : null}
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Belum ada Try Out yang kamu kerjakan.
            </Text>
          </View>
        )}
      </View>

      {current ? (
        <SetModal
          attempt={current}
          delta={cardDelta}
          visible={open}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </View>
  );
}

function SetCard({
  attempt,
  delta,
  onPress,
}: {
  attempt: TryoutAttempt;
  delta: number | null;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardName} numberOfLines={1}>
          {attempt.name}
        </Text>
        <View style={styles.utbk}>
          <Text style={styles.utbkText}>UTBK</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardScore}>{floor(attempt.score)}</Text>
        {delta !== null ? (
          <View style={styles.deltaPill}>
            <ArrowUp size={12} color={colors.primary[700]} />
            <Text style={styles.deltaText}>{Math.abs(delta)}%</Text>
          </View>
        ) : null}
        <Text style={styles.cardId}>#{attempt.tryout_id.slice(0, 4)}</Text>
      </View>
    </Pressable>
  );
}

function SetModal({
  attempt,
  delta,
  visible,
  onClose,
}: {
  attempt: TryoutAttempt;
  delta: number | null;
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalName} numberOfLines={2}>
              {attempt.name}
            </Text>
            <Pressable hitSlop={8} onPress={onClose}>
              <X size={20} color={colors.gray[900]} />
            </Pressable>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.modalScore}>{floor(attempt.score)}</Text>
            {delta !== null ? (
              <View style={styles.deltaPill}>
                <ArrowUp size={12} color={colors.primary[700]} />
                <Text style={styles.deltaText}>{Math.abs(delta)}%</Text>
              </View>
            ) : null}
          </View>
          <Pressable style={styles.historyBtn} onPress={onClose}>
            <Text style={styles.historyText}>Lihat histori</Text>
            <ArrowRight size={18} color={colors.white} />
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 24,
    paddingTop: 8,
  },
  loading: {
    paddingVertical: 28,
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 14,
    paddingVertical: 28,
  },
  placeholderText: {
    color: colors.slate[500],
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.semiBold,
  },
  label: {
    color: colors.gray[900],
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.semiBold,
  },
  avgRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    minHeight: 48,
  },
  bigNumber: {
    color: colors.slate[800],
    fontFamily: fonts.quicksand,
    fontSize: 40,
    fontWeight: fontWeights.bold,
  },
  sparkWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  avgDelta: {
    alignItems: 'center',
  },
  avgDeltaText: {
    color: colors.primary[600],
    fontFamily: fonts.quicksand,
    fontSize: 11,
    fontWeight: fontWeights.bold,
  },
  minmaxRow: {
    flexDirection: 'row',
    gap: 16,
  },
  minmaxCol: {
    flex: 1,
  },
  minmaxRight: {
    alignItems: 'flex-end',
  },
  minmaxBar: {
    borderRadius: 2,
    height: 3,
    marginBottom: 10,
    width: '55%',
  },
  minmaxLabel: {
    color: colors.gray[900],
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.semiBold,
  },
  minmaxValue: {
    color: colors.slate[800],
    fontFamily: fonts.quicksand,
    fontSize: 32,
    fontWeight: fontWeights.bold,
  },
  section: {
    color: colors.gray[900],
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    marginBottom: 12,
  },
  carousel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  chevron: {
    padding: 2,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    boxShadow: '0px 8px 16px -6px rgba(0,0,0,0.18)',
    flex: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardName: {
    color: colors.primary[700],
    flex: 1,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
  },
  utbk: {
    backgroundColor: colors.primary[200],
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  utbkText: {
    color: colors.primary[800],
    fontFamily: fonts.quicksand,
    fontSize: 12,
    fontWeight: fontWeights.bold,
  },
  cardBody: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardScore: {
    color: colors.primary[600],
    fontFamily: fonts.quicksand,
    fontSize: 30,
    fontWeight: fontWeights.bold,
  },
  deltaPill: {
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    borderRadius: 999,
    flexDirection: 'row',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deltaText: {
    color: colors.primary[700],
    fontFamily: fonts.quicksand,
    fontSize: 12,
    fontWeight: fontWeights.bold,
  },
  cardId: {
    color: colors.slate[400],
    flex: 1,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    textAlign: 'right',
  },
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  modalHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  modalName: {
    color: colors.gray[900],
    flex: 1,
    fontFamily: fonts.quicksand,
    fontSize: 18,
    fontWeight: fontWeights.bold,
  },
  modalBody: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginVertical: 16,
  },
  modalScore: {
    color: colors.primary[600],
    fontFamily: fonts.quicksand,
    fontSize: 36,
    fontWeight: fontWeights.bold,
  },
  historyBtn: {
    alignItems: 'center',
    backgroundColor: colors.slate[600],
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  historyText: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 15,
    fontWeight: fontWeights.bold,
  },
});
