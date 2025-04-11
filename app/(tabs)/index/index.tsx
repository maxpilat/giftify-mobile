import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { ParallaxScrollView } from '@/components/ParallaxScrollView';
import { ProfileHeader, HEADER_HEIGHT } from '@/components/ProfileHeader';
import MasonryList from '@react-native-seoul/masonry-list';
import { WishCard } from '@/components/WishCard';
import { Category } from '@/components/Category';
import { Icon } from '@/components/Icon';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { Wish } from '@/models';
import { API } from '@/constants/api';
import { Colors } from '@/constants/themes';

const wishes: Wish[] = [
  {
    wishId: 0,
    wishType: 'WISH',
    name: 'Беспроводные наушники',
    description: 'Sony WH-1000XM5 с шумоподавлением',
    price: 950,
    deposit: 250,
    currency: { currencyId: 1, symbol: 'BYN', transcription: 'бел. руб.' },
    link: 'https://example.com/sony-headphones',
  },
  {
    wishId: 1,
    wishType: 'PIGGY_BANK',
    name: 'Поездка в Париж',
    description: 'Хочу на неделю в Париж весной',
    price: 3000,
    deposit: 800,
    currency: { currencyId: 1, symbol: 'BYN', transcription: 'бел. руб.' },
    link: '',
  },
  {
    wishId: 2,
    wishType: 'WISH',
    name: 'Новая клавиатура',
    description: 'Механическая клавиатура Keychron K6',
    price: 350,
    deposit: 100,
    currency: { currencyId: 1, symbol: 'BYN', transcription: 'бел. руб.' },
    link: 'https://example.com/keychron-k6',
  },
  {
    wishId: 3,
    wishType: 'WISH',
    name: 'Умная колонка',
    description: 'Яндекс Станция Макс',
    price: 500,
    deposit: 50,
    currency: { currencyId: 1, symbol: 'BYN', transcription: 'бел. руб.' },
    link: 'https://example.com/yandex-station',
  },
  {
    wishId: 4,
    wishType: 'PIGGY_BANK',
    name: 'Курс по дизайну',
    description: 'Онлайн-курс UX/UI на Coursera',
    price: 1200,
    deposit: 300,
    currency: { currencyId: 1, symbol: 'BYN', transcription: 'бел. руб.' },
    link: 'https://coursera.org/design-course',
  },
];

type TCategory = {
  id: number;
  name: string;
  count: number;
};

const categories: TCategory[] = [
  {
    id: 0,
    name: 'Мои желания',
    count: 3,
  },
  {
    id: 1,
    name: 'Новоселье',
    count: 2,
  },
  {
    id: 2,
    name: 'День рождения',
    count: 1,
  },
] as const;

export default function ProfileScreen() {
  const { theme } = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const currentTabRef = useRef(currentTab);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);

  const contentFade = useSharedValue(1);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: contentFade.value,
  }));

  useEffect(() => {
    contentFade.value = withTiming(0, { duration: 1000 }, (finished) => {
      if (finished) {
        currentTabRef.current = currentTab;
        contentFade.value = withTiming(1, { duration: 1000 });
      }
    });
  }, [currentTab]);

  useEffect(() => {
    setCurrentCategory(categories[0].id);
  }, []);

  return (
    <View style={styles.wrapper}>
      <ParallaxScrollView
        header={
          <ProfileHeader
            fullname={'Екатерина Костевич'}
            username={'washermb'}
            friendsAvatars={[
              'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg',
              'https://img.freepik.com/psd-gratuit/illustration-3d-avatar-profil-humain_23-2150671161.jpg',
              'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671149.jpg?semt=ais_hybrid',
            ]}
            friendsCount={20}
            tabs={['Желания', 'Копилки', 'Я дарю']}
            onTabChange={setCurrentTab}
          />
        }
        headerHeight={HEADER_HEIGHT}
        translateY={[-HEADER_HEIGHT / 1.5, 0, 0]}
        scale={[1, 1, 1]}
      >
        <ThemedView style={[styles.content, fadeStyle]}>
          {currentTabRef.current === 0 && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
                {categories.map((category, index) => (
                  <React.Fragment key={category.id}>
                    <View style={styles.category}>
                      <Category
                        name={category.name}
                        count={category.count}
                        isActive={currentCategory === category.id}
                        onPress={() => setCurrentCategory(category.id)}
                      />
                    </View>
                    {index === 0 && (
                      <TouchableOpacity activeOpacity={0.9} style={[styles.category, styles.addCategoryButton]}>
                        <Icon name="plus"></Icon>
                      </TouchableOpacity>
                    )}
                  </React.Fragment>
                ))}
              </ScrollView>

              <MasonryList
                data={wishes}
                keyExtractor={(wish: Wish) => wish.wishId.toString()}
                numColumns={2}
                contentContainerStyle={styles.list}
                renderItem={({ item, i }) => {
                  const wish = item as Wish;
                  return (
                    <Link
                      asChild
                      href={{ pathname: './wishes', params: { wishId: wish.wishId.toString() } }}
                      style={[styles.wish, { marginRight: i % 2 === 0 ? 8 : 0, marginLeft: i % 2 !== 0 ? 8 : 0 }]}
                    >
                      <Pressable>
                        <WishCard image={{ uri: API.getWishImage(wish.wishId) }} />
                        <View style={styles.wishInfo}>
                          <ThemedText type="h3">{wish.name}</ThemedText>
                          <ThemedText type="bodyLarge" style={{ color: theme.subtext }}>
                            {wish.price} {wish.currency?.transcription}
                          </ThemedText>
                        </View>
                      </Pressable>
                    </Link>
                  );
                }}
              />
            </>
          )}

          {currentTabRef.current === 1 && (
            <View style={styles.list}>
              {[1, 2, 3].map((item) => (
                <View key={item}>
                  <ThemedText>item</ThemedText>
                </View>
              ))}
            </View>
          )}
        </ThemedView>
      </ParallaxScrollView>
      <Pressable style={[styles.addItemButton, { backgroundColor: theme.primary }]}>
        <Icon name="plus"></Icon>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    marginTop: 16,
    gap: 16,
  },
  categories: {
    paddingLeft: 16,
    paddingRight: 10,
  },
  category: {
    marginRight: 6,
  },
  addCategoryButton: {
    borderRadius: 20,
    padding: 14,
    backgroundColor: Colors.black,
    justifyContent: 'center',
  },
  addItemButton: {
    position: 'absolute',
    bottom: 95,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 120,
  },
  list: {
    marginHorizontal: 16,
    paddingBottom: 70,
  },
  wish: {
    marginBottom: 24,
  },
  wishInfo: {
    marginTop: 10,
  },
});
