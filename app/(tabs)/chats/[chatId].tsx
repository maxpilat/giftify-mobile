import { StyleSheet, Image } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { BackButton } from '@/components/BackButton';
import { useEffect, useState } from 'react';
import { apiFetchData, apiFetchImage } from '@/lib/api';
import { API } from '@/constants/api';
import { Message } from '@/models';

type SearchParams = {
  chatId: string;
  userTwoId: string;
  userTwoName: string;
};

export default function ChatScreen() {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();
  const { chatId, userTwoId, userTwoName } = useLocalSearchParams<SearchParams>();

  const [userTwoAvatar, setUserTwoAvatar] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    apiFetchImage({ endpoint: API.profile.getAvatar(+userTwoId), token: authUser.token }).then(setUserTwoAvatar);
    apiFetchData<Message[]>({ endpoint: API.chats.getMessages(+chatId), token: authUser.token }).then(setMessages);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => <ThemedText type="bodyLargeMedium">{userTwoName}</ThemedText>,
          headerLeft: BackButton,
          headerRight: () => <Image source={{ uri: userTwoAvatar }} />,
          headerStyle: { backgroundColor: theme.background },
          contentStyle: { backgroundColor: theme.background },
        }}
      />
      <ThemedText>Чат</ThemedText>
    </>
  );
}

const styles = StyleSheet.create({});
