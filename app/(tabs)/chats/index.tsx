import { ThemedText } from '@/components/ThemedText';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import { API } from '@/constants/api';
import { Chat, Profile } from '@/models';
import { Colors } from '@/constants/themes';
import { ChatCard } from '@/components/ChatCard';
import { router, Stack } from 'expo-router';
import { Icon } from '@/components/Icon';

export default function ChatsScreen() {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchChats().finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const chats = await apiFetchData<Chat[]>({ endpoint: API.chats.getUserChats(authUser.id), token: authUser.token });

    const friendsNamesMap = new Map(
      await Promise.all(
        chats.map(async (chat) => {
          const friendId = chat.userOneId === authUser.id ? chat.userTwoId : chat.userOneId;
          const { name, surname } = await apiFetchData<Profile>({ endpoint: API.profile.getProfile(friendId) });
          return [chat.chatId, `${name} ${surname}`] as const;
        })
      )
    );

    setChats(
      chats.map((chat) => ({
        ...chat,
        friendName: chat.userOneId === authUser.id ? friendsNamesMap.get(chat.chatId)! : chat.userOneDisplayName,
      }))
    );

    Promise.all(
      chats.map(async (chat) => {
        if (chat.userOneId !== authUser.id) return [chat.chatId, undefined] as const;
        const avatar = await apiFetchImage({ endpoint: API.profile.getAvatar(chat.userTwoId), token: authUser.token });
        return [chat.chatId, avatar] as const;
      })
    ).then((friendsAvatarsMap) => {
      setChats((prevChats) =>
        prevChats.map((chat) => ({
          ...chat,
          friendAvatar: new Map(friendsAvatarsMap).get(chat.chatId),
        }))
      );
    });
  };

  const onWriteMessage = () => {
    router.push({ pathname: '/chats/writeMessageModal' });
  };

  const onHelp = () => {
    router.push({ pathname: '/chats/helpModal' });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Чаты',
          headerTitleStyle: {
            fontFamily: 'stolzl-medium',
            color: theme.text,
          },
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerLargeTitleStyle: {
            fontFamily: 'stolzl-medium',
            color: theme.text,
          },
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerBackVisible: false,
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 14, marginRight: -4 }}>
              <TouchableOpacity onPress={onWriteMessage}>
                <Icon name="edit" size={28} color={theme.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onHelp}>
                <Icon name="helpCircle" size={28} color={theme.primary} />
              </TouchableOpacity>
            </View>
          ),
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      />
      <GestureHandlerRootView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          contentContainerStyle={{ flex: chats.length ? 0 : 1 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        >
          <View style={[styles.chats, { marginBottom: chats.length ? 0 : 200 }]}>
            {chats.length ? (
              chats.map((chat) => (
                <ChatCard
                  key={chat.chatId}
                  chatId={chat.chatId}
                  friendName={chat.userOneId === authUser.id ? chat.friendName! : chat.userOneDisplayName}
                />
              ))
            ) : (
              <ThemedText type="bodyLarge" style={styles.noFriendsMessage}>
                У вас пока нет сообщений
              </ThemedText>
            )}
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  chats: {
    flex: 1,
    justifyContent: 'center',
  },
  noFriendsMessage: {
    marginTop: 10,
    textAlign: 'center',
    color: Colors.grey,
  },
});
