import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { SvgXml } from 'react-native-svg';
import { ThemedView } from '@/components/ThemedView';
import { Action, ActionButton } from '@/components/ActionsButton';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Wish } from '@/models';
import { getDaysUntilBookingExpires } from '@/utils/getDaysUntil';
import { Colors } from '@/constants/themes';
import { Icon } from '@/components/Icon';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const mask = `
  <svg width="88" height="86" viewBox="0 0 88 86" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M28 30C28 14.1035 15.636 1.09479 0 0.0656128V0H88V86H87.7357C85.7801 71.3226 73.2123 60 58 60C41.4315 60 28 46.5685 28 30Z" fill="#0FFF63"/>
  </svg>
`;

const screenWidth = Dimensions.get('window').width;

type Props = {
  wish: Wish;
  imageAspectRatio?: number;
  actions?: Action[];
  showInfo?: boolean;
  showBooking?: boolean;
  booker?: {
    booked: string;
    avatar?: string;
  };
  wisher?: {
    name: string;
    surname: string;
    avatar?: string;
  };
};

export function WishCard({
  wish,
  imageAspectRatio,
  actions = [],
  showInfo = true,
  booker,
  wisher,
  showBooking = booker || wisher ? true : false,
}: Props) {
  const { theme } = useTheme();

  const [computedAspectRatio, setComputedAspectRatio] = useState<number | null>(imageAspectRatio || null);

  useEffect(() => {
    if (wish.image) {
      if (!imageAspectRatio) {
        Image.getSize(wish.image, (width, height) => {
          setComputedAspectRatio(Math.min(width / height, 1));
        });
      }
    }
  }, [wish.image]);

  const opacity = useSharedValue(0);

  useEffect(() => {
    if (computedAspectRatio) {
      requestAnimationFrame(() => {
        opacity.value = withTiming(1, {
          duration: 600,
          easing: Easing.out(Easing.ease),
        });
      });
    }
  }, [computedAspectRatio]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer]}>
        {wish.image && (
          <>
            {booker && (
              <View style={styles.imageOverlay}>
                <Image style={styles.bookerAvatar} source={{ uri: booker.avatar }} />
                <ThemedText type="labelLarge" style={styles.bookingLabel}>
                  Бронь снимется через {getDaysUntilBookingExpires(booker.booked)} дней
                </ThemedText>
              </View>
            )}
            {showBooking && !booker && !wisher && (
              <View style={styles.imageOverlay}>
                <Icon name={'lock'} color={Colors.white} size={50} />
                <ThemedText type="labelLarge" style={styles.bookingLabel}>
                  Кто-то уже забронировал желание
                </ThemedText>
              </View>
            )}
          </>
        )}
        {computedAspectRatio && (
          <Animated.Image
            source={{ uri: wish.image }}
            style={[styles.image, { aspectRatio: computedAspectRatio }, animatedContainerStyle]}
            resizeMode={'cover'}
          />
        )}
      </View>

      {showInfo && (
        <View style={styles.wishInfo}>
          <ThemedText type="h3">{wish.name}</ThemedText>
          {!!wish.price && (
            <ThemedText type="bodyLarge" style={{ color: theme.subtext }}>
              {wish.price} {wish.currency?.transcription}
            </ThemedText>
          )}
          {wisher && (
            <View style={styles.wisherContainer}>
              <Image style={styles.wisherAvatar} source={{ uri: wisher.avatar }} />
              <ThemedText type="labelLarge">
                {wisher.name} {wisher.surname}
              </ThemedText>
            </View>
          )}
        </View>
      )}

      <MaskedView style={styles.maskedView} maskElement={<SvgXml xml={mask} />}>
        <ThemedView style={styles.themedBlock} />
      </MaskedView>

      <View style={styles.actionButton}>
        <ActionButton actions={actions} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  imageContainer: {
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 25,
    minHeight: screenWidth / 2 - 40,
  },
  imageOverlay: {
    position: 'absolute',
    height: '100%',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: 'rgba(17, 19, 24, 0.6)',
    gap: 5,
  },
  bookerAvatar: {
    width: 50,
    height: 50,
  },
  bookingLabel: {
    textAlign: 'center',
    color: Colors.white,
  },

  image: {
    // minHeight: screenWidth / 2 - 40,
  },
  maskedView: {
    width: 88,
    height: 88,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  themedBlock: {
    flex: 1,
  },
  actionButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  wish: {
    marginBottom: 24,
  },
  wishInfo: {
    marginTop: 10,
    gap: 4,
  },
  wisherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wisherAvatar: {
    width: 32,
    height: 32,
  },
});
