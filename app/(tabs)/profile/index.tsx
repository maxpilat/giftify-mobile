import { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
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
import { Icon } from '@/components/Icon';
import { ThemedView } from '@/components/ThemedView';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { Booking, Friend, Profile, ProfileBackground, Wish, WishList } from '@/models';
import { API } from '@/constants/api';
import { Colors } from '@/constants/themes';
import { ProgressBar } from '@/components/ProgressBar';
import { apiFetchData } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStore';
import { Action } from '@/components/ActionsButton';
import { base64ToBinaryArray } from '@/utils/convertImage';
import { getDefaultBackground } from '@/utils/profileBackground';
import * as Linking from 'expo-linking';
import { showToast } from '@/utils/showToast';
import { Skeleton } from '@/components/Skeleton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

type SearchParams = {
  wishListId?: string;
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
    friends: myFriends,
    fetchAvatar: fetchMyAvatar,
    fetchBackground: fetchMyBackground,
    fetchBookings: fetchMyBookings,
    fetchFriends: fetchMyFriends,
    fetchWishes: fetchMyWishes,
    fetchWishLists: fetchMyWishLists,
    fetchPiggyBanks: fetchMyPiggyBanks,
    setIsLoaded: setIsProfileLoaded,
    isFriend,
  } = useStore();
  const { wishListId } = useLocalSearchParams<SearchParams>();
  const { bottom } = useSafeAreaInsets();

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
  const listPaddingBottom = currentTabIndex !== 2 ? 130 : 80;
  const wishListData = wishLists.find(({ wishListId }) => wishListId === currentWishListId)?.wishes ?? wishes;

  const contentOpacity = useSharedValue(1);
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const addItemButtonOpacity = useSharedValue(1);
  const addItemButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: addItemButtonOpacity.value,
    transform: [{ scale: addItemButtonOpacity.value }],
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
    setAvatar(myAvatar);
    setBackground(myBackground);
    setWishes(myWishes);
    setWishLists(myWishLists);
    setPiggyBanks(myPiggyBanks);
    setFriends(myFriends);
  }, [myAvatar, myBackground, myWishes, myWishLists, myPiggyBanks, myFriends]);

  useEffect(() => {
    if (background?.id === 0) {
      setBackground(getDefaultBackground());
    }
  }, [themeTypeValue]);

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsHeaderVisible(event.nativeEvent.contentOffset.y > 210);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData().then(() => setIsRefreshing(false));
  };

  const fetchData = async () => {
    const promises: Promise<any>[] = [];

    fetchMyAvatar();
    fetchMyBackground();
    const bookingsPromise = fetchMyBookings();
    const wishesPromise = fetchMyWishes().then(() => setIsWishesLoading(false));
    const wishListsPromise = fetchMyWishLists().then(() => wishListId && setCurrentWishListId(+wishListId));
    const piggyBanksPromise = fetchMyPiggyBanks();
    const friendsPromise = fetchMyFriends();

    promises.push(bookingsPromise, wishesPromise, wishListsPromise, piggyBanksPromise, friendsPromise);

    const profilePromise = apiFetchData<Profile>({
      endpoint: API.profile.getProfile(authUser.id),
      token: authUser.token,
    }).then(setProfile);

    promises.push(profilePromise);
    await Promise.all(promises);
    setIsProfileLoaded(true);
  };

  const addItem = () => {
    if (currentTabIndex === 0) {
      router.push({ pathname: '/profile/wishModal' });
    } else if (currentTabIndex === 1) {
      router.push({ pathname: '/profile/piggyBankModal' });
    }
  };

  const shareWishList = () => {
    const deepLink = Linking.createURL(`/profile/${authUser.id}`, {
      queryParams: { wishListId: currentWishListId?.toString() },
    });

    Share.share({ url: deepLink });
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
              showToast('success', 'Список удалён');
            })
            .catch(() => showToast('error', 'Не удалось удалить список'));
        },
      },
    ]);
  };

  const shareWish = (wish: Wish) => {
    const deepLink = Linking.createURL('/profile/wishes', {
      queryParams: { userId: wish.wisherProfileData.userId.toString(), wishId: wish.wishId.toString() },
    });

    Share.share({ url: deepLink });
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
          apiFetchData({ endpoint: API.wishes.delete(wishId), method: 'DELETE', token: authUser.token })
            .then(() => Promise.all([fetchMyWishes(), fetchMyWishLists()]))
            .then(() => showToast('success', 'Желание удалено'))
            .catch(() => showToast('error', 'Не удалось удалить желание'));
        },
      },
    ]);
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

  const editPiggyBank = (piggyBankId: number) => {
    router.push({ pathname: '/profile/piggyBankModal', params: { piggyBankId } });
  };

  const deletePiggyBank = (piggyBankId: number) => {
    apiFetchData({ endpoint: API.wishes.delete(piggyBankId), method: 'DELETE', token: authUser.token })
      .then(fetchMyPiggyBanks)
      .then(() => showToast('success', 'Копилка удалена'))
      .catch(() => showToast('error', 'Не удалось удалить копилку'));
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
          // headerLeft: () => !isCurrentUser && <BackButton />,
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
              tabs={['Желания', 'Копилки', 'Я дарю']}
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
                        name={'Мои желания'}
                        count={wishes.length}
                        isActive={!currentWishListId}
                        onPress={() => setCurrentWishListId(null)}
                        actions={[{ label: 'Поделиться', onPress: shareWishList }]}
                      />
                    </View>

                    <View style={[styles.wishList, styles.addWishListButton, { backgroundColor: theme.button }]}>
                      <Link asChild href={'./wishListModal'}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.addWishListButtonTouchable}>
                          <Icon name="plus" parentBackgroundColor={theme.button} />
                        </TouchableOpacity>
                      </Link>
                    </View>

                    {wishLists.map((wishList) => (
                      <View key={wishList.wishListId} style={styles.wishList}>
                        <WishListTab
                          name={wishList.name}
                          count={wishList.wishes.length}
                          isActive={currentWishListId === wishList.wishListId}
                          onPress={() => setCurrentWishListId(wishList.wishListId)}
                          actions={[
                            { label: 'Редактировать', onPress: () => editWishList(wishList.wishListId) },
                            { label: 'Поделиться', onPress: shareWishList },
                            { label: 'Удалить', onPress: () => deleteWishList(wishList.wishListId) },
                          ]}
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
                          return (
                            <Link
                              asChild
                              href={{
                                pathname: '/profile/wishes',
                                params: { wishId: wish.wishId, userId: authUser.id },
                              }}
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
                                  actions={[
                                    { label: 'Редактировать', onPress: () => editWish(wish.wishId) },
                                    { label: 'Поделиться', onPress: () => shareWish(wish) },
                                    { label: 'Удалить', onPress: () => deleteWish(wish.wishId) },
                                  ]}
                                  wisher={activeBooking?.wish.wisherProfileData}
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
                        Пока пусто...
                      </ThemedText>
                      <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                        Может, это значит, что пора мечтать смелее?
                      </ThemedText>
                    </View>
                  )}
                </>
              )}

              {currentVisibleTabIndex === 1 && (
                <View style={[styles.list, styles.piggyBankList, { paddingBottom: listPaddingBottom }]}>
                  {piggyBanks.length ? (
                    piggyBanks.map((piggyBank) => (
                      <Link
                        asChild
                        key={piggyBank.wishId}
                        style={styles.piggyBank}
                        href={{
                          pathname: '/profile/piggyBanks',
                          params: { piggyBankId: piggyBank.wishId, userId: authUser.id },
                        }}
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
                                actions={[
                                  { label: 'Редактировать', onPress: () => editPiggyBank(piggyBank.wishId) },
                                  { label: 'Поделиться', onPress: () => sharePiggyBank(piggyBank) },
                                  { label: 'Удалить', onPress: () => deletePiggyBank(piggyBank.wishId) },
                                ]}
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
                        Здесь пока только эхо...
                      </ThemedText>
                      <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                        Может стоит сделать первый шаг к большим целям?
                      </ThemedText>
                    </View>
                  )}
                </View>
              )}

              {currentVisibleTabIndex === 2 &&
                (myBookings.length ? (
                  <MasonryList
                    data={myBookings}
                    keyExtractor={(booking: Booking) => booking.bookingId.toString()}
                    numColumns={2}
                    contentContainerStyle={[styles.list, { paddingBottom: listPaddingBottom }]}
                    renderItem={({ item, i }) => {
                      const wish = (item as Booking).wish;
                      return (
                        <Link
                          asChild
                          href={{
                            pathname: '/profile/wishes',
                            params: { wishId: wish.wishId, isMyBookings: 'true' },
                          }}
                          style={[{ [i % 2 === 0 ? 'marginRight' : 'marginLeft']: 8 }]}
                        >
                          <Pressable>
                            <WishCard
                              wish={wish}
                              wisher={wish.wisherProfileData}
                              actions={
                                [
                                  { label: 'Сохранить к себе', onPress: () => saveWish(wish) },
                                  isFriend(wish.wisherProfileData.userId) ? getBookingAction(wish.wishId) : null,
                                  { label: 'Поделиться', onPress: () => shareWish(wish) },
                                ].filter(Boolean) as Action[]
                              }
                            />
                          </Pressable>
                        </Link>
                      );
                    }}
                  />
                ) : (
                  <View style={styles.noWishesContainer}>
                    <ThemedText style={styles.noWishesMessage} type="bodyLarge">
                      Забронируйте желание друга и оно появится здесь
                    </ThemedText>
                  </View>
                ))}
            </ThemedView>
          )}
        </ParallaxScrollView>

        <Animated.View
          style={[
            styles.addItemButton,
            { backgroundColor: theme.primary, bottom: bottom + 60 },
            addItemButtonAnimatedStyle,
          ]}
        >
          <Pressable onPress={addItem} style={styles.addItemButtonPressable}>
            <Icon name="plus" parentBackgroundColor={theme.primary} />
          </Pressable>
        </Animated.View>
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
