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
import { Booking, Friend, Profile, Wish, WishList } from '@/models';
import { API } from '@/constants/api';
import { Colors } from '@/constants/themes';
import { ProgressBar } from '@/components/ProgressBar';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user: authUser, token } = useAuth();
  const {
    avatar: myAvatar,
    bookings: myBookings,
    wishes: myWishes,
    wishLists: myWishLists,
    piggyBanks: myPiggyBanks,
    isLoaded: isProfileLoaded,
    fetchAvatar: fetchMyAvatar,
    fetchBookings: fetchMyBookings,
    fetchWishes: fetchMyWishes,
    fetchWishLists: fetchMyWishLists,
    fetchPiggyBanks: fetchMyPiggyBanks,
    setIsLoaded: setIsProfileLoaded,
  } = useProfile();
  const { userId = authUser.userId } = useLocalSearchParams();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [currentVisibleTabIndex, setCurrentVisibleTabIndex] = useState(0);
  const [currentWishListId, setCurrentWishListId] = useState<number | null>(null);

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishLists, setWishLists] = useState<WishList[]>([]);
  const [piggyBanks, setPiggyBanks] = useState<Wish[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile>();
  const [avatar, setAvatar] = useState<string>();
  const [background, setBackground] = useState<string>();
  const [friends, setFriends] = useState<Friend[]>([]);

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
    if (+userId === authUser.userId && isProfileLoaded) {
      setAvatar(myAvatar);
      setBookings(myBookings);
      setWishes(myWishes);
      setWishLists(myWishLists);
      setPiggyBanks(myPiggyBanks);
    }
  }, [myAvatar, myBookings, myWishes, myWishLists, myPiggyBanks]);

  const fetchData = () => {
    if (+userId === authUser.userId && !isProfileLoaded) {
      fetchMyAvatar().then(setAvatar);

      fetchMyBookings().then((data) => {
        setBookings(data);
        data.forEach(async (booking) => {
          const image: string = await apiFetchImage({
            endpoint: API.wishes.getImage(booking.wish.wishId),
            token,
          });
          setBookings((prev) =>
            prev.map((prevBooking) =>
              prevBooking.wish.wishId === booking.wish.wishId ? { ...prevBooking, image } : prevBooking
            )
          );
        });
      });

      fetchMyWishes().then((data) => {
        setWishes(data);
        data.forEach(async (wish) => {
          const image: string = await apiFetchImage({
            endpoint: API.wishes.getImage(wish.wishId),
            token,
          });
          setWishes((prev) =>
            prev.map((prevWish) => (prevWish.wishId === wish.wishId ? { ...prevWish, image } : prevWish))
          );
        });
      });

      fetchMyWishLists().then(setWishLists);

      fetchMyPiggyBanks().then((data) => {
        setPiggyBanks(data);
        data.forEach(async (piggyBank) => {
          const image: string = await apiFetchImage({
            endpoint: API.wishes.getImage(piggyBank.wishId),
            token,
          });
          setPiggyBanks((prev) =>
            prev.map((prevPiggyBank) =>
              prevPiggyBank.wishId === piggyBank.wishId ? { ...prevPiggyBank, image } : prevPiggyBank
            )
          );
        });
      });

      Promise.all([fetchMyAvatar, fetchMyBookings, fetchMyWishes, fetchMyWishLists, fetchMyPiggyBanks]).then(() => {
        setIsProfileLoaded(true);
      });
    } else {
      apiFetchImage({
        endpoint: API.profile.getAvatar(+userId),
        token,
      }).then(setAvatar);

      apiFetchData<Booking[]>({ endpoint: API.profile.getBookings(+userId), token }).then((data) => {
        setBookings(data);
        data.forEach(async (booking) => {
          const image: string = await apiFetchImage({
            endpoint: API.wishes.getImage(booking.wish.wishId),
            token,
          });
          setBookings((prev) =>
            prev.map((prevBooking) =>
              prevBooking.wish.wishId === booking.wish.wishId ? { ...prevBooking, image } : prevBooking
            )
          );
        });
      });

      apiFetchData<Wish[]>({ endpoint: API.profile.getWishes(+userId), token }).then((data) => {
        setWishes(data);
        data.forEach(async (wish) => {
          const image: string = await apiFetchImage({
            endpoint: API.wishes.getImage(wish.wishId),
            token,
          });
          setWishes((prev) =>
            prev.map((prevWish) => (prevWish.wishId === wish.wishId ? { ...prevWish, image } : prevWish))
          );
        });
      });

      apiFetchData<WishList[]>({ endpoint: API.profile.getWishLists(+userId), token }).then(setWishLists);

      apiFetchData<Wish[]>({ endpoint: API.profile.getPiggyBanks(+userId), token }).then((data) => {
        setPiggyBanks(data);
        data.forEach(async (piggyBank) => {
          const image: string = await apiFetchImage({
            endpoint: API.wishes.getImage(piggyBank.wishId),
            token,
          });
          setPiggyBanks((prev) =>
            prev.map((prevPiggyBank) =>
              prevPiggyBank.wishId === piggyBank.wishId ? { ...prevPiggyBank, image } : prevPiggyBank
            )
          );
        });
      });
    }

    apiFetchData<Profile>({ endpoint: API.profile.getProfile(+userId), token }).then(setProfile);
    apiFetchImage({ endpoint: API.profile.getBackground(+userId), token }).then(setBackground);
    apiFetchData<Friend[]>({ endpoint: API.friends.getFriends(+userId), token }).then((data) => {
      setFriends(data);
      data.forEach(async (friend) => {
        const avatar: string = await apiFetchImage({
          endpoint: API.profile.getAvatar(friend.friendId),
          token,
        });
        setFriends((prev) =>
          prev.map((prevFriend) => (prevFriend.friendId === friend.friendId ? { ...prevFriend, avatar } : prevFriend))
        );
      });
    });
  };

  useEffect(() => {
    fetchData();
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
      router.push('./wishModal');
    } else if (currentTabIndex === 1) {
      router.push('./piggyBankModal');
    }
  };

  const wishListData = currentWishListId
    ? wishLists.find((wishList) => wishList.wishListId === currentWishListId)!.wishes
    : wishes;

  return (
    <View style={styles.wrapper}>
      <ParallaxScrollView
        header={
          <ProfileHeader
            avatar={avatar}
            background={background}
            fullname={`${profile?.name} ${profile?.surname}`}
            username={profile?.username}
            friendsAvatars={friends.slice(0, 3).map((friend) => friend.avatar)}
            friendsCount={friends.length}
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
                <View style={styles.wishList}>
                  <WishListTab
                    name="Мои желания"
                    count={wishes.length}
                    isActive={!currentWishListId}
                    onPress={() => setCurrentWishListId(null)}
                  />
                </View>
                <View style={[styles.wishList, styles.addWishListButton]}>
                  <Link asChild href={'./wishListModal'}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.addWishListButtonTouchable}>
                      <Icon name="plus" />
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
                        href={{ pathname: './wishes', params: { wishId: wish.wishId.toString() } }}
                        style={[
                          styles.masonryItem,
                          { marginRight: i % 2 === 0 ? 8 : 0, marginLeft: i % 2 !== 0 ? 8 : 0 },
                        ]}
                      >
                        <Pressable>
                          <WishCard
                            image={{ uri: wishes.find((item) => item.wishId === wish.wishId)?.image }}
                            name={wish.name}
                            price={wish.price}
                            currency={wish.currency}
                          />
                        </Pressable>
                      </Link>
                    );
                  }}
                />
              ) : userId === authUser.userId ? (
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
                            image={{
                              uri: piggyBank.image,
                              width: 2,
                              height: 1,
                            }}
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
              ) : userId === authUser.userId ? (
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

          {userId === authUser.userId &&
            currentVisibleTabIndex === 2 &&
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
                      style={[
                        styles.masonryItem,
                        { marginRight: i % 2 === 0 ? 8 : 0, marginLeft: i % 2 !== 0 ? 8 : 0 },
                      ]}
                    >
                      <Pressable>
                        <WishCard
                          image={{ uri: wish.image }}
                          name={wish.name}
                          price={wish.price}
                          currency={wish.currency}
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
  noWishesContainer: {
    paddingHorizontal: 16,
    marginTop: 40,
  },
  noWishesMessage: {
    textAlign: 'center',
    color: Colors.grey,
  },
});
