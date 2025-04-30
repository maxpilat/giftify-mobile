import { FriendCard } from '@/components/FriendCard';
import { Icon } from '@/components/Icon';
import { PlatformButton } from '@/components/PlatformButton';
import { TextInput } from '@/components/TextInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import friends from '.';
import { Friend } from '@/models';
import { apiFetchData } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';

export default function SearchFriendsScreen() {
  const { user } = useAuth();

  const [users, setUsers] = useState<Friend[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Friend[]>([]);

  useEffect(() => {
    apiFetchData<Friend[]>({ endpoint: API.friends.getAllUsers, token: user.token }).then(setUsers);
  }, []);

  const filterUsers = (value: string) => {
    setFilteredUsers(
      users.filter((user) => {
        user.name.includes(value) || user.surname.includes(value);
      })
    );
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
        onChangeText={(value) => {
          filterUsers(value);
        }}
        keyboardType="default"
        inputMode="search"
      />
      <PlatformButton hapticFeedback="none" onPress={() => router.push('./friends/searchFriends')}>
        <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
          Пригласить в приложение
        </ThemedText>
        <Icon name="addUser" color={Colors.white} />
      </PlatformButton>
      <ThemedView>
        {filteredUsers.map((user, index) => (
          <React.Fragment key={user.friendId}>
            <FriendCard friend={user} />
            {index !== friends.length - 1 && <View style={styles.divider}></View>}
          </React.Fragment>
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
    backgroundColor: Colors.light,
    height: 1,
    marginLeft: 80,
  },
});
