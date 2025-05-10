import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { BackButton } from '@/components/BackButton';

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
      <TouchableOpacity onPress={router.back}>
        <ThemedText style={{ color: theme.primary }}>Отмена</ThemedText>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity onPress={() => router.setParams({ isSubmit: 'true' })}>
        <ThemedText style={{ color: theme.primary }}>Готово</ThemedText>
      </TouchableOpacity>
    ),
  });

  const getProfileOptions = (): NativeStackNavigationOptions => ({
    headerTransparent: true,
    title: '',
    headerLeft: () => router.canGoBack() && <BackButton />,
  });

  return (
    <Stack>
      <Stack.Screen
        name="[userId]"
        getId={() => `${Date.now()}-${Math.random().toString(36).slice(2)}`}
        options={getProfileOptions()}
      />
      <Stack.Screen name="wishes" options={{ title: 'Желания', headerLeft: BackButton }} />
      <Stack.Screen name="piggyBanks" options={{ title: 'Копилки', headerLeft: BackButton }} />
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
      <Stack.Screen
        name="piggyBankModal"
        options={({ route }) =>
          getModalOptions((route.params as { piggyBankId?: string })?.piggyBankId ? 'Редактирование' : 'Новая копилка')
        }
      />
    </Stack>
  );
}
