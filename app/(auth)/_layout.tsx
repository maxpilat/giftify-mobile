import { BackButton } from '@/components/BackButton';
import { toastConfig } from '@/constants/toast';
import { useTheme } from '@/hooks/useTheme';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function AuthLayout() {
  const { theme, themeType, systemThemeType } = useTheme();

  const getScreenOptions = (): NativeStackNavigationOptions => ({
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: theme.background,
    },
    contentStyle: {
      backgroundColor: theme.background,
    },
    headerTitle: '',
    headerLeft: BackButton,
  });

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signIn" options={getScreenOptions()} />
      <Stack.Screen name="signUp" options={getScreenOptions()} />
      <Stack.Screen name="validateEmail" options={getScreenOptions()} />
      <Stack.Screen name="forgotPassword" options={getScreenOptions()} />
      <Stack.Screen name="resetPassword" options={getScreenOptions()} />
      <Toast config={toastConfig(themeType === 'system' ? systemThemeType : themeType)} />
    </Stack>
  );
}
