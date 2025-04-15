import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ImagePicker } from '@/components/ImagePicker';

import { Colors } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { TextInput } from '@/components/TextInput';

export default function WishModalScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [text, setText] = useState<string>(''); // Состояние для текста

  useEffect(() => {
    if (Boolean(params?.submit)) {
      submit();
      router.setParams({ submit: 'false' });
      router.back();
    }
  }, [params]);

  const submit = () => {};

  const onImagePicked = (uri: string) => {
    setImageUri(uri);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImagePicker onImagePicked={onImagePicked} />
      <View style={styles.fields}>
        <TextInput icon="star" placeholder={'Название'} onChangeValue={(value) => console.log(value)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  fields: {
    marginTop: 32,
    gap: 20,
  },
});
