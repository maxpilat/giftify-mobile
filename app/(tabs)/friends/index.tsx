import { ThemedText } from '@/components/ThemedText';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';
import { useAnimatedStyle, withTiming, useSharedValue, runOnJS } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlatformButton } from '@/components/PlatformButton';
import { Colors } from '@/constants/themes';
import { Icon } from '@/components/Icon';
import { router, useLocalSearchParams } from 'expo-router';
import { Friend } from '@/models';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { FriendCard } from '@/components/FriendCard';

type SearchParams = {
  userId?: string;
};

export default function FriendsScreen() {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();
  const { userId = authUser.userId } = useLocalSearchParams<SearchParams>();
  const { friendRequests } = useProfile();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [currentVisibleTabIndex, setCurrentVisibleTabIndex] = useState(0);
  const [friends, setFriends] = useState<Friend[]>([]);

  const contentOpacity = useSharedValue(1);
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

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

  const fetchData = async () => {
    const friends = await apiFetchData<Friend[]>({ endpoint: API.friends.getFriends(+userId), token: authUser.token });
    setFriends(friends);

    friends.forEach(async (friend) => {
      const avatar = await apiFetchImage({ endpoint: API.profile.getAvatar(friend.friendId), token: authUser.token });
      setFriends((prev) =>
        prev.map((prevFriend) => (prevFriend.friendId === friend.friendId ? { ...prevFriend, avatar } : prevFriend))
      );
    });
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const isSender = (friendId: number) => {
    return friendRequests.find(
      (request) =>
        (request.userOneId === friendId && request.isUserOneAccept && !request.isUserTwoAccept) ||
        (request.userTwoId === friendId && request.isUserTwoAccept && !request.isUserOneAccept)
    )
      ? true
      : false;
  };

  const visibleFriends = currentVisibleTabIndex === 0 ? friends : friends.filter((friend) => isSender(friend.friendId));

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <ThemedText type="h1">Друзья</ThemedText>
        <View style={styles.tabs}>
          {['Список', 'Заявки'].map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab, currentTabIndex === index && { backgroundColor: theme.secondary }]}
              onPress={() => setCurrentTabIndex(index)}
            >
              <ThemedText
                type="bodyLargeMedium"
                style={{ color: currentTabIndex === index ? theme.background : theme.text }}
              >
                {tab}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <PlatformButton
          style={styles.button}
          hapticFeedback="none"
          onPress={() => router.push('/friends/searchFriends')}
        >
          <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
            Найти друзей
          </ThemedText>
          <Icon name="search" color={Colors.white} />
        </PlatformButton>
        <ThemedView style={[styles.friends, contentAnimatedStyle]}>
          {!visibleFriends.length ? (
            <ThemedText type="bodyLarge" style={styles.noFriendsMessage}>
              Пока пусто...
            </ThemedText>
          ) : (
            visibleFriends.map((friend, index) => (
              <React.Fragment key={friend.friendId}>
                <FriendCard friend={friend} />
                {index !== friends.length - 1 && <View style={styles.divider}></View>}
              </React.Fragment>
            ))
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    height: '100%',
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 40,
    padding: 5,
    marginTop: 24,
    width: '100%',
  },
  tab: {
    flex: 1,
    padding: 8,
    borderRadius: 40,
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
  },
  buttonText: {
    color: Colors.white,
  },
  friends: {
    marginTop: 24,
  },
  divider: {
    backgroundColor: Colors.light,
    height: 1,
    marginLeft: 80,
  },
  noFriendsMessage: {
    textAlign: 'center',
    color: Colors.grey,
  },
});
