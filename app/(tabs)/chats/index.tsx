import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView, RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { apiFetchData } from '@/lib/api';
import { API } from '@/constants/api';
import { Chat } from '@/models';

export default function ChatsScreen() {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();

  const [chats, setChats] = useState(); //забирать из контекста

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
  };

  return (
    <GestureHandlerRootView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});
