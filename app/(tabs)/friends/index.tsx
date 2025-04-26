import { ThemedText } from '@/components/ThemedText';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';
import { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlatformButton } from '@/components/PlatformButton';
import { Colors } from '@/constants/themes';
import { Icon } from '@/components/Icon';
import { useLocalSearchParams } from 'expo-router';
import { Friend, FriendRequest } from '@/models';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import React from 'react';

export default function FriendsScreen() {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();
  const { userId = authUser.userId } = useLocalSearchParams<{ userId: string }>();
  const { friendRequests } = useProfile();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [friends, setFriends] = useState<Friend[]>([]);

  const getTabTextAnimatedStyle = (index: number) =>
    useAnimatedStyle(() => ({
      color: withTiming(currentTabIndex === index ? theme.background : theme.text, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      }),
    }));

  const fetchData = async () => {
    // const friends = await apiFetchData<Friend[]>({ endpoint: API.friends.getFriends(+userId), token: authUser.token });
    // friends.forEach(async (friend) => {
    //   const avatar = await apiFetchImage({ endpoint: API.profile.getAvatar(friend.friendId), token: authUser.token });
    //   setFriends((prev) =>
    //     prev.map((prevFriend) => (prevFriend.friendId === friend.friendId ? { ...prevFriend, avatar } : prevFriend))
    //   );
    // });

    const friends: Friend[] = [
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

    setFriends(friends);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const getBirthDateLabel = (birthDate: string) => {
    const [day, month] = birthDate.split('.').map(Number);

    const today = new Date();
    const currentYear = today.getFullYear();

    let targetDate = new Date(currentYear, month - 1, day);

    if (targetDate < today) {
      targetDate = new Date(currentYear + 1, month - 1, day);
    }

    const differenceInTime = targetDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

    return Math.abs(differenceInDays) < 10 ? differenceInDays : null;
  };

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
        <PlatformButton style={styles.button} hapticFeedback="none">
          <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
            Найти друзей
          </ThemedText>
          <Icon name="search" color={Colors.white} />
        </PlatformButton>
        <View style={styles.friends}>
          {friends.map((friend, index) => (
            <React.Fragment key={friend.friendId}>
              <View style={styles.friend}>
                <Image style={styles.friendAvatar} source={require('@/assets/images/avatar.png')} />
                <View style={styles.friendInfo}>
                  <ThemedText type="h5" style={styles.friendFullname}>{`${friend.name} ${friend.surname}`}</ThemedText>
                  {/* Добавить функции для окончаний */}
                  <View style={styles.friendLabels}>
                    {friend.newWishesCount && (
                      <>
                        <ThemedText type="bodySmall" style={styles.friendLabel}>
                          {friend.newWishesCount + 'Новых желаний'}
                        </ThemedText>
                        <View style={[styles.labelDivider, { backgroundColor: theme.secondary }]}></View>
                      </>
                    )}
                    {getBirthDateLabel(friend.birthDate) && (
                      <ThemedText type="bodySmall" style={styles.friendLabel}>
                        {getBirthDateLabel(friend.birthDate) + 'Дней до дня рождения'}
                      </ThemedText>
                    )}
                  </View>
                </View>
                <TouchableOpacity style={styles.friendButton}></TouchableOpacity>
              </View>
              {index !== friends.length - 1 && <View style={styles.divider}></View>}
            </React.Fragment>
          ))}
        </View>
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
    backgroundColor: Colors.blue,
    paddingHorizontal: 5,
    paddingVertical: 17,
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    color: Colors.white,
  },
  friends: {
    marginTop: 24,
  },
  friend: {
    flexDirection: 'row',
    gap: 24,
    paddingVertical: 6,
    alignItems: 'center',
  },
  friendAvatar: {
    width: 70,
    height: 70,
  },
  friendInfo: {},
  friendFullname: {},
  friendLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  friendLabel: {},
  friendButton: {},
  divider: {
    backgroundColor: Colors.light,
    height: 1,
    marginLeft: 80,
  },
  labelDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
