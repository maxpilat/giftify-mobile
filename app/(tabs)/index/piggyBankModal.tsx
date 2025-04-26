import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ImagePicker } from '@/components/ImagePicker';
import { TextInput } from '@/components/TextInput';
import { Currency } from '@/models';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { base64ToArrayBuffer } from '@/utils/imageConverter';
import { apiFetchData } from '@/lib/api';

type SearchParams = {
  submit?: 'true' | 'false';
  wishId?: string;
};

export default function WishModalScreen() {
  const { user } = useAuth();
  const { submit, wishId } = useLocalSearchParams<SearchParams>();
  const { piggyBanks, fetchPiggyBanks } = useProfile();

  const [image, setImage] = useState<string>();
  const [name, setName] = useState<string>('');
  const [deposit, setDeposit] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Record<'name' | 'image', boolean>>({
    name: false,
    image: false,
  });

  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    apiFetchData<Currency[]>({ endpoint: API.currencies.getCurrencies, token: user.token }).then((currencies) => {
      setCurrencies(currencies);
      if (!currency) setCurrency(currencies[0]);
    });
  }, []);

  useEffect(() => {
    if (wishId) {
      const piggyBank = piggyBanks.find((piggyBank) => piggyBank.wishId === +wishId)!;
      setImage(piggyBank.image!);
      setName(piggyBank.name);
      setDeposit(piggyBank.deposit ? piggyBank.deposit.toString() : '0');
      setPrice(piggyBank.price ? piggyBank.price.toString() : '0');
      piggyBank.currency && setCurrency(piggyBank.currency);
      setDescription(piggyBank.description || '');
    }
  }, [wishId]);

  useEffect(() => {
    handleSubmit();
  }, [submit]);

  const handleSubmit = async () => {
    if (submit !== 'true') return;

    if (isValid()) {
      const payload = {
        wishType: 'TYPE_PIGGY_BANK',
        name,
        description,
        deposit: +deposit,
        price: +price,
        currency,
      };

      const buffer = base64ToArrayBuffer(image!);
      console.log(buffer);

      if (wishId) {
        (payload as any).wishId = +wishId;
        await apiFetchData({
          endpoint: API.wishes.update,
          method: 'PUT',
          token: user.token,
          body: { ...payload, image: buffer },
        });
      } else {
        (payload as any).wisherId = user.userId;
        await apiFetchData({
          endpoint: API.wishes.create,
          method: 'POST',
          token: user.token,
          body: { ...payload, image: buffer },
        });
      }

      await fetchPiggyBanks();
      router.back();
    }

    router.setParams({ submit: 'false' });
  };

  const isValid = () => {
    const newErrors = {
      name: !name.trim(),
      image: !image?.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={80}
      keyboardOpeningTime={0}
      enableOnAndroid
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ImagePicker
          valid={!errors.image}
          initialImage={image}
          onImagePicked={(imageUri) => {
            setImage(imageUri);
            setErrors((prev) => ({ ...prev, name: false }));
          }}
        />
        <View style={styles.fields}>
          <TextInput
            icon="star"
            placeholder="Название"
            value={name}
            valid={!errors.name}
            onChangeText={(value) => {
              setName(value);
              setErrors((prev) => ({ ...prev, name: false }));
            }}
          />
          <TextInput
            icon="edit"
            placeholder="Почему вы копите на это?"
            value={description}
            onChangeText={setDescription}
            multiline={true}
          />
          <TextInput
            icon="ticketStart"
            placeholder="Сумма, которая есть сейчас"
            keyboardType="numeric"
            inputMode="decimal"
            value={deposit}
            onChangeText={setDeposit}
            mode="options"
            options={currencies}
            getDisplayedValue={(currency) => currency.symbol}
            getOptionLabel={(currency) => `${currency.symbol} - ${currency.transcription}`}
            onSelectOption={setCurrency}
          />
          <TextInput
            icon="ticketStart"
            placeholder="Полная стоимость"
            keyboardType="numeric"
            inputMode="decimal"
            value={price}
            onChangeText={setPrice}
            mode="options"
            options={currencies}
            getDisplayedValue={(currency) => currency.symbol}
            getOptionLabel={(currency) => `${currency.symbol} - ${currency.transcription}`}
            onSelectOption={setCurrency}
          />
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 32,
  },
  fields: {
    gap: 20,
  },
});
