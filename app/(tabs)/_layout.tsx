import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Tab } from '@/components/Tab';
import TabBarBackground from '@/components/TabBarBackground';
import TabBarBackgroundIOS from '@/components/TabBarBackground.ios';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@/components/Icon';
import { StoreProvider } from '@/hooks/useStore';

export default function TabLayout() {
  const { theme, themeType, systemThemeType } = useTheme();

  return (
    <StoreProvider>
      <Tabs
        screenOptions={{
          tabBarInactiveTintColor: theme.tabBarTint,
          tabBarActiveTintColor: theme.secondary,
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
          name="profile"
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
          name="chats"
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
    </StoreProvider>
  );
}
