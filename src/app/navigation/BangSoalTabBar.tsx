import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {GraduationCap, House, Users} from 'lucide-react-native';
import {colors, fonts, fontWeights} from '../../theme';
import {useAuthStore} from '../store/authStore';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TAB_ICONS: Record<string, typeof House> = {
  Beranda: House,
  Belajar: GraduationCap,
  Sosial: Users,
};

function initials(name?: string | null): string {
  if (!name) {
    return 'BS';
  }
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const result = parts.map(p => p[0]?.toUpperCase() ?? '').join('');
  return result || 'BS';
}

export function BangSoalTabBar({
  state,
  navigation,
  insets,
}: BottomTabBarProps) {
  const user = useAuthStore(s => s.user);

  return (
    <View style={[styles.bar, {paddingBottom: insets.bottom + 8}]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const tint = focused ? colors.primary[800] : colors.slate[400];
        const Icon = TAB_ICONS[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            // animate the pill growing into the tapped tab / collapsing the old one
            LayoutAnimation.configureNext(
              LayoutAnimation.create(220, 'easeInEaseOut', 'opacity'),
            );
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{selected: focused}}
            onPress={onPress}
            style={[styles.pill, focused && styles.pillActive]}>
            {route.name === 'Profil' ? (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: focused
                      ? colors.primary[800]
                      : colors.slate[500],
                  },
                ]}>
                <Text style={styles.avatarText}>
                  {initials(user?.full_name)}
                </Text>
              </View>
            ) : Icon ? (
              <Icon size={22} color={tint} fill={tint} />
            ) : null}
            {focused ? <Text style={styles.label}>{route.name}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopColor: colors.gray[100],
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  pill: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillActive: {
    backgroundColor: colors.primary[100],
  },
  label: {
    color: colors.primary[800],
    fontFamily: fonts.quicksand,
    fontSize: 15,
    fontWeight: fontWeights.bold,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  avatarText: {
    color: colors.white,
    fontFamily: fonts.quicksand,
    fontSize: 10,
    fontWeight: fontWeights.bold,
  },
});
