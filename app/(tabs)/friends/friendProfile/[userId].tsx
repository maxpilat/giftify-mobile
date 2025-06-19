import { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Share,
  Dimensions,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { ParallaxScrollView } from '@/components/ParallaxScrollView';
import { ProfileHeader } from '@/components/ProfileHeader';
import MasonryList from '@react-native-seoul/masonry-list';
import { WishCard } from '@/components/WishCard';
import { WishListTab } from '@/components/WishListTab';
import { ThemedView } from '@/components/ThemedView';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { Friend, Profile, ProfileBackground, Wish, WishList } from '@/models';
import { API } from '@/constants/api';
import { Colors } from '@/constants/themes';
import { ProgressBar } from '@/components/ProgressBar';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStore';
import { Action } from '@/components/ActionsButton';
import { base64ToBinaryArray } from '@/utils/convertImage';
import { getDefaultBackground } from '@/utils/profileBackground';
import * as Linking from 'expo-linking';
import { showToast } from '@/utils/showToast';
import { BackButton } from '@/components/BackButton';
import { Skeleton } from '@/components/Skeleton';

const screenWidth = Dimensions.get('window').width;

type SearchParams = {
  userId: string;
  wishListId?: string;
};

export default function ProfileScreen() {
  const { theme, themeType, systemThemeType } = useTheme();
  const { user: authUser } = useAuth();
  const {
    avatar: myAvatar,
    bookings: myBookings,
    fetchBookings: fetchMyBookings,
    fetchWishes: fetchMyWishes,
    isFriend,
  } = useStore();
  const { userId, wishListId } = useLocalSearchParams<SearchParams>();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [currentVisibleTabIndex, setCurrentVisibleTabIndex] = useState(0);
  const [currentWishListId, setCurrentWishListId] = useState<number | null>(null);

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishLists, setWishLists] = useState<WishList[]>([]);
  const [piggyBanks, setPiggyBanks] = useState<Wish[]>([]);
  const [profile, setProfile] = useState<Profile>();
  const [avatar, setAvatar] = useState<string>();
  const [background, setBackground] = useState<ProfileBackground>();
  const [friends, setFriends] = useState<Friend[]>([]);

  const [isWishesLoading, setIsWishesLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const themeTypeValue = themeType === 'system' ? systemThemeType : themeType;
  const listPaddingBottom = 80;
  const wishListData = wishLists.find(({ wishListId }) => wishListId === currentWishListId)?.wishes ?? wishes;

  const contentOpacity = useSharedValue(1);
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const headerBackgroundOpacity = useSharedValue(0);
  const headerAnimatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor:
        themeTypeValue === 'light'
          ? `rgba(255, 255, 255, ${headerBackgroundOpacity.value})`
          : `rgba(17, 19, 24, ${headerBackgroundOpacity.value})`,
    }),
    [theme.background]
  );
  const headerTitleAnimatedStyle = useAnimatedStyle(() => ({ opacity: headerBackgroundOpacity.value }));

  useEffect(() => {
    headerBackgroundOpacity.value = withTiming(isHeaderVisible ? 1 : 0, { duration: 300 });
  }, [isHeaderVisible]);

  useEffect(() => {
    if (wishListId && wishLists.length) setCurrentWishListId(+wishListId);
  }, [wishListId]);

  useEffect(() => {
    if (background?.id === 0) {
      setBackground(getDefaultBackground());
    }
  }, [themeTypeValue]);

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  useEffect(() => {
    contentOpacity.value = withTiming(0, { duration: 50 }, (finished) => {
      if (finished) {
        runOnJS(setCurrentVisibleTabIndex)(currentTabIndex);
      }
    });
  }, [currentTabIndex]);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 300 });
  }, [currentVisibleTabIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsHeaderVisible(event.nativeEvent.contentOffset.y > 210);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData().then(() => setIsRefreshing(false));
  };

  const fetchData = async () => {
    const promises: Promise<any>[] = [];

    apiFetchImage({
      endpoint: API.profile.getAvatar(+userId),
      token: authUser.token,
    }).then(setAvatar);

    apiFetchData<ProfileBackground>({
      endpoint: API.profile.getBackground(+userId),
      token: authUser.token,
    }).then((serverBackground) => {
      if (!serverBackground.backgroundImage && !serverBackground.backgroundColor) {
        setBackground(getDefaultBackground());
      } else {
        const background: ProfileBackground = {
          ...serverBackground,
          backgroundImage: serverBackground.backgroundImage
            ? `data:image;base64,${serverBackground.backgroundImage}`
            : undefined,
        };
        setBackground(background);
      }
    });

    const wishesPromise = apiFetchData<Wish[]>({
      endpoint: API.profile.getWishes(+userId),
      token: authUser.token,
    })
      .then(async (data) => {
        setWishes(data);

        const imagesMap = new Map(
          await Promise.all(
            data.map(async (wish) => {
              const image = await apiFetchImage({
                endpoint: API.wishes.getImage(wish.wishId),
                token: authUser.token,
              });
              return [wish.wishId, image] as const;
            })
          )
        );

        const updatedWishes = data.map((wish) => ({
          ...wish,
          image: imagesMap.get(wish.wishId),
        }));

        setWishes(updatedWishes);
      })
      .then(() => setIsWishesLoading(false));

    const wishListsPromise = apiFetchData<WishList[]>({
      endpoint: API.profile.getWishLists(+userId),
      token: authUser.token,
    })
      .then(setWishLists)
      .then(() => wishListId && setCurrentWishListId(+wishListId));

    const piggyBanksPromise = apiFetchData<Wish[]>({
      endpoint: API.profile.getPiggyBanks(+userId),
      token: authUser.token,
    }).then(async (data) => {
      setPiggyBanks(data);

      const imagesMap = new Map(
        await Promise.all(
          data.map(async (piggyBank) => {
            const image = await apiFetchImage({
              endpoint: API.wishes.getImage(piggyBank.wishId),
              token: authUser.token,
            });
            return [piggyBank.wishId, image] as const;
          })
        )
      );

      const updatedPiggyBanks = data.map((piggyBank) => ({
        ...piggyBank,
        image: imagesMap.get(piggyBank.wishId),
      }));

      setPiggyBanks(updatedPiggyBanks);
    });

    const friendsPromise = apiFetchData<Friend[]>({
      endpoint: API.friends.getFriends(+userId),
      token: authUser.token,
    }).then(async (friends) => {
      setFriends(friends);

      const avatarsMap = new Map(
        await Promise.all(
          friends.map(async (friend) => {
            const avatar = await apiFetchImage({
              endpoint: API.profile.getAvatar(friend.friendId),
              token: authUser.token,
            });
            return [friend.friendId, avatar] as const;
          })
        )
      );

      const updatedFriends = friends.map((friend) => ({
        ...friend,
        avatar: avatarsMap.get(friend.friendId),
      }));

      setFriends(updatedFriends);
    });

    const profilePromise = apiFetchData<Profile>({
      endpoint: API.profile.getProfile(+userId),
      token: authUser.token,
    }).then(setProfile);

    promises.push(profilePromise, wishesPromise, wishListsPromise, piggyBanksPromise, friendsPromise);
    await Promise.all(promises);
  };

  const shareWishList = () => {
    const deepLink = Linking.createURL(`/profile/index/${userId}`, {
      queryParams: { wishListId: currentWishListId?.toString() },
    });

    Share.share({ url: deepLink });
  };

  const shareWish = (wish: Wish) => {
    const deepLink = Linking.createURL('/profile/wishes', {
      queryParams: { userId: wish.wisherProfileData.userId.toString(), wishId: wish.wishId.toString() },
    });

    Share.share({ url: deepLink });
  };

  const getBookingAction = (wishId: number): Action => {
    const booking = myBookings.find((item) => item.wish.wishId === wishId);
    const label = booking ? 'Снять бронь' : 'Забронировать';

    return {
      label,
      onPress: async () => {
        try {
          await apiFetchData({
            endpoint: booking ? API.booking.cancel(booking.wish.wishId) : API.booking.create,
            method: booking ? 'DELETE' : 'POST',
            body: booking ? undefined : { wishId, bookerId: authUser.id },
            token: authUser.token,
          });

          const newBookings = await fetchMyBookings();

          if (!booking) {
            const newBooking = newBookings.find(
              (b) => !myBookings.some((myBooking) => myBooking.bookingId === b.bookingId)
            );

            setWishes((prevWishes) =>
              prevWishes.map((prevWish) => ({
                ...prevWish,
                activeBookingId: prevWish.wishId === wishId ? newBooking?.bookingId : prevWish.activeBookingId,
              }))
            );

            setWishLists((prevWishLists) =>
              prevWishLists.map((prevWishList) => ({
                ...prevWishList,
                wishes: prevWishList.wishes.map((prevWish) => ({
                  ...prevWish,
                  activeBookingId: prevWish.wishId === wishId ? newBooking?.bookingId : prevWish.activeBookingId,
                })),
              }))
            );
          }

          showToast('success', booking ? 'Бронь снята' : 'Желание забронировано');
        } catch {
          showToast('error', booking ? 'Не удалось снять бронь' : 'Не удалось забронировать желание');
        }
      },
    };
  };

  const sharePiggyBank = (piggyBank: Wish) => {
    const deepLink = Linking.createURL('/profile/piggyBanks', {
      queryParams: { userId: piggyBank.wisherProfileData.userId.toString(), piggyBankId: piggyBank.wishId.toString() },
    });

    Share.share({ url: deepLink });
  };

  const saveWish = (wish: Wish) => {
    if (wish.image) {
      apiFetchData({
        endpoint: API.wishes.create,
        method: 'POST',
        body: {
          wisherId: authUser.id,
          wishType: 'TYPE_WISH',
          name: wish.name,
          description: wish.description,
          price: wish.price,
          currencyId: wish.currency?.currencyId,
          link: wish.link,
          image: base64ToBinaryArray(wish.image || ''),
        },
        token: authUser.token,
      })
        .then(fetchMyWishes)
        .then(() => showToast('success', 'Желание сохранено'))
        .catch(() => showToast('error', 'Не удалось сохранить желание'));
    }
  };

  const getMyBookingById = (bookingId: number) => {
    return myBookings.find((booking) => booking.bookingId === bookingId);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBackground: () => <Animated.View style={[StyleSheet.absoluteFill, headerAnimatedStyle]} />,
          headerTitle: () => (
            <ThemedText
              type="bodyLargeMedium"
              style={headerTitleAnimatedStyle}
            >{`${profile?.name} ${profile?.surname}`}</ThemedText>
          ),
          headerLeft: () => <BackButton />,
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      />

      <View style={styles.wrapper}>
        <ParallaxScrollView
          header={
            <ProfileHeader
              profile={profile}
              avatar={avatar}
              background={background}
              friendsAvatars={friends.slice(0, 3).map((friend) => friend.avatar)}
              friendsCount={friends.length}
              tabs={['Желания', 'Копилки']}
              onTabChange={setCurrentTabIndex}
            />
          }
          translateYFactor={[-0.5, 0, 0]}
          scale={[1, 1, 1]}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          onScroll={handleScroll}
        >
          {profile && (
            <ThemedView style={[styles.content, contentAnimatedStyle]}>
              {currentVisibleTabIndex === 0 &&
                (!isFriend(profile.userId) && profile?.isPrivate ? (
                  <View style={styles.noWishesContainer}>
                    <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                      У пользователя закрытый аккаунт
                    </ThemedText>
                  </View>
                ) : (
                  <>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      ref={scrollRef}
                      contentContainerStyle={styles.categories}
                    >
                      <View style={styles.wishList}>
                        <WishListTab
                          name={'Все желания'}
                          count={wishes.length}
                          isActive={!currentWishListId}
                          onPress={() => setCurrentWishListId(null)}
                          actions={[{ label: 'Поделиться', onPress: shareWishList }]}
                        />
                      </View>

                      {wishLists.map((wishList) => (
                        <View key={wishList.wishListId} style={styles.wishList}>
                          <WishListTab
                            name={wishList.name}
                            count={wishList.wishes.length}
                            isActive={currentWishListId === wishList.wishListId}
                            onPress={() => setCurrentWishListId(wishList.wishListId)}
                          />
                        </View>
                      ))}
                    </ScrollView>

                    {wishListData.length || isWishesLoading ? (
                      <MasonryList
                        data={
                          isWishesLoading ? [{ wishId: 1 }, { wishId: 2 }, { wishId: 3 }, { wishId: 4 }] : wishListData
                        }
                        keyExtractor={(wish: Wish) => wish.wishId.toString()}
                        numColumns={2}
                        contentContainerStyle={[styles.list, { paddingBottom: listPaddingBottom }]}
                        renderItem={({ item, i }) => {
                          if (!isWishesLoading) {
                            const wish = item as Wish;
                            const activeBooking = wish.activeBookingId ? getMyBookingById(wish.activeBookingId) : null;
                            const showBooking = Boolean(activeBooking);
                            const booker = activeBooking
                              ? { booked: activeBooking.booked, avatar: myAvatar }
                              : undefined;
                            return (
                              <Link
                                asChild
                                href={{ pathname: '/profile/wishes', params: { wishId: wish.wishId, userId } }}
                                style={[
                                  { marginTop: [0, 1].includes(i) ? 0 : 16 },
                                  { [i % 2 === 0 ? 'marginRight' : 'marginLeft']: 8 },
                                ]}
                              >
                                <Pressable>
                                  <WishCard
                                    wish={
                                      {
                                        ...wish,
                                        image: wishes.find((item) => item.wishId === wish.wishId)?.image,
                                      } as Wish
                                    }
                                    actions={
                                      [
                                        { label: 'Сохранить к себе', onPress: () => saveWish(wish) },
                                        isFriend(+userId) ? getBookingAction(wish.wishId) : null,
                                        { label: 'Поделиться', onPress: () => shareWish(wish) },
                                      ].filter(Boolean) as Action[]
                                    }
                                    showBooking={showBooking}
                                    booker={booker}
                                  />
                                </Pressable>
                              </Link>
                            );
                          }
                          return (
                            <Skeleton
                              style={{
                                height: screenWidth / 2 + Math.random() * 100,
                                [i % 2 === 0 ? 'marginRight' : 'marginLeft']: 8,
                                marginTop: [0, 1].includes(i) ? 0 : 16,
                                borderRadius: 25,
                              }}
                            />
                          );
                        }}
                      />
                    ) : (
                      <View style={styles.noWishesContainer}>
                        <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                          Eщё в раздумьях, что загадать
                        </ThemedText>
                      </View>
                    )}
                  </>
                ))}

              {currentVisibleTabIndex === 1 && (
                <View style={[styles.list, styles.piggyBankList, { paddingBottom: listPaddingBottom }]}>
                  {!isFriend(profile.userId) && profile?.isPrivate ? (
                    <View style={styles.noWishesContainer}>
                      <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                        У пользователя закрытый аккаунт
                      </ThemedText>
                    </View>
                  ) : piggyBanks.length ? (
                    piggyBanks.map((piggyBank) => (
                      <Link
                        asChild
                        key={piggyBank.wishId}
                        style={styles.piggyBank}
                        href={{ pathname: '/profile/piggyBanks', params: { piggyBankId: piggyBank.wishId, userId } }}
                      >
                        <Pressable>
                          <View style={styles.piggyBankBody}>
                            <View style={styles.piggyBankInfo}>
                              <ThemedText type="h3">{piggyBank.name}</ThemedText>
                              <View style={styles.piggyBankPrice}>
                                <ThemedText type="bodyBase" style={styles.piggyBankPriceLabel}>
                                  Стоимость:
                                </ThemedText>
                                <ThemedText type="bodyLargeMedium">
                                  {piggyBank.price} {piggyBank.currency?.transcription}
                                </ThemedText>
                              </View>
                            </View>
                            <View style={styles.piggyBankCard}>
                              <WishCard
                                imageAspectRatio={1}
                                wish={piggyBank}
                                actions={[{ label: 'Поделиться', onPress: () => sharePiggyBank(piggyBank) }]}
                                showInfo={false}
                              />
                            </View>
                          </View>
                          <ProgressBar
                            currentAmount={piggyBank.deposit}
                            targetAmount={piggyBank.price}
                            currency={piggyBank.currency}
                          />
                        </Pressable>
                      </Link>
                    ))
                  ) : (
                    <View style={styles.noWishesContainer}>
                      <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                        Пока копит не деньги, а терпение
                      </ThemedText>
                    </View>
                  )}
                </View>
              )}
            </ThemedView>
          )}
        </ParallaxScrollView>
      </View>
    </>
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
    marginRight: 8,
  },
  list: {
    paddingHorizontal: 16,
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
  noWishesContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  noWishesMessage: {
    textAlign: 'center',
    color: Colors.grey,
  },
});
