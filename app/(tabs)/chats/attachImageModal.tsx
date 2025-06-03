import { useEffect, useState } from 'react';
import { Image, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { TextInput } from '@/components/TextInput';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { apiFetchData } from '@/lib/api';
import { ThemedText } from '@/components/ThemedText';
import { showToast } from '@/utils/showToast';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { base64ToBinaryArray, uriToBase64 } from '@/utils/convertImage';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

type SearchParams = {
  chatId: string;
  imageUri: string;
  message?: string;
};

export default function AttachImageModalScreen() {
  const { theme } = useTheme();
  const { chatId, imageUri, message: initialMessage } = useLocalSearchParams<SearchParams>();
  const { user: authUser } = useAuth();
  const { bottom } = useSafeAreaInsets();

  const [message, setMessage] = useState<string>(initialMessage || '');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

  const keyboardHeight = useSharedValue(0);

  const sendMessage = async () => {
    apiFetchData({
      endpoint: API.chats.sendMessage,
      body: {
        chatId,
        messageType: 'TYPE_IMAGE',
        fromUserId: authUser.id,
        text: message.trim(),
        attachment: base64ToBinaryArray(await uriToBase64(imageUri)),
      },
      method: 'POST',
      token: authUser.token,
    })
      .then(router.back)
      .catch(() => showToast('error', 'Не удалось отправить сообщение'));
  };

  useEffect(() => {
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
    };
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.background,
          },
          title: '',
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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View style={{ flex: 1, marginBottom: keyboardHeight }}>
          <View style={styles.imageContainer}>
            <Image style={{ flex: 1 }} resizeMode="contain" source={{ uri: imageUri }} />
          </View>
          <View style={[styles.bottomPanel, { paddingBottom: isKeyboardOpen ? 16 : bottom }]}>
            <View style={styles.textInputContainer}>
              <TextInput
                multiline={true}
                inputContainerStyle={{ paddingVertical: 12 }}
                inputStyle={{ maxHeight: 160, paddingBottom: 4 }}
                placeholder="Добавить подпись..."
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
  imageContainer: {
    flex: 1,
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
