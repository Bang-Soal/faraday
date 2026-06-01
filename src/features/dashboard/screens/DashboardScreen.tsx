import {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {History} from 'lucide-react-native';
import {colors, fonts, fontWeights} from '../../../theme';
import Flashcard from '../../../assets/images/flashcard.svg';
import {
  BangSoalButton,
  buttonTextStyles,
} from '../../../components/Button/BangSoalButton';
import {
  useDashboardHeaders,
  useDashboardSubjects,
  useMobileRank,
} from '../api/dashboardApi';
import {RankCard} from '../components/RankCard';
import {PerformanceTabs, PerfTab} from '../components/PerformanceTabs';
import {LatihanStats} from '../components/LatihanStats';
import {TryoutOverview} from '../components/TryoutOverview';
import {TryoutDetailNilai} from '../components/TryoutDetailNilai';
import {SubjectCard, getSubjectAccent} from '../components/SubjectCard';

const meshBackground = require('../../../assets/images/bg-mesh-horizontal.png');

function greeting(): string {
  const hour = new Date().getHours();
  const part =
    hour < 11 ? 'pagi' : hour < 15 ? 'siang' : hour < 19 ? 'sore' : 'malam';
  return `Selamat ${part} Bang!`;
}

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const headers = useDashboardHeaders();
  const subjects = useDashboardSubjects();
  const ranks = useMobileRank();
  const [perfTab, setPerfTab] = useState<PerfTab>('latihan');

  // Light status-bar area on the dashboard → dark icons; revert on blur.
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      return () => StatusBar.setBarStyle('light-content');
    }, []),
  );

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.scroll, {paddingTop: insets.top + 16}]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <Text style={styles.greeting}>👋 {greeting()}</Text>

          {ranks.data?.length ? <RankCard ranks={ranks.data} /> : null}

          {/* Full-width flash card banner (sits under the rank card) */}
          <ImageBackground
            source={meshBackground}
            resizeMode="cover"
            style={styles.bannerWrap}>
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                Waktunya untuk Flash Card Harian!
              </Text>
            </View>
            <Flashcard
              width={78}
              height={52}
              preserveAspectRatio="xMidYMid slice"
              style={styles.flashcard}
            />
          </ImageBackground>

          <PerformanceTabs active={perfTab} onChange={setPerfTab} />

          {perfTab === 'latihan' ? (
            <>
              <LatihanStats headers={headers.data} />

              {subjects.isLoading ? (
                <ActivityIndicator
                  color={colors.primary[600]}
                  style={styles.loading}
                />
              ) : (
                <View style={styles.subjects}>
                  {(subjects.data ?? []).map((subject, i) => (
                    <SubjectCard
                      key={subject.subject_id}
                      subject={subject}
                      accent={getSubjectAccent(i)}
                    />
                  ))}
                </View>
              )}

              <BangSoalButton variant="white" onPress={() => {}}>
                <View style={styles.riwayatRow}>
                  <History size={18} color={colors.primary[600]} />
                  <Text style={buttonTextStyles.primary}>Semua riwayat</Text>
                </View>
              </BangSoalButton>
            </>
          ) : (
            <>
              <TryoutOverview />
              <TryoutDetailNilai />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.gray[100],
    flex: 1,
  },
  scroll: {
    paddingBottom: 32,
  },
  body: {
    gap: 20,
    paddingHorizontal: 16,
  },
  greeting: {
    color: colors.gray[900],
    fontFamily: fonts.quicksand,
    fontSize: 26,
    fontWeight: fontWeights.bold,
  },
  bannerWrap: {
    backgroundColor: colors.primary[500],
    marginHorizontal: -16,
    overflow: 'visible',
    zIndex: 2,
  },
  banner: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    paddingLeft: 110,
    paddingRight: 16,
  },
  bannerText: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  // 52-tall 3:2 card centered on the 32-tall bar → overflows ~10px top & bottom
  flashcard: {
    left: 20,
    position: 'absolute',
    top: -10,
  },
  subjects: {
    gap: 14,
  },
  loading: {
    paddingVertical: 24,
  },
  riwayatRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
});
