import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Tab } from '@/components/Tab';
import TabBarBackground from '@/components/TabBarBackground';
import TabBarBackgroundIOS from '@/components/TabBarBackground.ios';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@/components/Icon';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarActiveTintColor: theme.tabIconSelected,
        headerShown: false,
        tabBarButton: Tab,
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
          tabBarIcon: ({ color }) => <Icon name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Друзья',
          tabBarIcon: ({ color }) => <Icon name="friends" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats/index"
        options={{
          title: 'Чаты',
          tabBarIcon: ({ color }) => <Icon name="chats" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Настройки',
          tabBarIcon: ({ color }) => <Icon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
