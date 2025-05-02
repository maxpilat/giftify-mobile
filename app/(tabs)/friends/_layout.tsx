import { Icon } from '@/components/Icon';
import { ThemedText } from '@/components/ThemedText';
import { ProfileProvider } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

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
    headerTitle: 'Найти друзей',
    headerLeft: () => (
      <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <Icon name="left" size={18} color={theme.primary} />
        <ThemedText style={{ color: theme.primary }}>Назад</ThemedText>
      </TouchableOpacity>
    ),
  });

  return (
    <ProfileProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}
        />
        <Stack.Screen name="searchFriends" options={getSearchFriendsScreenOptions()} />
      </Stack>
    </ProfileProvider>
  );
}
