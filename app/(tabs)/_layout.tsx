import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import TabBarBackgroundIOS from '@/components/ui/TabBarBackground.ios';
import { useTheme } from '@/hooks/useTheme';
import Heart from '@/assets/icons/Heart.svg';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarActiveTintColor: theme.tabIconSelected,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: Platform.OS === 'ios' ? TabBarBackgroundIOS : TabBarBackground,
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: theme.tabBarBorder,
          ...Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {
              position: 'absolute',
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color }) => <Heart color={color} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Друзья',
          tabBarIcon: ({ color }) => <Heart color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Чаты',
          tabBarIcon: ({ color }) => <Heart color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Настройки',
          tabBarIcon: ({ color }) => <Heart color={color} />,
        }}
      />
    </Tabs>
  );
}
