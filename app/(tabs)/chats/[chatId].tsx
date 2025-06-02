import {
  StyleSheet,
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { BackButton } from '@/components/BackButton';
import { useEffect, useMemo, useState } from 'react';
import { apiFetchData } from '@/lib/api';
import { API } from '@/constants/api';
import { Message } from '@/models';
import { useStore } from '@/hooks/useStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput } from '@/components/TextInput';
import { ThemedView } from '@/components/ThemedView';
import { Icon } from '@/components/Icon';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '@/constants/themes';

const screenWidth = Dimensions.get('window').width;

type SearchParams = {
  chatId: string;
};

export default function ChatScreen() {
  const { theme } = useTheme();
  const { chatId } = useLocalSearchParams<SearchParams>();
  const { user: authUser } = useAuth();
  const { chats } = useStore();
  const { bottom } = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

  const chat = useMemo(() => chats.find((chat) => chat.chatId === +chatId), [chats, chatId]);
  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    let intervalId: number;

    const pollMessages = () => {
      apiFetchData<Message[]>({ endpoint: API.chats.getMessages(+chatId), token: authUser.token })
        .then((messages) => {
          setMessages(messages.reverse());
          console.log(messages);

          apiFetchData({
            endpoint: API.chats.readMessage,
            method: 'PUT',
            body: { messageId: messages[0].id, readerId: authUser.id },
            token: authUser.token,
          }).catch(() => {});
        })
        .catch(() => {})
        .finally(() => (intervalId = setTimeout(pollMessages, 1000)));
    };

    pollMessages();

    const showSubscription = Keyboard.addListener('keyboardWillShow', (event) => {
      keyboardHeight.value = withTiming(event.endCoordinates.height, { duration: 500, easing: Easing.out(Easing.exp) });
      setIsKeyboardOpen(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      keyboardHeight.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.exp) });
      setIsKeyboardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      clearTimeout(intervalId);
    };
  }, []);

  const sendMessage = () => {
    apiFetchData({
      endpoint: API.chats.sendMessage,
      body: {
        chatId,
        messageType: 'TYPE_TEXT',
        fromUserId: authUser.id,
        text: message.trim(),
        // attachment: '*бинарный массив*',
      },
      method: 'POST',
      token: authUser.token,
    }).then(() =>
      apiFetchData<Message[]>({ endpoint: API.chats.getMessages(+chatId), token: authUser.token }).then((messages) => {
        setMessages(messages.reverse());
      })
    );

    setMessage('');
  };

  const getMessageMargin = (messageIndex: number) => {
    const prevMessage = messages[messageIndex + 1];
    if (prevMessage) return prevMessage.fromUserId === messages[messageIndex].fromUserId ? 5 : 10;
    return 0;
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <ThemedText type="bodyLargeMedium" style={{ width: screenWidth - 220, textAlign: 'center', height: 25 }}>
              {chat?.friendName}
            </ThemedText>
          ),
          headerLeft: BackButton,
          headerRight: () => (
            <Image source={{ uri: chat?.friendAvatar || undefined }} style={{ width: 35, height: 35 }} />
          ),
          headerStyle: { backgroundColor: theme.background },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View style={{ flex: 1, marginBottom: keyboardHeight }}>
          <GestureHandlerRootView style={[styles.messagesArea, { backgroundColor: theme.subBackground }]}>
            <FlatList
              contentContainerStyle={styles.flatList}
              inverted={true}
              data={messages}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item: message, index }: { item: Message; index: number }) => (
                <View
                  style={[
                    styles.messageContainer,
                    {
                      alignItems: message.fromUserId === authUser.id ? 'flex-end' : 'flex-start',
                      marginTop: getMessageMargin(index),
                    },
                  ]}
                >
                  <ThemedView
                    style={[
                      styles.message,
                      {
                        borderBottomLeftRadius: message.fromUserId === authUser.id ? 20 : 0,
                        borderBottomRightRadius: message.fromUserId === authUser.id ? 0 : 20,
                      },
                    ]}
                  >
                    <ThemedText style={styles.messageText}>{message.text}</ThemedText>
                    <View style={styles.messageInfo}>
                      <ThemedText type="bodyExtraSmall" style={{ color: Colors.grey }}>
                        {new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(
                          new Date(message.sent)
                        )}
                      </ThemedText>
                      {message.fromUserId === authUser.id && (
                        <Icon
                          name={
                            message[chat?.userOneId === authUser.id ? 'isReadBySecond' : 'isReadByFirst']
                              ? 'read'
                              : 'done'
                          }
                          size={16}
                          color={Colors.grey}
                        />
                      )}
                    </View>
                  </ThemedView>
                </View>
              )}
            />
          </GestureHandlerRootView>
          <ThemedView style={[styles.bottomPanel, { paddingBottom: isKeyboardOpen ? 16 : bottom }]}>
            <View style={styles.textInputContainer}>
              <TextInput
                multiline={true}
                inputContainerStyle={{ paddingVertical: 12 }}
                inputStyle={{ maxHeight: 160, paddingBottom: 4 }}
                placeholder="Сообщение"
                value={message}
                onChangeText={setMessage}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.sendButton, { backgroundColor: theme.primary }]}
              onPress={sendMessage}
            >
              <Icon name="arrowUp" />
            </TouchableOpacity>
          </ThemedView>
        </Animated.View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  messagesArea: {
    flex: 1,
  },
  flatList: {
    padding: 16,
  },
  bottomPanel: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  textInputContainer: {
    flex: 1,
  },
  sendButton: {
    padding: 15,
    borderRadius: 40,
    alignSelf: 'flex-end',
  },
  messageContainer: {},
  message: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'row',
    gap: 12,
  },
  messageText: {
    maxWidth: '60%',
  },
  messageInfo: {
    flexDirection: 'row',
    gap: 5,
    alignSelf: 'flex-end',
  },
});
