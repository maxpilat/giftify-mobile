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
    contentStyle: {
      backgroundColor: theme.background,
    },
    headerTitle: () => <ThemedText>Найти друзей</ThemedText>,
    headerLeft: BackButton,
  });

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}
      />
      <Stack.Screen name="searchFriends" options={getSearchFriendsScreenOptions()} />
    </Stack>
  );
}
