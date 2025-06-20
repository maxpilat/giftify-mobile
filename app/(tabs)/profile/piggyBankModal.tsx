import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ImagePicker } from '@/components/ImagePicker';
import { TextInput } from '@/components/TextInput';
import { Currency, WishType } from '@/models';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStore';
import { base64ToBinaryArray } from '@/utils/convertImage';
import { apiFetchData } from '@/lib/api';
import { showToast } from '@/utils/showToast';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';

type SearchParams = {
  piggyBankId?: string;
};

export default function WishModalScreen() {
  const { user } = useAuth();
  const { piggyBankId } = useLocalSearchParams<SearchParams>();
  const { piggyBanks, fetchPiggyBanks } = useStore();
  const { theme } = useTheme();

  const [image, setImage] = useState<string>();
  const [name, setName] = useState<string>('');
  const [deposit, setDeposit] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [description, setDescription] = useState<string>('');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [errors, setErrors] = useState<Record<'name' | 'image', boolean>>({
    name: false,
    image: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    apiFetchData<Currency[]>({ endpoint: API.currencies.getCurrencies, token: user.token }).then((currencies) => {
      setCurrencies(currencies);
      if (!currency) setCurrency(currencies[0]);
    });
  }, []);

  useEffect(() => {
    if (piggyBankId) {
      const piggyBank = piggyBanks.find((piggyBank) => piggyBank.wishId === +piggyBankId)!;
      setImage(piggyBank.image!);
      setName(piggyBank.name);
      setDeposit(piggyBank.deposit ? piggyBank.deposit.toString() : '0');
      setPrice(piggyBank.price ? piggyBank.price.toString() : '0');
      piggyBank.currency && setCurrency(piggyBank.currency);
      setDescription(piggyBank.description || '');
    }
  }, [piggyBankId]);

  const handleSubmit = async () => {
    if (!isValid()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve));

    const payload = {
      wisherId: user.id,
      wishType: 'TYPE_PIGGY_BANK' as WishType,
      name,
      description,
      deposit: +deposit,
      price: +price,
      currencyId: currency?.currencyId,
    };

    const buffer = base64ToBinaryArray(image!);

    try {
      if (piggyBankId) {
        (payload as any).wishId = +piggyBankId;
        await apiFetchData({
          endpoint: API.wishes.update,
          method: 'PUT',
          token: user.token,
          body: { ...payload, image: buffer },
        });
      } else {
        (payload as any).wisherId = user.id;
        await apiFetchData({
          endpoint: API.wishes.create,
          method: 'POST',
          token: user.token,
          body: { ...payload, image: buffer },
        });
      }

      await fetchPiggyBanks();
      router.back();

      showToast('success', piggyBankId ? 'Копилка обновлена' : 'Копилка добавлена');
    } catch {
      showToast('error', piggyBankId ? 'Не удалось обновить копилку' : 'Не удалось добавить копилку');
    } finally {
      setIsSubmitting(false);
    }
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
    <>
      <Stack.Screen
        options={{
          headerRight: () =>
            isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <TouchableOpacity onPress={handleSubmit}>
                <ThemedText style={{ color: theme.primary }}>Готово</ThemedText>
              </TouchableOpacity>
            ),
        }}
      />

      <KeyboardAwareScrollView extraScrollHeight={80} enableOnAndroid contentContainerStyle={styles.container}>
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
            inputStyle={{ height: 96 }}
          />
          <TextInput
            icon="ticketStart"
            placeholder="Сумма, которая есть сейчас"
            keyboardType="numeric"
            inputMode="decimal"
            value={deposit}
            onChangeText={setDeposit}
            type="options"
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
            type="options"
            options={currencies}
            getDisplayedValue={(currency) => currency.symbol}
            getOptionLabel={(currency) => `${currency.symbol} - ${currency.transcription}`}
            onSelectOption={setCurrency}
          />
        </View>
      </KeyboardAwareScrollView>
    </>
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
