import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';

export default function FriendsLayout() {
  const { theme } = useTheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Чаты',
          headerTitleStyle: {
            fontFamily: 'stolzl-medium',
            color: theme.text,
          },
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerLargeTitleStyle: {
            fontFamily: 'stolzl-medium',
            color: theme.text,
          },
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerBackVisible: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      />
      <Stack.Screen name="[chatId]" />
    </Stack>
  );
}
