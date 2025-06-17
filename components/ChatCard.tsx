import { Link } from 'expo-router';
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Chat } from '@/models';
import { Icon } from '@/components/Icon';
import { Colors } from '@/constants/themes';
import { Skeleton } from './Skeleton';

type Props = Chat;

export const ChatCard = ({ chatId, friendAvatar, lastMessage, friendName, unreadMessageCount, userOneId }: Props) => {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();

  return (
    <Link asChild href={{ pathname: '/chats/[chatId]', params: { chatId } }}>
      <TouchableOpacity activeOpacity={0.7} style={styles.card}>
        {friendAvatar !== undefined ? (
          <Image
            style={[styles.userTwoAvatar, { backgroundColor: theme.tabBarBorder }]}
            source={
              friendAvatar
                ? { uri: friendAvatar }
                : friendAvatar === null
                ? require('@/assets/images/inkognito.png')
                : require('@/assets/images/avatar.png')
            }
          />
        ) : (
          <Skeleton style={{ width: 70, height: 70, borderRadius: 35 }} />
        )}

        <View style={[styles.column, { flex: 1 }]}>
          <ThemedText type="bodyLargeMedium">{friendName}</ThemedText>
          <ThemedText type="bodySmall" numberOfLines={1} ellipsizeMode="tail">
            {lastMessage?.text || (lastMessage?.messageType === 'TYPE_IMAGE' ? 'Фотография' : '')}
          </ThemedText>
        </View>

        {lastMessage && (
          <View style={[styles.column, { minWidth: 40, alignItems: 'flex-end' }]}>
            <ThemedText style={{ color: Colors.grey }}>
              {new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(
                new Date(lastMessage.sent)
              )}
            </ThemedText>
            {unreadMessageCount && lastMessage.fromUserId !== authUser.id ? (
              <View style={[styles.unreadMessagesCountLabel, { backgroundColor: theme.secondary }]}>
                <ThemedText type="labelBase" parentBackgroundColor={theme.secondary}>
                  {unreadMessageCount}
                </ThemedText>
              </View>
            ) : lastMessage.fromUserId === authUser.id ? (
              <Icon
                name={lastMessage[userOneId === authUser.id ? 'isReadBySecond' : 'isReadByFirst'] ? 'read' : 'done'}
                size={20}
                color={Colors.grey}
              />
            ) : (
              <View style={{ height: 20 }} />
            )}
          </View>
        )}
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 6,
  },
  userTwoAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  column: {
    flexShrink: 1,
    gap: 6,
  },
  unreadMessagesCountLabel: {
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
