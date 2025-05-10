import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Friend } from '@/models';
import { getDaysUntilBirthday } from '@/utils/getDaysUntilBirthday';
import { formatNewWishes, formatDays } from '@/utils/formatWord';
import { Icon } from './Icon';
import { useProfile } from '@/hooks/useProfile';
import { apiFetchData } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/themes';
import { Link, router } from 'expo-router';

type Props = {
  friend: Friend;
};

export const FriendCard = ({ friend }: Props) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { fetchFriendRequests, fetchFriends, isFriend, isReceiver, isSender } = useProfile();

  const rejectFriendRequest = async (friendId: number, isUserTwoAccept: boolean) => {
    await apiFetchData({
      endpoint: API.friends.sendRequest,
      method: 'POST',
      body: {
        userOneId: user.userId,
        isUserOneAccept: false,
        userTwoId: friendId,
        isUserTwoAccept,
      },
      token: user.token,
    });
    return await Promise.all([fetchFriendRequests(), fetchFriends()]);
  };

  const handleRejectFriendRequest = (friendId: number) => {
    if (!isFriend(friendId)) {
      return rejectFriendRequest(friendId, false);
    }

    Alert.alert('Подтвердите', 'Вы уверены, что хотите удалить пользователя из друзей?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить из друзей',
        style: 'destructive',
        onPress: () => rejectFriendRequest(friendId, true),
      },
    ]);
  };

  const acceptFriendRequest = (friendId: number) => {
    apiFetchData({
      endpoint: API.friends.sendRequest,
      method: 'POST',
      body: {
        userOneId: user.userId,
        isUserOneAccept: true,
        userTwoId: friendId,
        isUserTwoAccept: isSender(friend.friendId) ? true : false,
      },
      token: user.token,
    }).then(() => Promise.all([fetchFriendRequests(), fetchFriends()]));
  };

  const getFriendButton = (friendId: number) => {
    if (isFriend(friendId)) {
      return (
        <TouchableOpacity
          style={[styles.friendButton, { backgroundColor: theme.button }]}
          onPress={() => handleRejectFriendRequest(friendId)}
        >
          <Icon name="accept" color={Colors.white} />
        </TouchableOpacity>
      );
    } else if (isReceiver(friendId)) {
      return (
        <TouchableOpacity
          style={[styles.friendButton, { backgroundColor: Colors.lightBlue }]}
          onPress={() => handleRejectFriendRequest(friendId)}
        >
          <Icon name="accept" color={Colors.blue} />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={[styles.friendButton, { backgroundColor: theme.button }]}
        onPress={() => acceptFriendRequest(friendId)}
      >
        <Icon name="plus" color={Colors.white} />
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.friend}
      onPress={() => router.push({ pathname: '/(tabs)/profile/index/[userId]', params: { userId: friend.friendId } })}
    >
      <Image
        style={[styles.friendAvatar, { backgroundColor: theme.tabBarBorder }]}
        source={require('@/assets/images/avatar.png')}
      />
      <View style={styles.friendInfo}>
        <ThemedText type="h5">{`${friend.name} ${friend.surname}`}</ThemedText>
        <View style={styles.friendLabels}>
          {friend.newWishesCount > 0 && (
            <>
              <ThemedText type="bodySmall">{formatNewWishes(friend.newWishesCount)}</ThemedText>
              <View style={[styles.labelDivider, { backgroundColor: theme.secondary }]} />
            </>
          )}
          {(() => {
            if (!friend.birthDate) return;
            const daysUntilBirthday = getDaysUntilBirthday(friend.birthDate);
            return daysUntilBirthday > 10 ? (
              <ThemedText type="bodySmall">{`${formatDays(daysUntilBirthday)} до дня рождения`}</ThemedText>
            ) : null;
          })()}
        </View>
      </View>
      {getFriendButton(friend.friendId)}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  friend: {
    flexDirection: 'row',
    gap: 24,
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
