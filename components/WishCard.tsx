import MaskedView from '@react-native-masked-view/masked-view';
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { ActionButton } from './ActionsButton';

const mask = `
<svg width="88" height="86" viewBox="0 0 88 86" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M28 30C28 14.1035 15.636 1.09479 0 0.0656128V0H88V86H87.7357C85.7801 71.3226 73.2123 60 58 60C41.4315 60 28 46.5685 28 30Z" fill="#0FFF63"/>
</svg>
`;

const MAX_ASPECT_RATIO = 1;

export type Props = {
  image: {
    uri: string;
    width?: number;
    height?: number;
  };
  name?: string;
  price?: number;
  currency?: string;
};

export function WishCard({ image, name, price, currency }: Props) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    calcImageAspectRatio();
  }, [image]);

  const calcImageAspectRatio = () => {
    if (!image.width || !image.height) {
      Image.getSize(image.uri, (width, height) => {
        setAspectRatio(width / height);
        // set width and height to store
      });
    } else {
      setAspectRatio(image.width / image.height);
    }
  };

  const handleActions = () => {
    console.log('Actions нажата!');
  };

  if (!aspectRatio) return null;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image.uri }}
        style={[styles.image, { aspectRatio: aspectRatio > MAX_ASPECT_RATIO ? MAX_ASPECT_RATIO : aspectRatio }]}
        resizeMode={aspectRatio > MAX_ASPECT_RATIO ? 'cover' : 'contain'}
      />

      <MaskedView style={styles.maskedView} maskElement={<SvgXml xml={mask} />}>
        <ThemedView style={styles.themedBlock} />
      </MaskedView>

      <View style={styles.actionButton}>
        <ActionButton actions={[{ label: 'Поделиться', onPress: () => console.log('Поделиться') }]} />
      </View>

      {name && (
        <View style={styles.info}>
          <ThemedText type="h3">{name}</ThemedText>
          <ThemedText type="bodyLarge" style={{ color: theme.subtext }}>
            {price} {currency}
          </ThemedText>
        </View>
      )}
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
});
