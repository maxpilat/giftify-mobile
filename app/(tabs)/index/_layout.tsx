import { Stack } from 'expo-router';

export default function IndexLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Профиль', headerShown: false }} />
      <Stack.Screen name="wishes" options={{ title: 'Желания', headerBackTitle: 'Назад' }} />
    </Stack>
  );
}
