import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { TextInput } from '@/components/TextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStore';
import { apiFetchData } from '@/lib/api';
import { ThemedText } from '@/components/ThemedText';
import { showToast } from '@/utils/showToast';
import { useTheme } from '@/hooks/useTheme';

type SearchParams = {
  friendId: string;
};

export default function IntroductionModalScreen() {
  const { theme } = useTheme();
  const { friendId } = useLocalSearchParams<SearchParams>();
  const { user: authUser } = useAuth();
  const { chats, fetchChats } = useStore();

  const [pseudonym, setPseudonym] = useState<string>('');
  const [errors, setErrors] = useState<Record<'pseudonym', boolean>>({
    pseudonym: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    const prevChats = chats;

    if (!isValid()) return;

    setIsSubmitting(true);

    apiFetchData({
      endpoint: API.chats.createChat,
      method: 'POST',
      body: {
        chatType: 'TYPE_ANONYMOUS',
        userOneId: authUser.id,
        userOneDisplayName: pseudonym,
        userTwoId: friendId,
      },
      token: authUser.token,
    })
      .then(fetchChats)
      .then((newChats) => {
        const newChat = newChats.find((newChat) => !prevChats.some((prevChat) => prevChat.chatId === newChat.chatId))!;
        router.replace({ pathname: '/chats/[chatId]', params: { chatId: newChat.chatId } });
      })
      .catch(() => showToast('error', 'Не удалось создать чат'))
      .finally(() => setIsSubmitting(false));
  };

  const isValid = () => {
    const newErrors = {
      pseudonym: !pseudonym.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  return (
    <>
      <Stack.Screen
        options={{
          presentation: 'modal',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitle: () => <ThemedText>Узнайте больше</ThemedText>,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <ThemedText style={{ color: theme.primary }}>Отмена</ThemedText>
            </TouchableOpacity>
          ),
          headerRight: () =>
            isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <TouchableOpacity onPress={handleSubmit}>
                <ThemedText style={{ color: theme.primary }}>Готово</ThemedText>
              </TouchableOpacity>
            ),
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      />

      <KeyboardAwareScrollView enableOnAndroid contentContainerStyle={styles.container}>
        <ThemedText type="h2">Как нам представить тебя другу?</ThemedText>
        <View style={styles.fields}>
          <TextInput
            icon="hat"
            placeholder="Псевдоним"
            value={pseudonym}
            valid={!errors.pseudonym}
            onChangeText={(value) => {
              setPseudonym(value);
              setErrors((prev) => ({ ...prev, pseudonym: false }));
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
  },
  fields: {
    gap: 20,
  },
});
