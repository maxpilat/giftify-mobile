import { ThemedText } from '@/components/ThemedText';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState, Fragment } from 'react';
import { useAnimatedStyle, withTiming, useSharedValue, runOnJS } from 'react-native-reanimated';
import { PlatformButton } from '@/components/PlatformButton';
import { Colors } from '@/constants/themes';
import { Icon } from '@/components/Icon';
import { router, useLocalSearchParams } from 'expo-router';
import { Friend, Profile } from '@/models';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStore';
import { ThemedView } from '@/components/ThemedView';
import { FriendCard } from '@/components/FriendCard';
import { GestureHandlerRootView, RefreshControl, ScrollView } from 'react-native-gesture-handler';

type SearchParams = {
  userId?: string;
};

export default function FriendsScreen() {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();
  const { userId = authUser.id } = useLocalSearchParams<SearchParams>();
  const { friendRequests, fetchFriends: fetchMyFriends, fetchFriendRequests, isFriend, isSender } = useStore();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [currentVisibleTabIndex, setCurrentVisibleTabIndex] = useState(0);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingFriends, setPendingFriends] = useState<Friend[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isCurrentUser = +userId === authUser.id;
  const visibleFriends = currentVisibleTabIndex === 0 ? friends : pendingFriends;

  const contentOpacity = useSharedValue(1);
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  useEffect(() => {
    fetchData();
  }, [userId]);

  useEffect(() => {
    contentOpacity.value = withTiming(0, { duration: 100 }, (finished) => {
      if (finished) {
        runOnJS(setCurrentVisibleTabIndex)(currentTabIndex);
      }
    });
  }, [currentTabIndex]);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 300 });
  }, [currentVisibleTabIndex]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData().finally(() => setIsRefreshing(false));
  };

  const fetchData = async () => {
    const promises: Promise<any>[] = [fetchFriends()];
    if (isCurrentUser) promises.push(fetchFriendRequests());
    await Promise.all(promises);
  };

  useEffect(() => {
    fetchFriends();
    if (isCurrentUser) {
      fetchPendingFriends().finally(() => setIsRefreshing(false));
    }
  }, [friendRequests]);

  const fetchFriends = async () => {
    const friends = isCurrentUser
      ? await fetchMyFriends()
      : await apiFetchData<Friend[]>({ endpoint: API.friends.getFriends(+userId), token: authUser.token });
    setFriends(friends);

    friends.forEach(async (friend) => {
      const avatar = await apiFetchImage({ endpoint: API.profile.getAvatar(friend.friendId), token: authUser.token });
      setFriends((prev) =>
        prev.map((prevFriend) => (prevFriend.friendId === friend.friendId ? { ...prevFriend, avatar } : prevFriend))
      );
    });
  };

  const fetchPendingFriends = async () => {
    const pendingFriendsPromises = friendRequests
      .map((request) => (request.userOneId === authUser.id ? request.userTwoId : request.userOneId))
      .filter((friendId) => !isFriend(friendId) && isSender(friendId))
      .map(async (friendId) => {
        const profile = await apiFetchData<Profile>({
          endpoint: API.profile.getProfile(friendId),
          token: authUser.token,
        });

        return { ...profile, friendId: profile.userId, newWishesCount: 0 } as Friend;
      });

    const pendingFriends = await Promise.all(pendingFriendsPromises);
    setPendingFriends(pendingFriends);

    pendingFriends.forEach(async (friend) => {
      const avatar = await apiFetchImage({
        endpoint: API.profile.getAvatar(friend.friendId),
        token: authUser.token,
      });

      setPendingFriends((prevFriends) =>
        prevFriends.map((prevFriend) =>
          prevFriend.friendId === friend.friendId ? { ...prevFriend, avatar } : prevFriend
        )
      );
    });
  };

  return (
    <GestureHandlerRootView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.body}>
          {isCurrentUser && (
            <View style={styles.controls}>
              <View style={styles.tabs}>
                {['Список', 'Заявки'].map((tab, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.tab, currentTabIndex === index && { backgroundColor: theme.secondary }]}
                    onPress={() => setCurrentTabIndex(index)}
                  >
                    <ThemedText
                      type="bodyLargeMedium"
                      parentBackgroundColor={currentTabIndex === index ? theme.secondary : theme.background}
                    >
                      {tab}
                    </ThemedText>
                    {index === 1 && pendingFriends.length > 0 && (
                      <View
                        style={[
                          styles.pendingFriendsIndicator,
                          { backgroundColor: currentTabIndex === index ? theme.button : theme.secondary },
                        ]}
                      >
                        <ThemedText type="labelLarge" parentBackgroundColor={theme.secondary}>
                          {pendingFriends.length}
                        </ThemedText>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <PlatformButton hapticFeedback="none" onPress={() => router.push('/friends/searchFriends')}>
                <ThemedText type="bodyLargeMedium" parentBackgroundColor={theme.primary}>
                  Найти друзей
                </ThemedText>
                <Icon name="search" parentBackgroundColor={theme.primary} />
              </PlatformButton>
            </View>
          )}

          <ThemedView style={[styles.friends, contentAnimatedStyle]}>
            {!visibleFriends.length ? (
              <ThemedText type="bodyLarge" style={styles.noFriendsMessage}>
                Пока пусто...
              </ThemedText>
            ) : (
              visibleFriends.map((friend, index) => (
                <Fragment key={friend.friendId}>
                  <FriendCard
                    friend={friend}
                    link={{ pathname: '/profile/[userId]', params: { userId: friend.friendId } }}
                  />
                  {index !== friends.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: theme.tabBarBorder }]} />
                  )}
                </Fragment>
              ))
            )}
          </ThemedView>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  body: {
    marginTop: 16,
    gap: 16,
  },
  controls: {
    gap: 16,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 40,
    padding: 5,
  },
  tab: {
    flex: 1,
    padding: 8,
    borderRadius: 40,
    alignItems: 'center',
  },
  pendingFriendsIndicator: {
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  friends: {},
  divider: {
    height: 1,
    marginLeft: 80,
  },
  noFriendsMessage: {
    marginTop: 10,
    textAlign: 'center',
    color: Colors.grey,
  },
});
