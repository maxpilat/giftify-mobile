import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { ParallaxScrollView } from '@/components/ParallaxScrollView';
import { ProfileHeader, HEADER_HEIGHT } from '@/components/ProfileHeader';
import MasonryList from '@react-native-seoul/masonry-list';
import { WishCard } from '@/components/WishCard';
import { WishListTab } from '@/components/WishListTab';
import { Icon } from '@/components/Icon';
import { ThemedView } from '@/components/ThemedView';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { Wish } from '@/models';
import { API } from '@/constants/api';
import { Colors } from '@/constants/themes';
import { ProgressBar } from '@/components/ProgressBar';
import { useWishesStore } from '@/store/useWishesStore';

const AUTH_USER_ID = 1; // temporary

export default function ProfileScreen() {
  const { theme } = useTheme();

  const { userId = AUTH_USER_ID } = useLocalSearchParams();

  const { wishes, wishLists, piggyBanks, bookings, fetchWishes, fetchWishLists, fetchPiggyBanks, fetchBookings } =
    useWishesStore();

  const [currentWishListId, setCurrentWishListId] = useState<number | null>(null);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [currentVisibleTabIndex, setCurrentVisibleTabIndex] = useState(0);

  const contentOpacity = useSharedValue(1);
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const addItemButtonOpacity = useSharedValue(1);
  const addItemButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: addItemButtonOpacity.value,
    transform: [{ scale: addItemButtonOpacity.value }],
  }));

  useEffect(() => {
    fetchWishes(+userId);
    fetchWishLists(+userId);
    fetchPiggyBanks(+userId);
    fetchBookings(+userId);

    setCurrentWishListId(wishLists[0].wishListId);
  }, [userId]);

  useEffect(() => {
    contentOpacity.value = withTiming(0, { duration: 50 }, (finished) => {
      if (finished) {
        runOnJS(setCurrentVisibleTabIndex)(currentTabIndex);
      }
    });
  }, [currentTabIndex]);

  useEffect(() => {
    console.log(wishes);
  }, [wishes]);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 300 });
    const opacity = currentVisibleTabIndex === 2 ? 0 : 1;
    addItemButtonOpacity.value = withTiming(opacity, { duration: 300 });
  }, [currentVisibleTabIndex]);

  const addItem = () => {
    if (currentTabIndex === 0) {
      router.push('./wishModal');
    } else if (currentTabIndex === 1) {
    }
  };

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
            onTabChange={setCurrentTabIndex}
          />
        }
        headerHeight={HEADER_HEIGHT}
        translateY={[-HEADER_HEIGHT / 1.5, 0, 0]}
        scale={[1, 1, 1]}
      >
        <ThemedView style={[styles.content, contentAnimatedStyle]}>
          {currentVisibleTabIndex === 0 && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
                {wishLists.map((wishList, index) => (
                  <React.Fragment key={wishList.wishListId}>
                    {index === 0 && (
                      <>
                        <View style={styles.wishList}>
                          <WishListTab name="Мои желания" count={wishes.length} isActive={false} onPress={() => {}} />
                        </View>
                        <View style={[styles.wishList, styles.addWishListButton]}>
                          <Link asChild href={'./wishListModal'}>
                            <TouchableOpacity activeOpacity={0.7} style={styles.addWishListButtonTouchable}>
                              <Icon name="plus" />
                            </TouchableOpacity>
                          </Link>
                        </View>
                      </>
                    )}
                    <View style={styles.wishList}>
                      <WishListTab
                        name={wishList.name}
                        count={wishList.wishes.length}
                        isActive={currentWishListId === wishList.wishListId}
                        onPress={() => setCurrentWishListId(wishList.wishListId)}
                      />
                    </View>
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
                      style={[
                        styles.masonryItem,
                        { marginRight: i % 2 === 0 ? 8 : 0, marginLeft: i % 2 !== 0 ? 8 : 0 },
                      ]}
                    >
                      <Pressable>
                        <WishCard
                          image={{ uri: API.getWishImage(wish.wishId) }}
                          name={wish.name}
                          price={wish.price}
                          currency={wish.currency}
                        />
                      </Pressable>
                    </Link>
                  );
                }}
              />
            </>
          )}

          {currentVisibleTabIndex === 1 && (
            <View style={[styles.list, styles.piggyBankList]}>
              {piggyBanks.map((wish) => (
                <Link
                  asChild
                  key={wish.wishId}
                  style={styles.piggyBank}
                  href={{ pathname: './piggyBanks', params: { wishId: wish.wishId.toString() } }}
                >
                  <Pressable>
                    <View style={styles.piggyBankBody}>
                      <View style={styles.piggyBankInfo}>
                        <ThemedText type="h3">{wish.name}</ThemedText>
                        <View style={styles.piggyBankPrice}>
                          <ThemedText type="bodyBase" style={styles.piggyBankPriceLabel}>
                            Стоимость:
                          </ThemedText>
                          <ThemedText type="bodyLargeMedium">
                            {wish.price} {wish.currency?.symbol}
                          </ThemedText>
                        </View>
                      </View>
                      <View style={styles.piggyBankCard}>
                        <WishCard
                          image={{
                            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL_BgTANZFIIIVFGv1FjjDYvDzygFMkufN1A&s',
                            width: 2,
                            height: 1,
                          }}
                        />
                      </View>
                    </View>
                    <ProgressBar currentAmount={wish.deposit!} targetAmount={wish.price!} currency={wish.currency} />
                  </Pressable>
                </Link>
              ))}
            </View>
          )}

          {currentVisibleTabIndex === 2 && (
            <>
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
                      style={[
                        styles.masonryItem,
                        { marginRight: i % 2 === 0 ? 8 : 0, marginLeft: i % 2 !== 0 ? 8 : 0 },
                      ]}
                    >
                      <Pressable>
                        <WishCard
                          image={{ uri: API.getWishImage(wish.wishId) }}
                          name={wish.name}
                          price={wish.price}
                          currency={wish.currency}
                        />
                      </Pressable>
                    </Link>
                  );
                }}
              />
            </>
          )}
        </ThemedView>
      </ParallaxScrollView>

      <Animated.View style={[styles.addItemButton, { backgroundColor: theme.primary }, addItemButtonAnimatedStyle]}>
        <Pressable onPress={addItem} style={styles.addItemButtonPressable}>
          <Icon name="plus" />
        </Pressable>
      </Animated.View>
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
  wishList: {
    marginRight: 6,
  },
  addWishListButton: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.black,
  },
  addWishListButtonTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  addItemButton: {
    position: 'absolute',
    bottom: 95,
    borderRadius: 30,
    height: 60,
    width: 120,
    overflow: 'hidden',
  },
  addItemButtonPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    marginHorizontal: 16,
    paddingBottom: 70,
  },
  masonryItem: {
    marginBottom: 24,
  },
  piggyBankList: {
    gap: 32,
  },
  piggyBank: {
    gap: 20,
  },
  piggyBankBody: {
    flexDirection: 'row',
    gap: 24,
  },
  piggyBankInfo: {
    flex: 8,
    justifyContent: 'center',
    gap: 14,
  },
  piggyBankPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  piggyBankPriceLabel: {
    color: Colors.grey,
    paddingRight: 10,
  },
  piggyBankCard: {
    flex: 7,
  },
});
