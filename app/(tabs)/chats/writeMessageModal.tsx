import { FriendCard } from '@/components/FriendCard';
import { TextInput } from '@/components/TextInput';
import { ThemedText } from '@/components/ThemedText';
import { useStore } from '@/hooks/useStore';
import { useTheme } from '@/hooks/useTheme';
import { Friend } from '@/models';
import { Href, router, Stack } from 'expo-router';
import { Fragment, useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function WriteMessageModalScreen() {
  const { theme } = useTheme();
  const { friends, chats } = useStore();

  const [filteredFriends, setFilteredFriends] = useState<Friend[]>(friends);

  const filterFriends = (value: string) => {
    if (!value) {
      setFilteredFriends(friends);
    } else {
      setFilteredFriends(
        friends.filter(
          (friend) =>
            friend.name.toLowerCase().includes(value.toLowerCase()) ||
            friend.surname.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const getChatLink = (friendId: number): Href => {
    const chat = chats.find((chat) => chat.userTwoId === friendId);
    if (chat) return { pathname: '/chats/[chatId]', params: { chatId: chat.chatId } };
    return { pathname: '/chats/introductionModal', params: { friendId } };
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitle: () => <ThemedText>Написать сообщение</ThemedText>,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <ThemedText style={{ color: theme.primary }}>Отмена</ThemedText>
            </TouchableOpacity>
          ),
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      />
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
          onChangeText={filterFriends}
          keyboardType="default"
          inputMode="search"
          returnKeyType="search"
        />

        <View style={styles.friends}>
          {filteredFriends.map((friend, index) => (
            <Fragment key={friend.friendId}>
              <FriendCard friend={friend} enableFriendButton={false} link={getChatLink(friend.friendId)} />
              {index !== friends.length - 1 && (
                <View style={[styles.divider, { backgroundColor: theme.tabBarBorder }]} />
              )}
            </Fragment>
          ))}
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    marginTop: 20,
    gap: 20,
    paddingHorizontal: 16,
  },
  friends: {},
  divider: {
    height: 1,
    marginLeft: 80,
  },
});
