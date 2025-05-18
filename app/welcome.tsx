import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native';

type GridItem = {
  title: string;
  subtitle: string;
  image: string;
};

const HANDS: GridItem[] = [
  {
    title: 'Вишлисты',
    subtitle: 'Составляйте свои списки желаний',
    image: '@/assets/images/hand-01.png',
  },
  {
    title: 'Копилки',
    subtitle: 'Начинайте копить на свои мечты',
    image: '@/assets/images/hand-02.png',
  },
  {
    title: 'Идеи',
    subtitle: 'Смотрите крутые идеи подарков для друзей',
    image: '@/assets/images/hand-03.png',
  },
  {
    title: 'Чаты',
    subtitle: 'Узнавайте всё анонимно и делайте сюрпризы',
    image: '@/assets/images/hand-04.png',
  },
];

export default function WelcomeScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ThemedText type="h1" style={[styles.title, { color: theme.secondary }]}>
          Привет!
        </ThemedText>
        <ThemedText type="h1" style={styles.subtitle}>
          Это{' '}
          <ThemedText type="h1" style={{ color: theme.secondary }}>
            Giftify{' '}
          </ThemedText>
          — приложение, которое исполняет желания
        </ThemedText>
        <FlatList
          style={styles.gridContainer}
          contentContainerStyle={styles.gridContentContainer}
          data={HANDS}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.gridItemWrapper}>
              <View style={[styles.gridItem, { backgroundColor: theme.button }]}>
                <View style={styles.gridItemText}>
                  <ThemedText type="h2" style={styles.gridItemTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText type="bodyLargeMedium" style={styles.gridItemSubtitle}>
                    {item.subtitle}
                  </ThemedText>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    lineHeight: 42,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 24,
  },
  gridContainer: {
    marginTop: 24,
    width: '100%',
  },
  gridContentContainer: {
    gap: 10,
  },
  gridItemWrapper: {
    width: '50%',
  },
  gridItem: {
    paddingTop: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginHorizontal: 2,
  },
  gridItemText: {},
  gridItemTitle: {
    color: Colors.white,
  },
  gridItemSubtitle: {
    color: Colors.white,
  },
});
