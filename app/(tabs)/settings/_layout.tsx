import { BackButton } from '@/components/BackButton';
import { ThemedText } from '@/components/ThemedText';
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
    headerLeft: () => <BackButton />,
  });

  return (
    <Stack>
      <Stack.Screen name="index" />
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
      <Stack.Screen
        name="changeTheme"
        options={{
          ...getScreenOptions(),
          headerTitle: () => <ThemedText type="bodyLargeMedium">Смена темы</ThemedText>,
        }}
      />
      <Stack.Screen
        name="pickCustomColors"
        options={{
          ...getScreenOptions(),
          presentation: 'modal',
          headerLeft: () => null,
          headerTitle: () => <ThemedText type="bodyLargeMedium">Выберите цвет</ThemedText>,
        }}
      />
      <Stack.Screen
        name="changeProfileBackground"
        options={{
          ...getScreenOptions(),
          headerTitle: () => <ThemedText type="bodyLargeMedium">Фон профиля</ThemedText>,
        }}
      />
      <Stack.Screen
        name="pickProfileBackgroundColor"
        options={{
          ...getScreenOptions(),
          presentation: 'modal',
          headerLeft: () => null,
          headerTitle: () => <ThemedText type="bodyLargeMedium">Выберите цвет</ThemedText>,
        }}
      />
    </Stack>
  );
}
