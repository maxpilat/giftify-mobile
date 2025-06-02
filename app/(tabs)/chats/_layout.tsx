import { Stack } from 'expo-router';

export default function ChatsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="[chatId]" />
      <Stack.Screen name="helpModal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="writeMessageModal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="introductionModal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
