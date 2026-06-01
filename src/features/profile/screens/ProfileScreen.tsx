import {useEffect} from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useQuery} from '@tanstack/react-query';
import {Pencil, LogOut} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BangSoalButton} from '../../../components/Button/BangSoalButton';
import {colors, fonts, fontWeights} from '../../../theme';
import {useAuthStore} from '../../../app/store/authStore';
import {RootStackParamList} from '../../../app/navigation/types';
import {getProfile} from '../api/profileApi';
import {capitalizePlan} from '../../payment/data';

const meshBackground = require('../../../assets/images/bg-mesh-vertical.png');

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore(state => state.user);
  const clear = useAuthStore(state => state.clear);
  const setUser = useAuthStore(state => state.setUser);

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  useEffect(() => {
    if (profileQuery.data?.user) {
      setUser(profileQuery.data.user);
    }
  }, [profileQuery.data?.user, setUser]);

  const profileUser = profileQuery.data?.user ?? user;
  const currentOrder =
    profileQuery.data?.package_plan?.transaction_orders ?? null;
  const hasActivePlan =
    !!currentOrder && isValidityDateActive(profileUser?.validity_date);
  const initials = getInitials(profileUser?.full_name);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + 28},
        ]}
        showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={meshBackground}
          resizeMode="cover"
          style={[styles.header, {paddingTop: insets.top + 28}]}>
          <View style={styles.profileRow}>
            <View style={styles.avatarColumn}>
              <View style={styles.avatarFrame}>
                {profileUser?.profile_img || profileUser?.profile_picture ? (
                  <Image
                    source={{
                      uri:
                        profileUser.profile_img ??
                        profileUser.profile_picture ??
                        '',
                    }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarInitials}>{initials}</Text>
                )}
              </View>
              <Pressable accessibilityRole="button" style={styles.editButton}>
                <Pencil color={colors.slate[500]} size={13} />
                <Text style={styles.editButtonText}>Edit profil</Text>
              </Pressable>
            </View>

            <View style={styles.profileText}>
              <Text numberOfLines={2} style={styles.name}>
                {profileUser?.full_name ?? 'Sobat BangSoal'}
              </Text>
              {profileUser?.highschool ? (
                <Text numberOfLines={2} style={styles.meta}>
                  {profileUser.highschool}
                </Text>
              ) : null}
              {profileUser?.phone_number ? (
                <Text numberOfLines={1} style={styles.meta}>
                  {profileUser.phone_number}
                </Text>
              ) : profileUser?.email ? (
                <Text numberOfLines={1} style={styles.meta}>
                  {profileUser.email}
                </Text>
              ) : null}
            </View>
          </View>
        </ImageBackground>

        <View style={styles.subscriptionCard}>
          {hasActivePlan && currentOrder ? (
            <>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>
                  Pelajar {capitalizePlan(currentOrder.subscription_type)}
                </Text>
                <Text style={styles.logoText}>BangSoal</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  Berlaku s/d {profileUser?.validity_date ?? '-'}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>
                  Tidak ada paket berlangganan
                </Text>
                <Text style={styles.logoText}>BangSoal</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  Upgrade untuk melihat pembahasan!
                </Text>
              </View>
            </>
          )}
          <View style={styles.cardAction}>
            <BangSoalButton
              label={
                hasActivePlan ? 'Lihat paket berlangganan' : 'Mulai langganan'
              }
              variant="grayLight"
              onPress={() => navigation.navigate('Langganan')}
            />
          </View>
        </View>

        {profileQuery.isError ? (
          <Text style={styles.errorText}>
            Gagal memuat status langganan terbaru.
          </Text>
        ) : null}

        <View style={styles.logoutWrap}>
          <BangSoalButton variant="grayLight" onPress={() => clear()}>
            <View style={styles.logoutContent}>
              <Text style={styles.logoutText}>Logout</Text>
              <LogOut color={colors.danger} size={18} />
            </View>
          </BangSoalButton>
        </View>
      </ScrollView>
    </View>
  );
}

function isValidityDateActive(value?: string | null) {
  if (!value || value === 'Invalid Date') {
    return false;
  }

  const [day, month, year] = value.split('-').map(Number);
  if (!day || !month || !year) {
    return false;
  }

  const expiresAt = new Date(year, month - 1, day, 23, 59, 59);
  return expiresAt.getTime() >= Date.now();
}

function getInitials(name?: string | null) {
  if (!name) {
    return 'BS';
  }
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.gray[100],
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    minHeight: 184,
    overflow: 'hidden',
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
  },
  avatarColumn: {
    alignItems: 'center',
    width: 122,
  },
  avatarFrame: {
    alignItems: 'center',
    backgroundColor: colors.slate[100],
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 38,
    borderWidth: 2,
    height: 76,
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 2,
    width: 76,
  },
  avatarImage: {
    borderRadius: 36,
    height: 72,
    width: 72,
  },
  avatarInitials: {
    color: colors.primary[700],
    fontFamily: fonts.quicksand,
    fontSize: 22,
    fontWeight: fontWeights.bold,
    lineHeight: 28,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 999,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 30,
    paddingHorizontal: 12,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  editButtonText: {
    color: colors.slate[500],
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.bold,
    lineHeight: 17,
  },
  profileText: {
    flex: 1,
  },
  name: {
    color: colors.slate[900],
    fontFamily: fonts.quicksand,
    fontSize: 20,
    fontWeight: fontWeights.bold,
    lineHeight: 25,
  },
  meta: {
    color: colors.slate[600],
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.regular,
    lineHeight: 18,
    marginTop: 8,
  },
  subscriptionCard: {
    backgroundColor: colors.white,
    minHeight: 170,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  cardTitleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: colors.slate[900],
    flex: 1,
    fontFamily: fonts.quicksand,
    fontSize: 20,
    fontWeight: fontWeights.bold,
    lineHeight: 25,
  },
  logoText: {
    color: colors.slate[900],
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.bold,
    lineHeight: 17,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(148, 163, 184, 0.16)',
    borderRadius: 999,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    color: colors.slate[700],
    fontFamily: fonts.quicksand,
    fontSize: 14,
    fontWeight: fontWeights.semiBold,
    lineHeight: 18,
  },
  cardAction: {
    marginTop: 16,
  },
  errorText: {
    color: colors.rose[100],
    fontFamily: fonts.quicksand,
    fontSize: 13,
    fontWeight: fontWeights.semiBold,
    lineHeight: 17,
    marginHorizontal: 16,
    marginTop: 12,
  },
  logoutWrap: {
    padding: 16,
  },
  logoutContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    width: '100%',
  },
  logoutText: {
    color: colors.danger,
    fontFamily: fonts.quicksand,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    lineHeight: 20,
  },
});
