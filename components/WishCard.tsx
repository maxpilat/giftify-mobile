import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { SvgXml } from 'react-native-svg';
import { ThemedView } from '@/components/ThemedView';
import { ActionButton } from './ActionsButton';
import Reanimated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Currency } from '@/models';

const mask = `
  <svg width="88" height="86" viewBox="0 0 88 86" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M28 30C28 14.1035 15.636 1.09479 0 0.0656128V0H88V86H87.7357C85.7801 71.3226 73.2123 60 58 60C41.4315 60 28 46.5685 28 30Z" fill="#0FFF63"/>
  </svg>
`;

const MAX_ASPECT_RATIO = 1;

type Props = {
  image: {
    uri: string;
    width?: number;
    height?: number;
  };
  name?: string;
  price?: number;
  currency?: Currency;
};

export function WishCard({ image, name, price, currency }: Props) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const opacity = useSharedValue(0);

  const { theme } = useTheme();

  useEffect(() => {
    calcImageAspectRatio();
  }, [image]);

  const calcImageAspectRatio = () => {
    if (!image.width || !image.height) {
      Image.getSize(image.uri, (width, height) => {
        setAspectRatio(width / height);
        opacity.value = withTiming(1, { duration: 500 });
      });
    } else {
      setAspectRatio(image.width / image.height);
      opacity.value = withTiming(1, { duration: 500 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!aspectRatio) return null;

  return (
    <View style={styles.container}>
      <Reanimated.Image
        source={{ uri: image.uri }}
        style={[
          styles.image,
          { aspectRatio: aspectRatio > MAX_ASPECT_RATIO ? MAX_ASPECT_RATIO : aspectRatio },
          animatedStyle,
        ]}
        resizeMode={aspectRatio > MAX_ASPECT_RATIO ? 'cover' : 'contain'}
      />

      {name && (
        <View style={styles.wishInfo}>
          <ThemedText type="h3">{name}</ThemedText>
          <ThemedText type="bodyLarge" style={{ color: theme.subtext }}>
            {price} {currency?.symbol}
          </ThemedText>
        </View>
      )}

      <MaskedView style={styles.maskedView} maskElement={<SvgXml xml={mask} />}>
        <ThemedView style={styles.themedBlock} />
      </MaskedView>

      <View style={styles.actionButton}>
        <ActionButton actions={[{ label: 'Поделиться', onPress: () => console.log('Поделиться') }]} />
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
