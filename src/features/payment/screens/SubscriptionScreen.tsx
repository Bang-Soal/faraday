import {useCallback, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  Linking,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useMutation} from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Gift,
  HelpCircle,
  MoveLeft,
  MoveRight,
} from 'lucide-react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BangSoalButton} from '../../../components/Button/BangSoalButton';
import {useToast} from '../../../components/Toast/ToastProvider';
import {colors, fonts, fontWeights} from '../../../theme';
import {RootStackParamList} from '../../../app/navigation/types';
import {SUBSCRIPTION_PLANS, formatRupiah} from '../data';
import {checkReferralCode, purchaseSubscription} from '../api/paymentApi';
import {SubscriptionPlan} from '../data';
import {MeshGradient} from '../components/MeshGradient';

type Props = NativeStackScreenProps<RootStackParamList, 'Langganan'>;

const meshBackground = require('../../../assets/images/bg-mesh-vertical.png');
const {width: screenWidth} = Dimensions.get('window');

const CARD_W = Math.min(screenWidth * 0.62, 240);
const CARD_H = Math.round(CARD_W * 0.675); // Figma card ratio 162/240
const SIDE_STEP = CARD_W * 0.58; // horizontal offset of the peeking side cards
const STAGE_H = CARD_H + 96; // room for the ±15° tilt + the discount seal
const SWIPE_THRESHOLD = CARD_W * 0.26;

// Mesh palettes ported from dijkstra/PriceTabs.tsx.
const SETIA_MESH: [string, string, string, string] = [
  '#A7F3D0',
  '#6EE7B7',
  '#5EEAD4',
  '#34D399',
];
const AMBIS_MESH: [string, string, string, string] = [
  '#34D399',
  '#5EEAD4',
  '#3B82F6',
  '#C4B5FD',
];

const PLAN_COUNT = SUBSCRIPTION_PLANS.length;
const wrap = (n: number) => (n + PLAN_COUNT) % PLAN_COUNT;

