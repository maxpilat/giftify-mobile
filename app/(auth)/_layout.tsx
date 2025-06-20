import { BackButton } from '@/components/BackButton';
import { useTheme } from '@/hooks/useTheme';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const { theme } = useTheme();

  const getScreenOptions = (): NativeStackNavigationOptions => ({
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: theme.background,
    },
    contentStyle: {
      backgroundColor: theme.background,
    },
    headerTitle: '',
    headerLeft: () => <BackButton />,
  });

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signIn" options={getScreenOptions()} />
      <Stack.Screen name="signUp" options={getScreenOptions()} />
      <Stack.Screen name="validateEmail" options={getScreenOptions()} />
      <Stack.Screen name="forgotPassword" options={getScreenOptions()} />
      <Stack.Screen name="resetPassword" options={getScreenOptions()} />
    </Stack>
  );
}
