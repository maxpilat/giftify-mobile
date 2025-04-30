import { ThemedText } from '@/components/ThemedText';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';
import { useAnimatedStyle, withTiming, Easing, useSharedValue, runOnJS } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlatformButton } from '@/components/PlatformButton';
import { Colors } from '@/constants/themes';
import { Icon } from '@/components/Icon';
import { router, useLocalSearchParams } from 'expo-router';
import { Friend, FriendRequest } from '@/models';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import React from 'react';
import { formatDays, formatNewWishes } from '@/utils/formatWord';
import { getDaysUntilBirthday } from '@/utils/getDaysUntilBirthday';
import { ThemedView } from '@/components/ThemedView';
import { FriendCard } from '@/components/FriendCard';

const FRIENDS: Friend[] = [
  {
    friendId: 1,
    name: 'Алексей',
    surname: 'Иванов',
    username: 'alex_ivan',
    birthDate: '14.05.1992',
    newWishesCount: 3,
  },
  {
    friendId: 2,
    name: 'Мария',
    surname: 'Смирнова',
    username: 'masha_smir',
    birthDate: '30.11.1995',
    newWishesCount: 5,
  },
  {
    friendId: 3,
    name: 'Дмитрий',
    surname: 'Петров',
    username: 'dmitriy_pet',
    birthDate: '22.07.1990',
    newWishesCount: 1,
  },
  {
    friendId: 4,
    name: 'Елена',
    surname: 'Кузнецова',
    username: 'elena_kuz',
    birthDate: '28.04.1998',
    newWishesCount: 4,
  },
  {
    friendId: 5,
    name: 'Игорь',
    surname: 'Соколов',
    username: 'igor_sokol',
    birthDate: '05.09.1988',
    newWishesCount: 2,
  },
];

export default function FriendsScreen() {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();
  const { userId = authUser.userId } = useLocalSearchParams<{ userId: string }>();
  const { friendRequests } = useProfile();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [currentVisibleTabIndex, setCurrentVisibleTabIndex] = useState(0);
  const [friends, setFriends] = useState<Friend[]>(FRIENDS);

  const getTabTextAnimatedStyle = (index: number) =>
    useAnimatedStyle(() => ({
      color: withTiming(currentTabIndex === index ? theme.background : theme.text, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      }),
    }));

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
    // const friends = await apiFetchData<Friend[]>({ endpoint: API.friends.getFriends(+userId), token: authUser.token });
    // friends.forEach(async (friend) => {
    //   const avatar = await apiFetchImage({ endpoint: API.profile.getAvatar(friend.friendId), token: authUser.token });
    //   setFriends((prev) =>
    //     prev.map((prevFriend) => (prevFriend.friendId === friend.friendId ? { ...prevFriend, avatar } : prevFriend))
    //   );
    // });

    setFriends(friends);
  };

  useEffect(() => {
    fetchData();
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
              activeOpacity={0.7}
              onPress={() => setCurrentTabIndex(index)}
            >
              <ThemedText type="bodyLargeMedium" style={[getTabTextAnimatedStyle(index)]}>
                {tab}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <PlatformButton
          style={styles.button}
          hapticFeedback="none"
          onPress={() => router.push('./friends/searchFriends')}
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
