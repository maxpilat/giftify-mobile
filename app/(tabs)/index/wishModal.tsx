import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ImagePicker } from '@/components/ImagePicker';
import { TextInput } from '@/components/TextInput';
import { Currency } from '@/models';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const currencies: Currency[] = [
  { currencyId: 0, symbol: '$', transcription: 'USD' },
  { currencyId: 1, symbol: '₽', transcription: 'RUB' },
  { currencyId: 2, symbol: 'Br', transcription: 'BYN' },
];

type SearchParams = {
  submit?: 'true' | 'false';
  wishId?: string;
}

export default function WishModalScreen() {
  const params = useLocalSearchParams<SearchParams>();

  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  const [link, setLink] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (params?.submit === 'true') {
      submit();
      router.setParams({ submit: 'false' });
      router.back();
    }
  }, [params]);

  const submit = () => { };

  return (
    <KeyboardAwareScrollView extraScrollHeight={80} enableOnAndroid keyboardOpeningTime={0}>
      <ScrollView contentContainerStyle={styles.container}>
        <ImagePicker onImagePicked={setImage} />
        <View style={styles.fields}>
          <TextInput
            icon='star'
            placeholder='Название'
            value={name}
            onChangeText={setName}
          />
          <TextInput
            icon="ticketStart"
            placeholder='Цена'
            keyboardType='numeric'
            inputMode="decimal"
            value={price}
            onChangeText={setPrice}
            options={currencies}
            getDisplayedValue={(currency) => currency.symbol}
            getOptionLabel={(currency) => `${currency.symbol} - ${currency.transcription}`}
            onSelectOption={setCurrency}
          />
          <TextInput
            icon="out"
            placeholder="Ссылка"
            value={link}
            onChangeText={setLink}
            keyboardType="url"
            inputMode="url"
            autoCapitalize="none"
          />
          <TextInput
            icon="edit"
            placeholder="Почему вы хотите это?"
            value={description}
            onChangeText={setDescription}
            multiline={true}
          />
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
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
