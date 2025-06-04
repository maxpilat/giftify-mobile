import { ThemedText } from '@/components/ThemedText';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { useTheme } from '@/hooks/useTheme';
import { Fragment, useEffect, useState } from 'react';
import { Colors } from '@/constants/themes';
import { ChatCard } from '@/components/ChatCard';
import { router, Stack } from 'expo-router';
import { Icon } from '@/components/Icon';
import { useStore } from '@/hooks/useStore';

export default function ChatsScreen() {
  const { theme } = useTheme();
  const { chats, fetchChats, hotFetchChats } = useStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchChats().finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    let intervalId: number;

    const pollChats = () => {
      hotFetchChats()
        .catch(() => {})
        .finally(() => (intervalId = setTimeout(pollChats, 1000)));
    };

    pollChats();

    return () => clearTimeout(intervalId);
  }, []);

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
          contentContainerStyle={[styles.scrollViewContent, { flex: chats.length ? 0 : 1 }]}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        >
          <View style={[styles.chats, { marginBottom: chats.length ? 0 : 200 }]}>
            {chats.length ? (
              chats.map((chat, index) => (
                <Fragment key={chat.chatId}>
                  <ChatCard {...chat} />
                  {index !== chats.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: theme.tabBarBorder }]} />
                  )}
                </Fragment>
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
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 70,
    marginTop: 16,
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
  divider: {
    height: 1,
    marginLeft: 80,
    marginVertical: 2,
  },
});
