import { FriendCard } from '@/components/FriendCard';
import { Icon } from '@/components/Icon';
import { PlatformButton } from '@/components/PlatformButton';
import { TextInput } from '@/components/TextInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState, Fragment } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Friend } from '@/models';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import * as Linking from 'expo-linking';

export default function SearchFriendsScreen() {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();

  const [users, setUsers] = useState<Friend[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Friend[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const users = await apiFetchData<Friend[]>({
      endpoint: API.friends.getAllUsers(authUser.id),
      token: authUser.token,
    });

    setUsers(users);

    const avatarsMap = new Map(
      await Promise.all(
        users.map(async (user) => {
          const avatar = await apiFetchImage({
            endpoint: API.profile.getAvatar(user.friendId),
            token: authUser.token,
          });
          return [user.friendId, avatar] as const;
        })
      )
    );

    setUsers((prev) =>
      prev.map((user) => ({
        ...user,
        avatar: avatarsMap.get(user.friendId),
      }))
    );
  };

  const filterUsers = (value: string) => {
    if (!value) {
      setFilteredUsers([]);
    } else {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(value.toLowerCase()) ||
            user.surname.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const inviteFriend = () => {
    const link = Linking.createURL(`/invite`, {
      queryParams: { friendEmail: authUser.email },
    });

    Share.share({ url: link });
  };

  return (
    <KeyboardAwareScrollView extraScrollHeight={60} enableOnAndroid contentContainerStyle={styles.scrollViewContent}>
      <TextInput
        icon="search"
        placeholder="Поиск"
        type="search"
        onChangeText={filterUsers}
        keyboardType="default"
        inputMode="search"
        returnKeyType="search"
      />
      <PlatformButton onPress={inviteFriend}>
        <ThemedText type="bodyLargeMedium" style={styles.buttonText} parentBackgroundColor={theme.primary}>
          Пригласить в приложение
        </ThemedText>
        <Icon name="addUser" parentBackgroundColor={theme.primary} />
      </PlatformButton>
      <ThemedView>
        {filteredUsers.map((user, index) => (
          <Fragment key={user.friendId}>
            <FriendCard friend={user} link={{ pathname: '/profile/[userId]', params: { userId: user.friendId } }} />
            {index !== filteredUsers.length - 1 && (
              <View style={[styles.divider, { backgroundColor: theme.tabBarBorder }]} />
            )}
          </Fragment>
        ))}
      </ThemedView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 20,
    paddingBottom: 100,
  },
  buttonText: {
    color: Colors.white,
  },
  divider: {
    height: 1,
    marginLeft: 80,
  },
});
