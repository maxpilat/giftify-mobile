import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export default function IndexLayout() {
  const { theme } = useTheme();

  const getModalOptions = (title: string): NativeStackNavigationOptions => ({
    presentation: 'modal',
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: theme.background,
    },
    contentStyle: {
      backgroundColor: theme.background,
    },
    headerTitle: () => <ThemedText>{title}</ThemedText>,
    headerLeft: () => (
      <TouchableOpacity onPress={() => router.back()}>
        <ThemedText style={{ color: theme.primary }}>Отмена</ThemedText>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity onPress={() => router.setParams({ submit: 'true' })}>
        <ThemedText style={{ color: theme.primary }}>Готово</ThemedText>
      </TouchableOpacity>
    ),
  });

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Профиль', headerShown: false }} />
      <Stack.Screen name="wishes" options={{ title: 'Желания', headerBackTitle: 'Назад' }} />
      <Stack.Screen name="piggyBanks" options={{ title: 'Копилки', headerBackTitle: 'Назад' }} />
      <Stack.Screen
        name="wishModal"
        options={({ route }) =>
          getModalOptions((route.params as { wishId?: string })?.wishId ? 'Редактирование' : 'Новое желание')
        }
      />
      <Stack.Screen
        name="wishListModal"
        options={({ route }) =>
          getModalOptions((route.params as { wishListId?: string })?.wishListId ? 'Редактирование' : 'Новый список')
        }
      />
    </Stack>
  );
}
