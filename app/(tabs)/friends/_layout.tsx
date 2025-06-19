import { BackButton } from '@/components/BackButton';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Stack } from 'expo-router';

export default function FriendsLayout() {
  const { theme } = useTheme();

  const getSearchFriendsScreenOptions = (): NativeStackNavigationOptions => ({
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: theme.background,
    },
    headerTitle: () => <ThemedText type="bodyLargeMedium">Найти друзей</ThemedText>,
    headerLeft: () => <BackButton />,
    contentStyle: {
      backgroundColor: theme.background,
    },
  });

  return (
    <Stack initialRouteName="[userId]">
      <Stack.Screen
        name="[userId]"
        options={{
          title: 'Друзья',
          headerTitleStyle: {
            fontFamily: 'stolzl-medium',
            color: theme.text,
          },
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerLargeTitleStyle: {
            fontFamily: 'stolzl-medium',
            color: theme.text,
          },
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerBackVisible: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      />
      <Stack.Screen name="searchFriends" options={getSearchFriendsScreenOptions()} />
      <Stack.Screen name="friendProfile/[userId]" />
    </Stack>
  );
}
