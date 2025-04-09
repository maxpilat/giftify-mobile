import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { ParallaxScrollView } from '@/components/ParallaxScrollView';
import { ProfileHeader, HEADER_HEIGHT } from '@/components/ProfileHeader';
import MasonryList from '@react-native-seoul/masonry-list';
import { WishCard, type Props as TWish } from '@/components/WishCard';
import { Category } from '@/components/Category';
import { Icon } from '@/components/Icon';
import { Colors } from '@/constants/Themes';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';

const wishes: (TWish & { id: number; categoryId: number })[] = [
  {
    id: 0,
    image: {
      uri: 'https://vector.thedroidyouarelookingfor.info/wp-content/uploads/2020/09/EmoDesktopPet.jpg',
    },
    name: 'Робот Emo',
    price: 1800,
    currency: 'BYN',
    categoryId: 1,
  },
  {
    id: 1,
    image: {
      uri: 'https://images.pexels.com/photos/258196/pexels-photo-258196.jpeg?cs=srgb&dl=pexels-pixabay-258196.jpg&fm=jpg',
    },
    name: 'Робот Emo',
    price: 1800,
    currency: 'BYN',
    categoryId: 1,
  },
  {
    id: 2,
    image: {
      uri: 'https://images.pexels.com/photos/1156684/pexels-photo-1156684.jpeg?cs=srgb&dl=pexels-arunbabuthomas-1156684.jpg&fm=jpg',
    },
    name: 'Робот Emo',
    price: 1800,
    currency: 'BYN',
    categoryId: 2,
  },
] as const;

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
  const [currentTab, setCurrentTab] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false });

  useEffect(() => {
    setCurrentCategory(categories[0].id);
  }, []);

  return (
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
          scrollY={scrollY}
        />
      }
      headerHeight={HEADER_HEIGHT}
      translateY={[-HEADER_HEIGHT / 1.5, 0, 0]}
      scale={[1, 1, 1]}
      onScroll={handleScroll}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map((category, index) => (
            <React.Fragment key={category.id}>
              <View style={styles.categoryWrapper}>
                <Category
                  name={category.name}
                  count={category.count}
                  isActive={currentCategory === category.id}
                  onPress={() => setCurrentCategory(category.id)}
                />
              </View>
              {index === 0 && (
                <TouchableOpacity activeOpacity={0.5} style={[styles.categoryWrapper, styles.plusCategoryButton]}>
                  <Icon name="plus"></Icon>
                </TouchableOpacity>
              )}
            </React.Fragment>
          ))}
        </ScrollView>

        <ThemedView style={styles.list}>
          <MasonryList
            data={wishes}
            keyExtractor={(_, index) => index.toString()}
            numColumns={2}
            renderItem={({ item, i }) => (
              <Pressable
                style={{
                  flex: 1,
                  marginRight: i % 2 === 0 ? 8 : 0,
                  marginLeft: i % 2 !== 0 ? 8 : 0,
                  marginBottom: 16,
                }}
                onPress={() => router.push('./wishes')}
              >
                <WishCard {...(item as TWish)} />
              </Pressable>
            )}
          />
        </ThemedView>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    gap: 16,
  },
  categories: {
    marginLeft: 16,
  },
  categoryWrapper: {
    marginRight: 6,
  },
  plusCategoryButton: {
    borderRadius: 20,
    padding: 14,
    backgroundColor: Colors.black,
    justifyContent: 'center',
  },
  plusItemButton: {},
  list: {
    marginHorizontal: 16,
  },
});
