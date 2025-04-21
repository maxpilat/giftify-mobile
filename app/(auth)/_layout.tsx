import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function AuthLayout() {
  const { theme } = useTheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.background,
          },
          contentStyle: {
            backgroundColor: theme.background,
          },
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText style={{ color: theme.primary }}>Назад</ThemedText>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
