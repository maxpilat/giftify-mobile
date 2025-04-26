import { ProfileProvider } from '@/hooks/useProfile';
import { Stack } from 'expo-router';

export default function FriendsLayout() {
  return (
    <ProfileProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ProfileProvider>
  );
}
