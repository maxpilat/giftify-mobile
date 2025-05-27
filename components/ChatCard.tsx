import { Link } from 'expo-router';
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Message } from '@/models';

type Props = {
  chatId: number;
  userTwoName: string;
  userTwoAvatar?: string;
  lastMessage?: Message;
  unreadMessageCount?: number;
};

export const ChatCard = ({ chatId, userTwoName, userTwoAvatar, lastMessage, unreadMessageCount }: Props) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <Link asChild href={{ pathname: '/chats/[chatId]', params: { chatId } }}>
      <TouchableOpacity activeOpacity={0.7} style={styles.card}>
        <Image
          style={[styles.userTwoAvatar, { backgroundColor: theme.tabBarBorder }]}
          source={userTwoAvatar ? { uri: userTwoAvatar } : require('@/assets/images/avatar.png')}
        />
        <View style={styles.row}>
          <ThemedText type="bodyLargeMedium">{userTwoName}</ThemedText>(
          <ThemedText>
            {lastMessage
              ? new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(
                  new Date(lastMessage?.sent)
                )
              : ''}
          </ThemedText>
          )
        </View>

        <View style={styles.row}>
          {<ThemedText type="bodySmall">{lastMessage ? lastMessage.text : ''}</ThemedText>}
          {
            <View
              style={[
                styles.unreadMessagesCountLabel,
                { backgroundColor: theme.secondary, opacity: unreadMessageCount ? 1 : 0 },
              ]}
            >
              {unreadMessageCount}
            </View>
          }
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 6,
    alignItems: 'center',
  },
  userTwoAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  row: {},
  unreadMessagesCountLabel: {
    padding: 4,
    borderRadius: 4,
  },
});
