import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { ParallaxScrollView } from '@/components/ParallaxScrollView';
import { ProfileHeader } from '@/components/ProfileHeader';
import MasonryList from '@react-native-seoul/masonry-list';
import { WishCard } from '@/components/WishCard';
import { WishListTab } from '@/components/WishListTab';
import { Icon } from '@/components/Icon';
import { ThemedView } from '@/components/ThemedView';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { Booking, Friend, Profile, ProfileBackground, ApiProfileBackground, Wish, WishList } from '@/models';
import { API } from '@/constants/api';
import { Colors } from '@/constants/themes';
import { ProgressBar } from '@/components/ProgressBar';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useStore';
import { Action } from '@/components/ActionsButton';
import { base64ToBinaryArray, binaryArrayToBase64 } from '@/utils/convertImage';
import { getDefaultBackground } from '@/utils/profileBackground';

type SearchParams = {
  userId?: string;
};

export default function ProfileScreen() {
  const { theme, themeType, systemThemeType } = useTheme();
  const { user: authUser } = useAuth();
  const {
    avatar: myAvatar,
    background: myBackground,
    bookings: myBookings,
    wishes: myWishes,
    wishLists: myWishLists,
    piggyBanks: myPiggyBanks,
    isLoaded: isProfileLoaded,
    fetchAvatar: fetchMyAvatar,
    fetchBackground: fetchMyBackground,
    fetchBookings: fetchMyBookings,
    fetchWishes: fetchMyWishes,
    fetchWishLists: fetchMyWishLists,
    fetchPiggyBanks: fetchMyPiggyBanks,
    setIsLoaded: setIsProfileLoaded,
    isFriend,
  } = useProfile();
  const { userId = authUser.id } = useLocalSearchParams<SearchParams>();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [currentVisibleTabIndex, setCurrentVisibleTabIndex] = useState(0);
  const [currentWishListId, setCurrentWishListId] = useState<number | null>(null);

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishLists, setWishLists] = useState<WishList[]>([]);
  const [piggyBanks, setPiggyBanks] = useState<Wish[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile>();
  const [avatar, setAvatar] = useState<string>();
  const [background, setBackground] = useState<ProfileBackground>();
  const [friends, setFriends] = useState<Friend[]>([]);

  const scrollRef = useRef<ScrollView>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData().then(() => setIsRefreshing(false));
  };

  const contentOpacity = useSharedValue(1);
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const addItemButtonOpacity = useSharedValue(1);
  const addItemButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: addItemButtonOpacity.value,
    transform: [{ scale: addItemButtonOpacity.value }],
  }));

  const isCurrentUser = +userId === authUser.id;

  useEffect(() => {
    if (isCurrentUser && isProfileLoaded) {
      setAvatar(myAvatar);
      setBackground(myBackground);
      setBookings(myBookings);
      setWishes(myWishes);
      setWishLists(myWishLists);
      setPiggyBanks(myPiggyBanks);
    }
  }, [myAvatar, myBackground, myBookings, myWishes, myWishLists, myPiggyBanks]);

  const fetchData = async () => {
    const promises: Promise<any>[] = [];

    if (isCurrentUser) {
      fetchMyAvatar();
      fetchMyBackground();
      const bookingsPromise = fetchMyBookings();
      const wishesPromise = fetchMyWishes();
      const wishListsPromise = fetchMyWishLists();
      const piggyBanksPromise = fetchMyPiggyBanks();

      promises.push(bookingsPromise, wishesPromise, wishListsPromise, piggyBanksPromise);
    } else {
      apiFetchImage({
        endpoint: API.profile.getAvatar(+userId),
        token: authUser.token,
      }).then(setAvatar);

      apiFetchData<ApiProfileBackground>({
        endpoint: API.profile.getBackground(+userId),
        token: authUser.token,
      }).then((serverBackground) => {
        if (!serverBackground.backgroundImage && !serverBackground.backgroundColor) {
          setBackground(getDefaultBackground(themeType === 'system' ? systemThemeType : themeType));
        } else {
          const backgroundUri = serverBackground.backgroundImage
            ? binaryArrayToBase64(serverBackground.backgroundImage)
            : undefined;
          const background: ProfileBackground = { ...serverBackground, backgroundUri };
          setBackground(background);
        }
      });

      const bookingsPromise = apiFetchData<Booking[]>({
        endpoint: API.profile.getBookings(+userId),
        token: authUser.token,
      }).then(async (data) => {
        setBookings(data);

        const imagesMap = new Map(
          await Promise.all(
            data.map(async (booking) => {
              const image = await apiFetchImage({
                endpoint: API.wishes.getImage(booking.wish.wishId),
                token: authUser.token,
              });
              return [booking.wish.wishId, image] as const;
            })
          )
        );

        const updatedBookings = data.map((booking) => ({
          ...booking,
          wish: {
            ...booking.wish,
            image: imagesMap.get(booking.wish.wishId),
          },
        }));

        setBookings(updatedBookings);
      });

      const wishesPromise = apiFetchData<Wish[]>({
        endpoint: API.profile.getWishes(+userId),
        token: authUser.token,
      }).then(async (data) => {
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
      });

      const wishListsPromise = apiFetchData<WishList[]>({
        endpoint: API.profile.getWishLists(+userId),
        token: authUser.token,
      }).then(setWishLists);

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

      promises.push(bookingsPromise, wishesPromise, wishListsPromise, piggyBanksPromise);
    }

    Promise.all(promises).then(() => setIsProfileLoaded(true));

    const profilePromise = apiFetchData<Profile>({
      endpoint: API.profile.getProfile(+userId),
      token: authUser.token,
    }).then(setProfile);

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

    promises.push(profilePromise, friendsPromise);
    await Promise.all(promises);
  };

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
    const opacity = currentVisibleTabIndex === 2 ? 0 : 1;
    addItemButtonOpacity.value = withTiming(opacity, { duration: 300 });
  }, [currentVisibleTabIndex]);

  const addItem = () => {
    if (currentTabIndex === 0) {
      router.push({ pathname: '/profile/wishModal' });
    } else if (currentTabIndex === 1) {
      router.push({ pathname: '/profile/piggyBankModal' });
    }
  };

  const wishListData = currentWishListId
    ? wishLists.find((wishList) => wishList.wishListId === currentWishListId)!.wishes
    : wishes;

  const shareWishList = () => {
    console.log('Поделиться вишлистом');
  };

  const editWishList = (wishListId: number) => {
    router.push({ pathname: '/profile/wishListModal', params: { wishListId } });
  };

  const deleteWishList = (wishListId: number) => {
    Alert.alert('Подтвердите', 'Вы уверены, что хотите удалить список?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить список',
        style: 'destructive',
        onPress: () => {
          apiFetchData({ endpoint: API.wishLists.delete(wishListId), method: 'DELETE', token: authUser.token })
            .then(fetchMyWishLists)
            .then(() => {
              setCurrentWishListId(null);
              scrollRef.current?.scrollTo({ x: 0, animated: true });
            });
        },
      },
    ]);
  };

  const shareWish = () => {
    console.log('Поделиться желанием');
  };

  const editWish = (wishId: number) => {
    router.push({ pathname: '/profile/wishModal', params: { wishId } });
  };

  const deleteWish = (wishId: number) => {
    Alert.alert('Подтвердите', 'Вы уверены, что хотите удалить желание?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить желание',
        style: 'destructive',
        onPress: () => {
          apiFetchData({ endpoint: API.wishes.delete(wishId), method: 'DELETE', token: authUser.token }).then(() => {
            fetchMyWishes();
            fetchMyWishLists();
          });
        },
      },
    ]);
  };

  const getBookingAction = (wishId: number): Action => {
    const booking = myBookings.find((item) => item.wish.wishId === wishId);

    return {
      label: booking ? 'Снять бронь' : 'Забронировать',
      onPress: () =>
        apiFetchData({
          endpoint: booking ? API.booking.cancel(booking.bookingId) : API.booking.create,
          method: booking ? 'DELETE' : 'POST',
          body: booking ? undefined : { wishId, bookerId: authUser.id },
          token: authUser.token,
        }).then(fetchMyBookings),
    };
  };

  const sharePiggyBank = () => {
    console.log('Поделиться копилкой');
  };

  const editPiggyBank = (piggyBankId: number) => {
    router.push({ pathname: '/profile/piggyBankModal', params: { piggyBankId } });
  };

  const deletePiggyBank = (piggyBankId: number) => {
    apiFetchData({ endpoint: API.wishes.delete(piggyBankId), method: 'DELETE', token: authUser.token }).then(
      fetchMyPiggyBanks
    );
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
      }).then(fetchMyWishes);
    }
  };
  
  const getBooking = (bookingId: number) => {
    return myBookings.find(booking => booking.bookingId === bookingId);
  }

  return (
    <View style={styles.wrapper}>
      <ParallaxScrollView
        header={
          <ProfileHeader
            profile={profile}
            avatar={avatar}
            background={background}
            friendsAvatars={friends.slice(0, 3).map((friend) => friend.avatar)}
            friendsCount={friends.length}
            tabs={['Желания', 'Копилки', isCurrentUser ? 'Я дарю' : isFriend(+userId) ? 'Идеи' : ''].filter(Boolean)}
            onTabChange={setCurrentTabIndex}
          />
        }
        translateYFactor={[-0.5, 0, 0]}
        scale={[1, 1, 1]}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <ThemedView style={[styles.content, contentAnimatedStyle]}>
          {currentVisibleTabIndex === 0 && (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                ref={scrollRef}
                contentContainerStyle={styles.categories}
              >
                <View style={styles.wishList}>
                  <WishListTab
                    name={`${isCurrentUser ? 'Мои' : 'Все'} желания`}
                    count={wishes.length}
                    isActive={!currentWishListId}
                    onPress={() => setCurrentWishListId(null)}
                    actions={isCurrentUser ? [{ label: 'Поделиться', onPress: shareWishList }] : []}
                  />
                </View>
                {isCurrentUser && (
                  <View style={[styles.wishList, styles.addWishListButton, { backgroundColor: theme.button }]}>
                    <Link asChild href={'./wishListModal'}>
                      <TouchableOpacity activeOpacity={0.7} style={styles.addWishListButtonTouchable}>
                        <Icon name="plus" />
                      </TouchableOpacity>
                    </Link>
                  </View>
                )}

                {wishLists.map((wishList) => (
                  <View key={wishList.wishListId} style={styles.wishList}>
                    <WishListTab
                      name={wishList.name}
                      count={wishList.wishes.length}
                      isActive={currentWishListId === wishList.wishListId}
                      onPress={() => setCurrentWishListId(wishList.wishListId)}
                      actions={
                        isCurrentUser
                          ? [
                              { label: 'Редактировать', onPress: () => editWishList(wishList.wishListId) },
                              { label: 'Поделиться', onPress: shareWishList },
                              { label: 'Удалить', onPress: () => deleteWishList(wishList.wishListId) },
                            ]
                          : []
                      }
                    />
                  </View>
                ))}
              </ScrollView>

              {wishListData.length ? (
                <MasonryList
                  data={wishListData}
                  keyExtractor={(wish: Wish) => wish.wishId.toString()}
                  numColumns={2}
                  contentContainerStyle={styles.list}
                  renderItem={({ item, i }) => {
                    const wish = item as Wish;
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
                            wish={{ ...wish, image: wishes.find((item) => item.wishId === wish.wishId)?.image } as Wish}
                            actions={
                              isCurrentUser
                                ? [
                                    { label: 'Редактировать', onPress: () => editWish(wish.wishId) },
                                    { label: 'Поделиться', onPress: shareWish },
                                    { label: 'Удалить', onPress: () => deleteWish(wish.wishId) },
                                  ]
                                : [
                                    { label: 'Сохранить к себе', onPress: () => saveWish(wish) },
                                    isFriend(+userId) ? getBookingAction(wish.wishId) : null,
                                    { label: 'Поделиться', onPress: shareWish },
                                  ].filter((action) => !!action)
                            }
                            booking={!isCurrentUser && getBooking(wish.activeBookingId) wish.activeBookingId ===  ? {avatar: } : undefined}
                          />
                        </Pressable>
                      </Link>
                    );
                  }}
                />
              ) : isCurrentUser ? (
                <View style={styles.noWishesContainer}>
                  <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                    Пока пусто...
                  </ThemedText>
                  <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                    Может, это значит, что пора мечтать смелее?
                  </ThemedText>
                </View>
              ) : (
                <View style={styles.noWishesContainer}>
                  <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                    Eщё в раздумьях, что загадать
                  </ThemedText>
                </View>
              )}
            </>
          )}

          {currentVisibleTabIndex === 1 && (
            <View style={[styles.list, styles.piggyBankList]}>
              {piggyBanks.length ? (
                piggyBanks.map((piggyBank) => (
                  <Link
                    asChild
                    key={piggyBank.wishId}
                    style={styles.piggyBank}
                    href={{ pathname: './piggyBanks', params: { wishId: piggyBank.wishId.toString() } }}
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
                              {piggyBank.price} {piggyBank.currency?.symbol}
                            </ThemedText>
                          </View>
                        </View>
                        <View style={styles.piggyBankCard}>
                          <WishCard
                            imageAspectRatio={1}
                            wish={piggyBank}
                            actions={
                              isCurrentUser
                                ? [
                                    { label: 'Редактировать', onPress: () => editPiggyBank(piggyBank.wishId) },
                                    { label: 'Поделиться', onPress: sharePiggyBank },
                                    { label: 'Удалить', onPress: () => deletePiggyBank(piggyBank.wishId) },
                                  ]
                                : [{ label: 'Поделиться', onPress: sharePiggyBank }]
                            }
                          />
                        </View>
                      </View>
                      <ProgressBar
                        currentAmount={piggyBank.deposit!}
                        targetAmount={piggyBank.price!}
                        currency={piggyBank.currency}
                      />
                    </Pressable>
                  </Link>
                ))
              ) : isCurrentUser ? (
                <View style={styles.noWishesContainer}>
                  <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                    Здесь пока только эхо...
                  </ThemedText>
                  <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                    Может стоит сделать первый шаг к большим целям?
                  </ThemedText>
                </View>
              ) : (
                <View style={styles.noWishesContainer}>
                  <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                    Пока копит не деньги, а терпение
                  </ThemedText>
                </View>
              )}
            </View>
          )}

          {currentVisibleTabIndex === 2 &&
            (bookings.length ? (
              <MasonryList
                data={bookings}
                keyExtractor={(booking: Booking) => booking.bookingId.toString()}
                numColumns={2}
                contentContainerStyle={styles.list}
                renderItem={({ item, i }) => {
                  const wish = (item as Booking).wish;
                  return (
                    <Link
                      asChild
                      href={{ pathname: './wishes', params: { wishId: wish.wishId.toString() } }}
                      style={[{ [i % 2 === 0 ? 'marginRight' : 'marginLeft']: 8 }]}
                    >
                      <Pressable>
                        <WishCard wish={wish} />
                      </Pressable>
                    </Link>
                  );
                }}
              />
            ) : (
              <View style={styles.noWishesContainer}>
                <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                  {isCurrentUser
                    ? 'Забронируйте желание друга и оно появится здесь'
                    : 'Мы на грани вдохновения! Ждём, когда ваш друг загадает желания'}
                </ThemedText>
              </View>
            ))}
        </ThemedView>
      </ParallaxScrollView>

      {isCurrentUser && (
        <Animated.View style={[styles.addItemButton, { backgroundColor: theme.primary }, addItemButtonAnimatedStyle]}>
          <Pressable onPress={addItem} style={styles.addItemButtonPressable}>
            <Icon name="plus" />
          </Pressable>
        </Animated.View>
      )}
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
    marginRight: 8,
  },
  addWishListButton: {
    borderRadius: 20,
    overflow: 'hidden',
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
    paddingHorizontal: 16,
    paddingBottom: 130,
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
    marginTop: 40,
  },
  noWishesMessage: {
    textAlign: 'center',
    color: Colors.grey,
  },
});