export function SubscriptionScreen({navigation}: Props) {
  const toast = useToast();
  const [index, setIndex] = useState(1);
  const drag = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);
  const [referralInput, setReferralInput] = useState('');
  const [appliedReferral, setAppliedReferral] = useState<{
    code: string;
    partnerName: string;
    discount: number;
  } | null>(null);

  const selectedPlan = SUBSCRIPTION_PLANS[index];
  const leftPlan = SUBSCRIPTION_PLANS[wrap(index - 1)];
  const rightPlan = SUBSCRIPTION_PLANS[wrap(index + 1)];
  const displayTotal = Math.max(
    4000,
    selectedPlan.totalPrice - (appliedReferral?.discount ?? 0),
  );

  // Normalised slot position: 0 = centre, ±1 = a card-width travelled.
  const offset = Animated.divide(drag, CARD_W);
  const slotLeft = useMemo(() => Animated.add(offset, -1), [offset]);
  const slotCenter = offset;
  const slotRight = useMemo(() => Animated.add(offset, 1), [offset]);

  const commit = useCallback(
    (direction: -1 | 1) => {
      if (isAnimating.current) {
        return;
      }
      isAnimating.current = true;
      // direction -1 => go to previous (drag travels right, +CARD_W).
      Animated.timing(drag, {
        toValue: -direction * CARD_W,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(({finished}) => {
        isAnimating.current = false;
        if (!finished) {
          return;
        }
        // Re-centre instantly: the just-arrived card already sits at centre,
        // so resetting drag to 0 with the new index produces no visible jump.
        drag.setValue(0);
        setIndex(prev => wrap(prev + direction));
        setAppliedReferral(null);
      });
    },
    [drag],
  );

  const settle = useCallback(() => {
    Animated.spring(drag, {
      toValue: 0,
      bounciness: 4,
      speed: 16,
      useNativeDriver: false,
    }).start();
  }, [drag]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          !isAnimating.current &&
          Math.abs(g.dx) > 8 &&
          Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: (_, g) => {
          drag.setValue(g.dx);
        },
        onPanResponderRelease: (_, g) => {
          if (g.dx > SWIPE_THRESHOLD || g.vx > 0.45) {
            commit(-1);
          } else if (g.dx < -SWIPE_THRESHOLD || g.vx < -0.45) {
            commit(1);
          } else {
            settle();
          }
        },
        onPanResponderTerminate: () => settle(),
      }),
    [commit, drag, settle],
  );

  const referralMutation = useMutation({
    mutationFn: checkReferralCode,
    onSuccess: detail => {
      if (detail.discount === 0) {
        setAppliedReferral(null);
        toast.show({
          message: 'Kode referral sudah pernah digunakan',
          variant: 'error',
        });
        return;
      }
      setAppliedReferral({
        code: detail.code,
        partnerName: detail.partner_name,
        discount: detail.discount,
      });
      toast.show({
        message: `Referral ${detail.code} berhasil dipakai`,
        variant: 'success',
      });
    },
    onError: error => {
      setAppliedReferral(null);
      toast.show({
        message:
          error instanceof Error ? error.message : 'Kode referral tidak valid',
        variant: 'error',
      });
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: () =>
      purchaseSubscription({
        subscriptionType: selectedPlan.type,
        referalCode: appliedReferral?.code,
      }),
    onSuccess: async data => {
      const canOpen = await Linking.canOpenURL(data.redirect_url);
      if (!canOpen) {
        toast.show({
          message: 'Tidak bisa membuka halaman pembayaran',
          variant: 'error',
        });
        return;
      }
      await Linking.openURL(data.redirect_url);
    },
    onError: error => {
      toast.show({
        message:
          error instanceof Error ? error.message : 'Gagal memulai pembayaran',
        variant: 'error',
      });
    },
  });

  const referralButtonLabel = useMemo(() => {
    if (referralMutation.isPending) {
      return <ActivityIndicator color={colors.primary[700]} />;
    }
    return <ArrowRight color={colors.primary[700]} size={22} />;
  }, [referralMutation.isPending]);

  function handleApplyReferral() {
    const code = referralInput.trim();
    if (!code) {
      toast.show({
        message: 'Kode referral tidak boleh kosong',
        variant: 'error',
      });
      return;
    }
    referralMutation.mutate(code);
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowLeft color={colors.slate[500]} size={24} />
          </Pressable>
          <Text style={styles.title}>Tingkatkan{'\n'}pelajaranmu!</Text>

          <View style={styles.carouselStage} {...panResponder.panHandlers}>
            <CarouselSlot slot={slotLeft}>
              <PlanCard plan={leftPlan} />
            </CarouselSlot>
            <CarouselSlot slot={slotRight}>
              <PlanCard plan={rightPlan} />
            </CarouselSlot>
            <CarouselSlot slot={slotCenter} center>
              <PlanCard plan={selectedPlan} />
              {selectedPlan.discountLabel ? (
                <View style={styles.discountSeal}>
                  <Text style={styles.discountSealText}>
                    {selectedPlan.discountLabel}
                  </Text>
                </View>
              ) : null}
            </CarouselSlot>
          </View>
        </View>

        <ImageBackground
          source={meshBackground}
          resizeMode="cover"
          style={styles.greenSection}>
          <FeaturePanel features={selectedPlan.features} />

          <View style={styles.arrowRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => commit(-1)}
              style={styles.arrowButton}>
              <MoveLeft color={colors.white} size={20} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => commit(1)}
              style={styles.arrowButton}>
              <MoveRight color={colors.white} size={20} />
            </Pressable>
          </View>

          <View style={styles.referralCard}>
            <View style={styles.referralHeading}>
              <Gift color={colors.white} size={22} />
              <Text style={styles.referralTitle}>Punya referral?</Text>
            </View>
            <Text style={styles.referralCopy}>
              Kamu bisa dapatkan potongan layanan BangSoal dengan menggunakan
              kode referral teman!
            </Text>
            {appliedReferral ? (
              <View style={styles.discountBox}>
                <Text style={styles.discountBoxText}>
                  {formatRupiah(selectedPlan.totalPrice)} →{' '}
                  {formatRupiah(displayTotal)}
                </Text>
                <Text style={styles.discountBoxHint}>
                  Kode referral hanya dapat digunakan satu kali.
                </Text>
              </View>
            ) : null}
            <View style={styles.referralInputRow}>
              <TextInput
                autoCapitalize="characters"
                editable={!referralMutation.isPending}
                onChangeText={text => {
                  setReferralInput(text);
                  if (appliedReferral) {
                    setAppliedReferral(null);
                  }
                }}
                placeholder="Kode referral"
                placeholderTextColor="rgba(255, 255, 255, 0.84)"
                style={styles.referralInput}
                value={referralInput}
              />
              <Pressable
                accessibilityRole="button"
                disabled={referralMutation.isPending}
                onPress={handleApplyReferral}
                style={({pressed}) => [
                  styles.referralSubmit,
                  pressed && styles.pressed,
                  referralMutation.isPending && styles.disabled,
                ]}>
                {referralButtonLabel}
              </Pressable>
            </View>
          </View>

          <View style={styles.actions}>
            <BangSoalButton
              disabled={purchaseMutation.isPending}
              onPress={() => purchaseMutation.mutate()}
              variant="white">
              <View style={styles.primaryButtonContent}>
                <HelpCircle color={colors.primary[700]} size={20} />
                <Text style={styles.primaryButtonText}>
                  {purchaseMutation.isPending
                    ? 'Membuka pembayaran...'
                    : `Jadi ${selectedPlan.title}`}
                </Text>
              </View>
            </BangSoalButton>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.goBack()}
              style={({pressed}) => [
                styles.secondaryAction,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.secondaryActionText}>Ga dulu</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

function CarouselSlot({
  slot,
  center,
  children,
}: {
  slot: Animated.AnimatedInterpolation<number> | Animated.Value;
  center?: boolean;
  children: React.ReactNode;
}) {
  const animatedStyle = {
    transform: [
      {perspective: 900},
      {translateX: Animated.multiply(slot, SIDE_STEP)},
      {
        rotate: slot.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: ['-15deg', '0deg', '15deg'],
          extrapolate: 'clamp',
        }),
      },
      {
        scale: slot.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0.82, 1, 0.82],
          extrapolate: 'clamp',
        }),
      },
    ],
    opacity: slot.interpolate({
      inputRange: [-1, -0.5, 0, 0.5, 1],
      outputRange: [0.78, 0.94, 1, 0.94, 0.78],
      extrapolate: 'clamp',
    }),
  };
  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.slot, center && styles.slotCenter, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

