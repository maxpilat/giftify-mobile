import { Icon } from '@/components/Icon';
import { ThemedText } from '@/components/ThemedText';
import { ProfileProvider } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function SettingsLayout() {
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
    <ProfileProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}
        />
        <Stack.Screen name="changeEmail" options={getScreenOptions()} />
        <Stack.Screen name="validateEmail" options={getScreenOptions()} />
        <Stack.Screen
          name="changePassword"
          options={{
            ...getScreenOptions(),
            headerRight: () => (
              <TouchableOpacity onPress={() => router.setParams({ isSubmit: 'true' })}>
                <ThemedText style={{ color: theme.primary }}>Готово</ThemedText>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="changeTheme" options={{ ...getScreenOptions(), headerTitle: 'Смена темы' }} />
      </Stack>
    </ProfileProvider>
  );
}
