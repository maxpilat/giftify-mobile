import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const { theme } = useTheme();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
