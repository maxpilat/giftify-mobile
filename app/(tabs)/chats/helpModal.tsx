import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { router, Stack } from 'expo-router';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

export default function helpModalScreen() {
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitle: () => <ThemedText>Узнайте больше</ThemedText>,
          headerRight: () => (
            <TouchableOpacity onPress={router.back}>
              <ThemedText style={{ color: theme.primary }}>Готово</ThemedText>
            </TouchableOpacity>
          ),
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <ThemedText type="h5">Для чего?</ThemedText>
          <ThemedText type="bodyLarge">
            Анонимный чат помогает сохранить сюрприз в тайне и узнавать всю необходимую информацию. Он удобен для
            уточнения деталей без раскрытия личности отправителя. Это особенно полезно, если важные детали своего
            желания человек не указал в вишлисте.
          </ThemedText>
        </View>
        <View style={styles.textContainer}>
          <ThemedText type="h5">Как написать анонимно?</ThemedText>
          <ThemedText type="bodyLarge">
            Чтобы отправить сообщение анонимно, в приложении предусмотрена возможность выбора псевдонима, а ваша
            фотография будет скрыта. Достаточно выбрать нужного собеседника, указать желаемый псевдоним и отправить
            сообщение.
          </ThemedText>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    gap: 32,
    paddingHorizontal: 16,
  },
  textContainer: {
    gap: 24,
  },
});
