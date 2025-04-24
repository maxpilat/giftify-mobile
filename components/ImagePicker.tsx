import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { EncodingType, readAsStringAsync } from 'expo-file-system';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@/components/Icon';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/themes';
import { uriToBase64 } from '@/utils/imageConverter';

type Props = {
  onImagePicked: (uri: string) => void;
  valid?: boolean;
  initialImage?: string;
};

export function ImagePicker({ onImagePicked, valid, initialImage }: Props) {
  const { theme } = useTheme();

  const [image, setImage] = useState(initialImage);

  const pickImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      const base64 = await uriToBase64(uri);

      setImage(base64);
      onImagePicked(base64);
    }
  };

  return image ? (
    <Pressable onPress={pickImage}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.imagePreview} />
        <View style={styles.overlay}>
          <Icon name="upload" color={Colors.white} size={40} />
        </View>
      </View>
    </Pressable>
  ) : (
    <Pressable style={[styles.uploadBox, { borderColor: valid ? theme.primary : Colors.red }]} onPress={pickImage}>
      <Icon name="upload" color={valid ? theme.primary : Colors.red} size={40} />
      <ThemedText type="bodySmall" style={styles.label}>
        <ThemedText type="labelLarge">Нажмите, чтобы загрузить </ThemedText>фотографию
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  uploadBox: {
    height: 200,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    textAlign: 'center',
  },
  imageContainer: {
    width: 240,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
