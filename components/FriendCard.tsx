import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Friend } from '@/models';
import { getDaysUntilBirthday } from '@/utils/getDaysUntilBirthday';
import { formatNewWishes, formatDays } from '@/utils/formatWord';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Icon } from './Icon';
import { useProfile } from '@/hooks/useProfile';
import { apiFetchData } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  friend: Friend;
};

export const FriendCard = ({ friend }: Props) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { friendRequests, fetchFriendRequests } = useProfile();

  const cancelFriendRequest = () => {};

  const sendFriendRequest = (friendId: number) => {
    apiFetchData({
      endpoint: API.friends.sendRequest,
      method: 'POST',
      body: {
        userOneId: user.userId,
        isUserOneAccept: true,
        userTwoId: friendId,
        isUserTwoAccept: false,
      },
      token: user.token,
    }).then(fetchFriendRequests);
  };

  const isFriend = (friendId: number) => {
    return friendRequests.find(
      (request) =>
        (request.userOneId === friendId || request.userTwoId === friendId) &&
        request.isUserOneAccept &&
        request.isUserTwoAccept
    )
      ? true
      : false;
  };

  const isReceiver = (friendId: number) => {
    return friendRequests.find(
      (request) =>
        (request.userOneId === friendId && !request.isUserOneAccept && request.isUserTwoAccept) ||
        (request.userTwoId === friendId && !request.isUserTwoAccept && request.isUserOneAccept)
    )
      ? true
      : false;
  };

  const getFriendButton = (friendId: number) => {
    if (isFriend(friendId)) return null;
    else if (isReceiver(friendId))
      return (
        <TouchableOpacity
          style={[styles.friendButton, { backgroundColor: Colors.lightBlue }]}
          onPress={cancelFriendRequest}
        >
          <Icon name="accept" color={Colors.blue} />
        </TouchableOpacity>
      );
    return (
      <TouchableOpacity
        style={[styles.friendButton, { backgroundColor: Colors.black }]}
        onPress={() => sendFriendRequest(friendId)}
      >
        <Icon name="plus" color={Colors.white} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.friend}>
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
            const daysUntilBirthday = getDaysUntilBirthday(friend.birthDate);
            return daysUntilBirthday > 10 ? (
              <ThemedText type="bodySmall">{`${formatDays(daysUntilBirthday)} до дня рождения`}</ThemedText>
            ) : null;
          })()}
        </View>
      </View>
      {getFriendButton(friend.friendId)}
    </View>
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
    borderRadius: 30,
  },
  labelDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
