import React, { useState } from 'react';
import { StyleSheet, ImageBackground, View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MaskedView from '@react-native-masked-view/masked-view';
import { SvgXml } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const mask = `
  <svg width="280" height="130" viewBox="100 -0.5 280 161" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M264 0C219.817 0 184 35.8172 184 80V92C184 119.614 161.614 142 134 142H50C22.3858 142 0 164.386 0 192V248C0 275.614 22.3858 298 50 298H478C505.614 298 528 275.614 528 248V192C528 164.386 505.614 142 478 142H394C366.386 142 344 119.614 344 92V80C344 35.8172 308.183 0 264 0Z" fill="black"/>
  </svg>
`;

export const HEADER_HEIGHT = 360;

type Props = {
  avatar?: string;
  background?: string;
  fullname?: string;
  username?: string;
  friendsAvatars?: (string | undefined)[];
  friendsCount?: number;
  tabs: string[];
  onTabChange: (index: number) => void;
};

export function ProfileHeader({
  fullname,
  username,
  avatar,
  background,
  friendsCount,
  friendsAvatars,
  tabs,
  onTabChange,
}: Props) {
  const { theme } = useTheme();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const getTabTextAnimatedStyle = (index: number) =>
    useAnimatedStyle(() => ({
      color: withTiming(currentTabIndex === index ? theme.background : theme.text, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      }),
    }));

  return (
    <ImageBackground
      source={background ? { uri: background } : require('@/assets/images/bg-01.jpeg')}
      style={styles.background}
      imageStyle={[styles.backgroundImage, { backgroundColor: theme.tabBarBorder }]}
    >
      <SafeAreaView>
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
              <Image
                source={avatar ? { uri: avatar } : require('@/assets/images/avatar.png')}
                style={[styles.avatar, { backgroundColor: theme.tabBarBorder }]}
              />
            </ThemedView>
          </MaskedView>
          <ThemedView style={[styles.info, { borderColor: theme.background }]}>
            <ThemedText type="h2" style={styles.fullname} numberOfLines={1}>
              {fullname || ''}
            </ThemedText>
            <View style={styles.details}>
              {username && <ThemedText type="bodyLargeMedium">{username || ''}</ThemedText>}
              <View style={styles.friends}>
                <View style={styles.friendsAvatars}>
                  {friendsAvatars?.map((friendAvatar, index) => (
                    <Image
                      key={index}
                      source={friendAvatar ? { uri: friendAvatar } : require('../assets/images/avatar.png')}
                      style={[styles.friendAvatar, index > 0 && { marginLeft: -13 }, { borderColor: theme.background }]}
                    />
                  ))}
                </View>
                <ThemedText>{friendsCount || 0} друзей</ThemedText>
              </View>
            </View>
          </ThemedView>

          <ThemedView style={[styles.tabs]}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.tab, currentTabIndex === index && { backgroundColor: theme.secondary }]}
                activeOpacity={0.7}
                onPress={() => {
                  setCurrentTabIndex(index);
                  onTabChange(index);
                }}
              >
                <ThemedText type="bodyLargeMedium" style={[getTabTextAnimatedStyle(index)]}>
                  {tab}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
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
    flex: 1,
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
  },
  fullname: {
    textAlign: 'center',
  },
  details: {
    flexDirection: 'row',
    gap: 22,
    alignItems: 'center',
    marginTop: 10,
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
});
