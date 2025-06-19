import { useState } from 'react';
import { StyleSheet, ImageBackground, View, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MaskedView from '@react-native-masked-view/masked-view';
import { SvgXml } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { Profile, ProfileBackground } from '@/models';
import { formatCountedPhrase } from '@/utils/formatCountedPhrase';
import { Link, router } from 'expo-router';
import { Colors } from '@/constants/themes';
import { useStore } from '@/hooks/useStore';
import { Icon } from '@/components/Icon';
import { apiFetchData } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { showToast } from '@/utils/showToast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton } from './Skeleton';
import { PlatformButton } from './PlatformButton';

const mask = `
  <svg width="280" height="130" viewBox="100 -0.5 280 161" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M264 0C219.817 0 184 35.8172 184 80V92C184 119.614 161.614 142 134 142H50C22.3858 142 0 164.386 0 192V248C0 275.614 22.3858 298 50 298H478C505.614 298 528 275.614 528 248V192C528 164.386 505.614 142 478 142H394C366.386 142 344 119.614 344 92V80C344 35.8172 308.183 0 264 0Z" fill="black"/>
  </svg>
`;

type Props = {
  profile?: Profile;
  avatar?: string;
  background?: ProfileBackground;
  friendsAvatars?: (string | undefined)[];
  friendsCount?: number;
  tabs: string[];
  onTabChange: (index: number) => void;
};

export function ProfileHeader({ profile, avatar, background, friendsCount, friendsAvatars, tabs, onTabChange }: Props) {
  const { theme } = useTheme();
  const { user: authUser } = useAuth();
  const { chats, fetchFriendRequests, fetchFriends, isFriend, isReceiver, isSender } = useStore();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const { top } = useSafeAreaInsets();
  const paddingTop = Platform.OS === 'ios' ? top : (StatusBar.currentHeight || 20) + 10;

  const acceptFriendRequest = () => {
    apiFetchData({
      endpoint: API.friends.sendRequest,
      method: 'POST',
      body: {
        userOneId: authUser.id,
        isUserOneAccept: true,
        userTwoId: profile!.userId,
        isUserTwoAccept: isSender(profile!.userId) ? true : false,
      },
      token: authUser.token,
    })
      .then(fetchFriends)
      .then(fetchFriendRequests)
      .then(() => isSender(profile!.userId) && showToast('success', 'Пользователь добавлен в друзья'))
      .catch(() =>
        showToast(
          'error',
          isSender(profile!.userId) ? 'Не удалось принять запрос в друзья' : 'Не удалось отправить запрос в друзья'
        )
      );
  };

  const rejectFriendRequest = () => {
    apiFetchData({
      endpoint: API.friends.sendRequest,
      method: 'POST',
      body: {
        userOneId: authUser.id,
        isUserOneAccept: false,
        userTwoId: profile?.userId,
        isUserTwoAccept: false,
      },
      token: authUser.token,
    })
      .then(fetchFriends)
      .then(fetchFriendRequests)
      .catch(() => showToast('error', 'Не удалось отменить запрос в друзья'));
  };

  const goToChat = (friendId: number) => {
    const chat = chats.find((chat) => chat.userTwoId === friendId);
    if (chat) router.push({ pathname: '/chats/[chatId]', params: { chatId: chat.chatId } });
    else {
      router.push({ pathname: '/chats' });
      router.push({ pathname: '/chats/introductionModal', params: { friendId } });
    }
  };

  const getFriendButton = () => {
    if (!profile || profile.userId === authUser.id) return null;

    if (isFriend(profile.userId)) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.chatButton, { backgroundColor: theme.primary }]}
          onPress={() => goToChat(profile.userId)}
        >
          <ThemedText type="labelLarge" parentBackgroundColor={theme.primary}>
            Написать
          </ThemedText>
        </TouchableOpacity>
      );
    }

    if (isReceiver(profile.userId)) {
      return (
        <TouchableOpacity
          style={[styles.friendButton, { backgroundColor: Colors.lightBlue }]}
          onPress={rejectFriendRequest}
        >
          <Icon name="accept" color={Colors.blue} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={[styles.friendButton, { backgroundColor: theme.primary }]} onPress={acceptFriendRequest}>
        <Icon name="plus" parentBackgroundColor={theme.primary} />
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={background?.backgroundType === 'TYPE_IMAGE' ? { uri: background.backgroundImage } : undefined}
      style={styles.background}
      imageStyle={[
        styles.backgroundImage,
        {
          backgroundColor:
            background?.backgroundType === 'TYPE_COLOR' ? background.backgroundColor : theme.subBackground,
        },
      ]}
    >
      <View style={{ paddingTop }}>
        <View style={styles.headerWrapper}>
          <MaskedView
            style={styles.maskedView}
            maskElement={
              <View style={styles.maskWrapper}>
                <SvgXml xml={mask} />
              </View>
            }
          >
            <ThemedView style={[styles.avatarWrapper]}>
              {avatar ? <Image source={{ uri: avatar }} style={styles.avatar} /> : <Skeleton style={styles.avatar} />}
            </ThemedView>
          </MaskedView>
          <ThemedView style={[styles.info, { borderColor: theme.background }]}>
            {profile && (
              <>
                <ThemedText type="h2" style={styles.fullname} numberOfLines={1}>
                  {profile?.name + ' ' + profile?.surname}
                </ThemedText>
                <View style={styles.details}>
                  <ThemedText type="bodyLargeMedium" numberOfLines={1} style={styles.username}>
                    {profile.username || profile.email}
                  </ThemedText>
                  <Link asChild href={{ pathname: '/friends/[userId]', params: { userId: profile.userId } }}>
                    <TouchableOpacity style={styles.friends}>
                      {friendsAvatars && friendsAvatars.length > 0 && (
                        <View style={styles.friendsAvatars}>
                          {friendsAvatars.map((friendAvatar, index) =>
                            friendAvatar ? (
                              <Image
                                key={index}
                                source={{ uri: friendAvatar }}
                                style={[
                                  styles.friendAvatar,
                                  index > 0 && { marginLeft: -13 },
                                  { borderColor: theme.background },
                                ]}
                              />
                            ) : (
                              <Skeleton key={index} style={[styles.friendAvatar, { borderColor: theme.background }]} />
                            )
                          )}
                        </View>
                      )}
                      <ThemedText>
                        {formatCountedPhrase({
                          number: friendsCount || 0,
                          singular: 'друг',
                          few: 'друга',
                          many: 'друзей',
                        })}
                      </ThemedText>
                    </TouchableOpacity>
                  </Link>
                  {getFriendButton()}
                </View>
              </>
            )}
          </ThemedView>

          <ThemedView style={styles.tabs}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.tab, currentTabIndex === index && { backgroundColor: theme.secondary }]}
                onPress={() => {
                  setCurrentTabIndex(index);
                  onTabChange(index);
                }}
              >
                <ThemedText
                  type="bodyLargeMedium"
                  parentBackgroundColor={currentTabIndex === index ? theme.secondary : theme.background}
                >
                  {tab}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 40,
  },
  background: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    resizeMode: 'cover',
    marginTop: -300,
    marginHorizontal: -1,
  },
  headerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    width: '100%',
  },
  maskedView: {
    zIndex: 1,
  },
  maskWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatarWrapper: {
    alignItems: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginTop: 10,
    marginBottom: -5,
  },
  info: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 40,
    borderWidth: 1,
    minHeight: 105,
    maxWidth: '100%',
  },
  fullname: {
    textAlign: 'center',
  },
  details: {
    flexDirection: 'row',
    gap: 22,
    alignItems: 'center',
    marginTop: 10,
    maxWidth: '100%',
  },
  username: {
    flexShrink: 1,
  },
  friends: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  friendsAvatars: {
    flexDirection: 'row',
  },
  friendAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 40,
    padding: 5,
    marginTop: 15,
    width: '100%',
  },
  tab: {
    flex: 1,
    padding: 8,
    borderRadius: 40,
    alignItems: 'center',
  },
  friendButton: {
    padding: 13,
    borderRadius: 25,
  },
});
