import { TouchableOpacity } from 'react-native';
import { Icon } from '@/components/Icon';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';

export function BackButton() {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={router.back} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      <Icon name="left" size={18} color={theme.primary} />
      <ThemedText style={{ color: theme.primary }}>Назад</ThemedText>
    </TouchableOpacity>
  );
}
