import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { SvgXml } from 'react-native-svg';
import { ThemedView } from '@/components/ThemedView';
import { Action, ActionButton } from '@/components/ActionsButton';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Currency } from '@/models';

const mask = `
  <svg width="88" height="86" viewBox="0 0 88 86" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M28 30C28 14.1035 15.636 1.09479 0 0.0656128V0H88V86H87.7357C85.7801 71.3226 73.2123 60 58 60C41.4315 60 28 46.5685 28 30Z" fill="#0FFF63"/>
  </svg>
`;

const screenWidth = Dimensions.get('window').width;

type Props = {
  image?: string;
  name?: string;
  price?: number;
  currency?: Currency;
  aspectRatio?: number;
  actions?: Action[];
};

export function WishCard({ image, name, price, currency, aspectRatio, actions = [] }: Props) {
  const { theme } = useTheme();

  const [computedAspectRatio, setComputedAspectRatio] = useState<number>(aspectRatio || 1);

  const opacity = useSharedValue(0);

  useEffect(() => {
    if (image) {
      if (!aspectRatio) {
        Image.getSize(image, (width, height) => {
          setComputedAspectRatio(Math.min(width / height, 1));
        });
      }

      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [image]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: image }}
        style={[styles.image, { aspectRatio: computedAspectRatio }, animatedStyle]}
        resizeMode={'cover'}
      />

      {name && (
        <View style={styles.wishInfo}>
          <ThemedText type="h3">{name}</ThemedText>
          {price && (
            <ThemedText type="bodyLarge" style={{ color: theme.subtext }}>
              {price} {currency?.symbol}
            </ThemedText>
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
  image: {
    borderRadius: 25,
    minHeight: screenWidth / 2 - 40,
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
  info: {
    marginTop: 5,
  },
  wish: {
    marginBottom: 24,
  },
  wishInfo: {
    marginTop: 10,
  },
});
