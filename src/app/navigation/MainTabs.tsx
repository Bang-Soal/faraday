import type {ComponentProps} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DashboardScreen} from '../../features/dashboard/screens/DashboardScreen';
import {BelajarScreen} from '../../features/belajar/screens/BelajarScreen';
import {SosialScreen} from '../../features/sosial/screens/SosialScreen';
import {ProfileScreen} from '../../features/profile/screens/ProfileScreen';
import {BangSoalTabBar} from './BangSoalTabBar';
import {MainTabParamList} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function renderTabBar(props: ComponentProps<typeof BangSoalTabBar>) {
  return <BangSoalTabBar {...props} />;
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={renderTabBar}>
      <Tab.Screen name="Beranda" component={DashboardScreen} />
      <Tab.Screen name="Belajar" component={BelajarScreen} />
      <Tab.Screen name="Sosial" component={SosialScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
