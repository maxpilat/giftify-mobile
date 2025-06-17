import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { BackButton } from '@/components/BackButton';

export default function ProfileLayout() {
  const { theme } = useTheme();

  const getModalScreenOptions = (title: string): NativeStackNavigationOptions => ({
    presentation: 'modal',
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: theme.background,
    },
    headerTitle: () => <ThemedText>{title}</ThemedText>,
    headerLeft: () => (
      <TouchableOpacity onPress={router.back}>
        <ThemedText style={{ color: theme.primary }}>Отмена</ThemedText>
      </TouchableOpacity>
    ),
    contentStyle: {
      backgroundColor: theme.background,
    },
  });

  const getFeedScreenOptions = (title: string): NativeStackNavigationOptions => ({
    headerTitle: () => <ThemedText type="bodyLargeMedium">{title}</ThemedText>,
    headerLeft: () => <BackButton />,
    headerStyle: {
      backgroundColor: theme.background,
    },
    contentStyle: {
      backgroundColor: theme.background,
    },
  });

  return (
    <Stack>
      <Stack.Screen name="[userId]" />
      <Stack.Screen
        name="wishes"
        options={({ route }) =>
          getFeedScreenOptions((route.params as { isMyBookings?: string })?.isMyBookings ? 'Я дарю' : 'Желания')
        }
      />
      <Stack.Screen name="piggyBanks" options={getFeedScreenOptions('Копилки')} />
      <Stack.Screen
        name="wishModal"
        options={({ route }) =>
          getModalScreenOptions((route.params as { wishId?: string })?.wishId ? 'Редактирование' : 'Новое желание')
        }
      />
      <Stack.Screen
        name="wishListModal"
        options={({ route }) =>
          getModalScreenOptions(
            (route.params as { wishListId?: string })?.wishListId ? 'Редактирование' : 'Новый список'
          )
        }
      />
      <Stack.Screen
        name="piggyBankModal"
        options={({ route }) =>
          getModalScreenOptions(
            (route.params as { piggyBankId?: string })?.piggyBankId ? 'Редактирование' : 'Новая копилка'
          )
        }
      />
      <Stack.Screen name="piggyBankDepositModal" options={getModalScreenOptions('')} />
    </Stack>
  );
}
