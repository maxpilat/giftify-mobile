import { PlatformButton } from '@/components/PlatformButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { FlatList, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { SafeAreaView, Image } from 'react-native';

type GridItem = {
  title: string;
  subtitle: string;
  image: string;
};

const HANDS: GridItem[] = [
  {
    title: 'Вишлисты',
    subtitle: 'Составляйте свои списки желаний',
    image: require('@/assets/images/hand-01.png'),
  },
  {
    title: 'Копилки',
    subtitle: 'Начинайте копить на свои мечты',
    image: require('@/assets/images/hand-02.png'),
  },
  {
    title: 'Идеи',
    subtitle: 'Смотрите крутые идеи подарков для друзей',
    image: require('@/assets/images/hand-03.png'),
  },
  {
    title: 'Чаты',
    subtitle: 'Узнавайте всё анонимно и делайте сюрпризы',
    image: require('@/assets/images/hand-04.png'),
  },
];

export default function WelcomeScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ThemedText type="h1" style={[styles.title, { color: theme.secondary }]}>
          Привет!
        </ThemedText>
        <ThemedText type="h2" style={styles.subtitle}>
          Это{' '}
          <ThemedText type="h2" style={{ color: theme.secondary }}>
            Giftify{' '}
          </ThemedText>
          — приложение, которое исполняет желания
        </ThemedText>
        <FlatList
          style={styles.gridContainer}
          contentContainerStyle={styles.gridContentContainer}
          data={HANDS}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View style={[styles.gridItemWrapper, { [index % 2 === 0 ? 'marginRight' : 'marginLeft']: 5 }, ,]}>
              <View
                style={[
                  styles.gridItem,
                  { backgroundColor: theme.button },
                  index === 0 && { backgroundColor: theme.secondary },
                ]}
              >
                <View style={styles.gridItemText}>
                  <ThemedText type="h2" style={styles.gridItemTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText type="labelBase" style={styles.gridItemSubtitle}>
                    {item.subtitle}
                  </ThemedText>
                </View>
                <Image style={styles.hand} source={item.image as ImageSourcePropType} />
                <View style={{ height: 100 }}></View>
              </View>
            </View>
          )}
        />
        <PlatformButton style={styles.button} onPress={() => router.push('/(auth)')}>
          <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
            Начать
          </ThemedText>
        </PlatformButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 36,
    lineHeight: 36,
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
    flex: 1,
  },
  gridItem: {
    borderRadius: 24,
    alignItems: 'center',
    gap: 18,
    flexGrow: 1,
  },
  gridItemText: {
    width: '100%',
    paddingTop: 14,
    paddingHorizontal: 24,
    gap: 5,
  },
  gridItemTitle: {
    color: Colors.white,
  },
  gridItemSubtitle: {
    color: Colors.white,
  },
  hand: {
    width: 100,
    height: 100,
    position: 'absolute',
    bottom: 0,
  },
  button: {
    width: '100%',
  },
  buttonText: {
    color: Colors.white,
  },
});
