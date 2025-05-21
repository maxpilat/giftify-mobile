import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Friend } from '@/models';
import { getDaysUntilBirthday } from '@/utils/getDaysUntil';
import { Icon } from './Icon';
import { useProfile } from '@/hooks/useStore';
import { apiFetchData } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/themes';
import { Link } from 'expo-router';
import { formatCountedPhrase } from '@/utils/formatCountedPhrase';
import Toast from 'react-native-toast-message';

type Props = {
  friend: Friend;
};

export const FriendCard = ({ friend }: Props) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { fetchFriendRequests, fetchFriends, isFriend, isReceiver, isSender } = useProfile();

  const rejectFriendRequest = (isUserTwoAccept: boolean) => {
    return apiFetchData({
      endpoint: API.friends.sendRequest,
      method: 'POST',
      body: {
        userOneId: user.id,
        isUserOneAccept: false,
        userTwoId: friend.friendId,
        isUserTwoAccept,
      },
      token: user.token,
    })
      .then(fetchFriends)
      .then(fetchFriendRequests);
  };

  const handleRejectFriendRequest = () => {
    if (!isFriend(friend.friendId)) {
      rejectFriendRequest(false).catch(() =>
        Toast.show({
          type: 'error',
          text1: 'Не удалось отменить запрос в друзья',
        })
      );
      return;
    }

    Alert.alert('Подтвердите', 'Вы уверены, что хотите удалить пользователя из друзей?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить из друзей',
        style: 'destructive',
        onPress: () =>
          rejectFriendRequest(true)
            .then(() => Toast.show({ type: 'success', text1: 'Пользователь удалён из друзей' }))
            .catch(() => Toast.show({ type: 'error', text1: 'Не удалось удалить пользователя из друзей' })),
      },
    ]);
  };

  const acceptFriendRequest = () => {
    apiFetchData({
      endpoint: API.friends.sendRequest,
      method: 'POST',
      body: {
        userOneId: user.id,
        isUserOneAccept: true,
        userTwoId: friend.friendId,
        isUserTwoAccept: isSender(friend.friendId) ? true : false,
      },
      token: user.token,
    })
      .then(fetchFriends)
      .then(fetchFriendRequests)
      .then(
        () =>
          isSender(friend.friendId) &&
          Toast.show({
            type: 'success',
            text1: 'Пользователь добавлен в друзья',
          })
      )
      .catch(() =>
        Toast.show({
          type: 'error',
          text1: isSender(friend.friendId)
            ? 'Не удалось принять запрос в друзья'
            : 'Не удалось отправить запрос в друзья',
        })
      );
  };

  const getFriendButton = () => {
    if (isFriend(friend.friendId)) {
      return (
        <TouchableOpacity
          style={[styles.friendButton, { backgroundColor: theme.button }]}
          onPress={handleRejectFriendRequest}
        >
          <Icon name="accept" color={Colors.white} />
        </TouchableOpacity>
      );
    } else if (isReceiver(friend.friendId)) {
      return (
        <TouchableOpacity
          style={[styles.friendButton, { backgroundColor: Colors.lightBlue }]}
          onPress={handleRejectFriendRequest}
        >
          <Icon name="accept" color={Colors.blue} />
        </TouchableOpacity>
      );
    } else if (friend.friendId === user.id) {
      return null;
    }
    return (
      <TouchableOpacity style={[styles.friendButton, { backgroundColor: theme.button }]} onPress={acceptFriendRequest}>
        <Icon name="plus" color={Colors.white} />
      </TouchableOpacity>
    );
  };

  const getExtraInfo = () => {
    const newWishesLabel = friend.newWishesCount ? (
      <ThemedText type="bodySmall">
        {formatCountedPhrase({
          number: friend.newWishesCount,
          singular: 'желание',
          few: 'желания',
          many: 'желаний',
          singularAdj: 'новое',
          pluralAdj: 'новых',
        })}
      </ThemedText>
    ) : null;

    const birthDateLabel = friend.birthDate ? (
      getDaysUntilBirthday(friend.birthDate) === 0 ? (
        <ThemedText type="bodySmall">сегодня день рождения 🎉</ThemedText>
      ) : getDaysUntilBirthday(friend.birthDate) < 10 ? (
        <ThemedText type="bodySmall">{`${formatCountedPhrase({
          number: getDaysUntilBirthday(friend.birthDate),
          singular: 'день',
          few: 'дня',
          many: 'дней',
        })} до дня рождения`}</ThemedText>
      ) : null
    ) : null;

    return (
      <View style={styles.friendLabels}>
        {newWishesLabel}
        {newWishesLabel && birthDateLabel ? (
          <View style={[styles.labelDivider, { backgroundColor: theme.secondary }]} />
        ) : null}
        {birthDateLabel}
      </View>
    );
  };

  return (
    <Link asChild href={{ pathname: '/profile/[userId]', params: { userId: friend.friendId } }}>
      <TouchableOpacity activeOpacity={0.7} style={styles.friend}>
        <Image
          style={[styles.friendAvatar, { backgroundColor: theme.tabBarBorder }]}
          source={require('@/assets/images/avatar.png')}
        />
        <View style={styles.friendInfo}>
          <ThemedText type="h5">{`${friend.name} ${friend.surname}`}</ThemedText>
          {getExtraInfo()}
        </View>
        {getFriendButton()}
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  friend: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 6,
    alignItems: 'center',
  },
  friendAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  friendInfo: {
    flex: 1,
  },
  friendLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    flexWrap: 'wrap',
  },
  friendButton: {
    padding: 13,
    borderRadius: 25,
  },
  labelDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
