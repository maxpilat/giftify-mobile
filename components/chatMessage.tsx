import { StyleSheet, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ChatMessage as ChatMessageType, ClientChatAttachment } from '@/models';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/themes';
import { useEffect, useState } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useStore } from '@/hooks/useStore';
import { Skeleton } from './Skeleton';

type Props = {
  message: ChatMessageType;
  attachment?: ClientChatAttachment;
  prevMessageUserId?: number;
  isUserOne?: boolean;
};

export function ChatMessage({ message, attachment, prevMessageUserId, isUserOne }: Props) {
  const { user: authUser } = useAuth();
  const { chatAttachments } = useStore();

  const [numLines, setNumLines] = useState(0);

  const opacity = useSharedValue(0);
  const animatedImageStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (chatAttachments.has(message.id)) {
      opacity.value = withTiming(1, {
        duration: 0,
        easing: Easing.out(Easing.ease),
      });
    }
  }, []);

  useEffect(() => {
    if (attachment) {
      opacity.value = withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [attachment]);

  const getMessageMargin = () => {
    if (prevMessageUserId) return prevMessageUserId === message.fromUserId ? 5 : 10;
    return 0;
  };

  return (
    <View
      style={{
        alignItems: message.fromUserId === authUser.id ? 'flex-end' : 'flex-start',
        marginTop: getMessageMargin(),
      }}
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
        {message.messageType === 'TYPE_IMAGE' &&
          (attachment ? (
            <Animated.Image
              source={{ uri: attachment?.uri }}
              resizeMode="contain"
              style={[{ width: '100%', aspectRatio: attachment?.aspectRatio }, animatedImageStyle]}
            />
          ) : (
            <Skeleton minOpacity={0.2} maxOpacity={0.8} style={{ minWidth: '100%', height: 150 }} />
          ))}
        <View
          style={[
            styles.messageBody,
            {
              flexDirection:
                numLines > 1 || (message.messageType === 'TYPE_IMAGE' && numLines !== 1) ? 'column' : 'row',
              justifyContent: message.text ? 'space-between' : 'flex-end',
            },
          ]}
        >
          {message.text && (
            <ThemedText onTextLayout={(event) => setNumLines(event.nativeEvent.lines.length)}>
              {message.text}
            </ThemedText>
          )}
          <View style={styles.messageInfoContainer}>
            <View style={styles.messageInfo}>
              <ThemedText type="bodyExtraSmall" style={{ color: Colors.grey }}>
                {new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(
                  new Date(message.sent)
                )}
              </ThemedText>
              {message.fromUserId === authUser.id && (
                <Icon
                  name={message[isUserOne ? 'isReadBySecond' : 'isReadByFirst'] ? 'read' : 'done'}
                  size={16}
                  color={Colors.grey}
                />
              )}
            </View>
          </View>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    maxWidth: '70%',
    overflow: 'hidden',
  },
  messageBody: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    columnGap: 12,
    rowGap: 4,
    flexWrap: 'wrap',
  },
  messageInfoContainer: {
    width: '100%',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  messageInfo: {
    flexDirection: 'row',
    gap: 4,
  },
});