function PlanCard({plan}: {plan: SubscriptionPlan}) {
  const isAmbis = plan.type === 'ambis';
  const isSetia = plan.type === 'setia';

  const ink = isAmbis ? '#3730A3' : '#064E3B';
  const priceInk = isAmbis ? '#312E81' : '#022C22';
  const pillBg = isAmbis ? 'rgba(55, 65, 81, 0.12)' : 'rgba(6, 78, 59, 0.1)';

  const content = (
    <>
      <View style={styles.planTopRow}>
        <Text style={[styles.planName, {color: ink}]}>{plan.title}</Text>
        <HelpCircle color={ink} size={16} />
      </View>
      <Text style={[styles.planPrice, {color: priceInk}]}>
        {formatRupiah(plan.price)}
      </Text>
      <Text style={[styles.planPeriod, {color: ink}]}>
        per bulan x {plan.durationMonths} bulan
      </Text>
      <View style={[styles.totalPill, {backgroundColor: pillBg}]}>
        <Text style={[styles.totalPillText, {color: ink}]}>
          total{' '}
          {plan.originalTotalPrice ? (
            <Text style={styles.strike}>
              {formatRupiah(plan.originalTotalPrice)}
            </Text>
          ) : null}
          {plan.originalTotalPrice ? ' ' : ''}
          {formatRupiah(plan.totalPrice)}
        </Text>
      </View>
    </>
  );

  return (
    <View
      style={[
        styles.planCard,
        plan.type === 'pemula' && styles.pemulaCard,
        (isSetia || isAmbis) && styles.meshCard,
      ]}>
      {isSetia ? <MeshGradient colors={SETIA_MESH} idPrefix="setia" /> : null}
      {isAmbis ? <MeshGradient colors={AMBIS_MESH} idPrefix="ambis" /> : null}
      <View style={styles.planInner}>{content}</View>
    </View>
  );
}

