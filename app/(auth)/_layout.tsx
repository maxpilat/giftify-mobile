import { Icon } from '@/components/Icon';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

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
    headerLeft: () => (
      <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <Icon name="left" size={18} color={theme.primary} />
        <ThemedText style={{ color: theme.primary }}>Назад</ThemedText>
      </TouchableOpacity>
    ),
  });

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signUp" options={getScreenOptions()} />
      <Stack.Screen name="validateEmail" options={getScreenOptions()} />
    </Stack>
  );
}
