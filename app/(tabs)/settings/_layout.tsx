import { ProfileProvider } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';

export default function FriendsLayout() {
  const { theme } = useTheme();

  return (
    <ProfileProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}
        />
      </Stack>
    </ProfileProvider>
  );
}