function FeaturePanel({features}: {features: string[]}) {
  return (
    <View style={styles.featurePanel}>
      <View style={styles.featureTitleRow}>
        <View style={styles.featureRule} />
        <Text style={styles.featureTitle}>
          Yang didapatkan dengan langganan BangSoal
        </Text>
        <View style={styles.featureRule} />
      </View>
      <View style={styles.featureList}>
        {features.map(feature => (
          <Text key={feature} style={styles.featureText}>
            • {feature.replace(/^X\s*/, '')}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: colors.white,
    minHeight: 438,
    paddingHorizontal: 24,
    paddingTop: 64,
    zIndex: 2,
  },
  backButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    marginLeft: -8,
    width: 40,
  },
  title: {
    color: colors.slate[900],
    fontFamily: fonts.quicksand,
    fontSize: 34,
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
    lineHeight: 42,
    marginTop: 18,
  },
  greenSection: {
    flex: 1,
    marginTop: 0,
    minHeight: 640,
    paddingBottom: 36,
    paddingHorizontal: 16,
  },
  carouselStage: {
    height: STAGE_H,
    justifyContent: 'center',
    marginTop: 24,
    overflow: 'visible',
  },
  slot: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  slotCenter: {
    zIndex: 10,
  },
  planCard: {
    borderRadius: 12,
    height: CARD_H,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.18,
    shadowRadius: 20,
    width: CARD_W,
  },
  planInner: {
    flex: 1,
    padding: 18,
  },
  pemulaCard: {
    backgroundColor: colors.white,
  },
  meshCard: {
    backgroundColor: '#34D399',
  },
  planTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planName: {
    fontFamily: fonts.quicksand,
    fontSize: 12,
    fontWeight: fontWeights.bold,
    lineHeight: 15,
  },
  planPrice: {
    fontFamily: fonts.quicksand,
    fontSize: 28,
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
    lineHeight: 35,
    marginTop: 14,
  },
  planPeriod: {
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    lineHeight: 20,
    marginTop: 2,
  },
  totalPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    marginTop: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  totalPillText: {
    fontFamily: fonts.quicksand,
    fontSize: 12,
    fontWeight: fontWeights.semiBold,
    lineHeight: 15,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  discountSeal: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 22,
    borderWidth: 3,
    elevation: 6,
    height: 46,
    justifyContent: 'center',
    position: 'absolute',
    top: CARD_H + 22,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.18,
    shadowRadius: 8,
    width: 46,
    zIndex: 20,
  },
  discountSealText: {
    color: colors.primary[700],
    fontFamily: fonts.quicksand,
    fontSize: 12,
    fontWeight: fontWeights.bold,
    lineHeight: 15,
  },
  featurePanel: {
    marginTop: 4,
  },
  featureTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  featureRule: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    flex: 1,
    height: 1,
  },
  featureTitle: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 12,
    fontWeight: fontWeights.bold,
    lineHeight: 16,
    textAlign: 'center',
  },
  featureList: {
    marginTop: 20,
    paddingHorizontal: 18,
  },
  featureText: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 15,
    fontWeight: fontWeights.bold,
    lineHeight: 20,
  },
  arrowRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 18,
    justifyContent: 'center',
    marginTop: 20,
  },
  arrowButton: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  referralCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: 8,
    marginTop: 18,
    padding: 16,
  },
  referralHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  referralTitle: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    lineHeight: 20,
  },
  referralCopy: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.semiBold,
    lineHeight: 18,
    marginTop: 14,
  },
  discountBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 8,
    marginTop: 12,
    padding: 10,
  },
  discountBoxText: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 18,
    fontWeight: fontWeights.bold,
    lineHeight: 23,
  },
  discountBoxHint: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 12,
    fontWeight: fontWeights.semiBold,
    lineHeight: 16,
    marginTop: 4,
  },
  referralInputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  referralInput: {
    backgroundColor: 'rgba(4, 120, 87, 0.42)',
    borderRadius: 7,
    color: colors.white,
    flex: 1,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    height: 48,
    paddingHorizontal: 14,
  },
  referralSubmit: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.22,
    shadowRadius: 6,
    width: 48,
  },
  actions: {
    gap: 12,
    marginTop: 22,
  },
  primaryButtonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: colors.primary[700],
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    lineHeight: 20,
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: 'rgba(167, 243, 208, 0.52)',
    borderRadius: 999,
    height: 52,
    justifyContent: 'center',
    width: '100%',
  },
  secondaryActionText: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.86,
    transform: [{scale: 0.985}],
  },
  disabled: {
    opacity: 0.72,
  },
});
