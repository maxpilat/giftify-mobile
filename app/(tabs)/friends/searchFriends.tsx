import { FriendCard } from '@/components/FriendCard';
import { Icon } from '@/components/Icon';
import { PlatformButton } from '@/components/PlatformButton';
import { TextInput } from '@/components/TextInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState, Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Friend } from '@/models';
import { apiFetchData } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export default function SearchFriendsScreen() {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();

  const [users, setUsers] = useState<Friend[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Friend[]>([]);

  useEffect(() => {
    apiFetchData<Friend[]>({ endpoint: API.friends.getAllUsers(authUser.userId), token: authUser.token }).then(
      setUsers
    );
  }, []);

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

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={60}
      keyboardOpeningTime={0}
      enableOnAndroid
      contentContainerStyle={styles.scrollViewContent}
    >
      <TextInput
        icon="search"
        placeholder="Поиск"
        type="search"
        onChangeText={filterUsers}
        keyboardType="default"
        inputMode="search"
        returnKeyType="search"
      />
      <PlatformButton hapticFeedback="none">
        <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
          Пригласить в приложение
        </ThemedText>
        <Icon name="addUser" color={Colors.white} />
      </PlatformButton>
      <ThemedView>
        {filteredUsers.map((user, index) => (
          <Fragment key={user.friendId}>
            <FriendCard friend={user} />
            {index !== filteredUsers.length - 1 && (
              <View style={[styles.divider, { backgroundColor: theme.tabBarBorder }]}></View>
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
    gap: 22,
  },
  buttonText: {
    color: Colors.white,
  },
  divider: {
    height: 1,
    marginLeft: 80,
  },
});
