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
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { BackButton } from '@/components/BackButton';
import { useEffect, useMemo, useState } from 'react';
import { apiFetchData } from '@/lib/api';
import { API } from '@/constants/api';
import { ChatMessage as ChatMessageType } from '@/models';
import { useStore } from '@/hooks/useStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput } from '@/components/TextInput';
import { Icon } from '@/components/Icon';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { showToast } from '@/utils/showToast';
import { ChatMessage } from '@/components/chatMessage';
import { Skeleton } from '@/components/Skeleton';

const screenWidth = Dimensions.get('window').width;

type SearchParams = {
  chatId: string;
};

export default function ChatScreen() {
  const { theme } = useTheme();
  const { chatId } = useLocalSearchParams<SearchParams>();
  const { user: authUser } = useAuth();
  const { currentChatId, chats, chatAttachments, loadChatAttachment, switchChat } = useStore();
  const { bottom } = useSafeAreaInsets();

  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

  const chat = useMemo(() => chats.find((chat) => chat.chatId === +chatId), [chats, chatId]);
  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    if (currentChatId !== +chatId) switchChat(+chatId);

    let intervalId: number;

    const pollMessages = () => {
      apiFetchData<ChatMessageType[]>({ endpoint: API.chats.getMessages(+chatId), token: authUser.token })
        .then((messages) => {
          setMessages(messages.reverse());

          apiFetchData({
            endpoint: API.chats.readMessage,
            method: 'PUT',
            body: { messageId: messages[0].id, readerId: authUser.id },
            token: authUser.token,
          }).catch(() => {});

          messages.forEach((message) => {
            if (message.messageType === 'TYPE_IMAGE' && !chatAttachments.has(message.id)) {
              loadChatAttachment(message.id);
            }
          });
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
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    apiFetchData({
      endpoint: API.chats.sendMessage,
      body: {
        chatId,
        messageType: 'TYPE_TEXT',
        fromUserId: authUser.id,
        text: trimmedMessage,
      },
      method: 'POST',
      token: authUser.token,
    })
      .then(() =>
        apiFetchData<ChatMessageType[]>({ endpoint: API.chats.getMessages(+chatId), token: authUser.token }).then(
          (messages) => {
            setMessages(messages.reverse());
          }
        )
      )
      .catch(() => showToast('error', 'Не удалось отправить сообщение'));

    setMessage('');
  };

  const attachImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: false,
      quality: 1,
    });

    const imageUri = result.assets?.[0]?.uri;

    if (!result.canceled && imageUri) {
      router.push({ pathname: '/chats/attachImageModal', params: { chatId, imageUri, message } });
    }
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
          headerLeft: () => <BackButton />,
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={chat?.userTwoId === authUser.id ? 1 : undefined}
              onPress={() =>
                chat?.userTwoId &&
                chat?.userTwoId !== authUser.id &&
                router.push({ pathname: '/profile/[userId]', params: { userId: chat.userTwoId } })
              }
            >
              {chat?.friendAvatar !== undefined ? (
                <Image
                  source={chat.friendAvatar ? { uri: chat.friendAvatar } : require('@/assets/images/inkognito.png')}
                  style={styles.friendAvatar}
                />
              ) : (
                <Skeleton style={styles.friendAvatar} />
              )}
            </TouchableOpacity>
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
              renderItem={({ item, index }: { item: ChatMessageType; index: number }) => (
                <ChatMessage
                  message={item}
                  attachment={chatAttachments.get(item.id)}
                  prevMessageUserId={messages[index + 1]?.fromUserId}
                  isUserOne={authUser.id === chat?.userOneId}
                />
              )}
            />
          </GestureHandlerRootView>
          <View style={[styles.bottomPanel, { paddingBottom: isKeyboardOpen ? 16 : bottom }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.button, { backgroundColor: theme.button }]}
              onPress={attachImage}
            >
              <Icon name="camera" />
            </TouchableOpacity>
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
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={sendMessage}
            >
              <Icon name="arrowUp" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  friendAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
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
  button: {
    padding: 15,
    borderRadius: 40,
    alignSelf: 'flex-end',
  },
});
