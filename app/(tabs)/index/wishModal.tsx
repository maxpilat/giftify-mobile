import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ImagePicker } from '@/components/ImagePicker';
import { TextInput } from '@/components/TextInput';
import { Currency, WishList } from '@/models';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PlatformButton } from '@/components/PlatformButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/themes';
import { Icon } from '@/components/Icon';
import { Switch } from '@/components/Switch';

const currencies: Currency[] = [
  { currencyId: 0, symbol: '$', transcription: 'USD' },
  { currencyId: 1, symbol: '₽', transcription: 'RUB' },
  { currencyId: 2, symbol: 'Br', transcription: 'BYN' },
];

const wishLists: WishList[] = [
  {
    wishListId: 0,
    name: 'Новоселье',
    wishes: [],
  },
  {
    wishListId: 1,
    name: 'День рождения',
    wishes: [],
  },
];

type SearchParams = {
  submit?: 'true' | 'false';
  wishId?: string;
};

type SwitchState = {
  id: number;
  enabled: boolean;
};

export default function WishModalScreen() {
  const params = useLocalSearchParams<SearchParams>();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  const [link, setLink] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Record<'name' | 'link' | 'imageUri', boolean>>({ name: false, link: false, imageUri: false });
  const [switchStates, setSwitchStates] = useState<SwitchState[]>(
    wishLists.map((wishList) => ({
      id: wishList.wishListId,
      enabled: false,
    }))
  );

  useEffect(() => {
    if (params?.submit !== 'true') return;

    if (isValid()) {
      submit();
      router.back();
    }

    router.setParams({ submit: 'false' });
  }, [params]);


  const submit = () => { };

  const isValid = () => {
    const errors = {
      name: !name.trim(),
      link: !link.trim(),
      imageUri: !imageUri?.trim()
    };
    setErrors(errors);
    return !errors.name && !errors.link && !errors.imageUri;
  };

  const toggleSwitch = (id: number) => {
    setSwitchStates((prevState) =>
      prevState.map((switchState) =>
        switchState.id === id ? { ...switchState, enabled: !switchState.enabled } : switchState
      )
    );
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
          valid={!errors.imageUri}
          onImagePicked={(imageUri) => {
            setImageUri(imageUri);
            setErrors((prev) => ({ ...prev, name: false }))
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
            icon="ticketStart"
            placeholder="Цена"
            keyboardType="numeric"
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
            valid={!errors.link}
            onChangeText={(value) => {
              setLink(value);
              setErrors((prev) => ({ ...prev, link: false }));
            }}
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

        <Link asChild href={'./wishListModal'}>
          <PlatformButton style={styles.addWishListButton} hapticFeedback='none'>
            <ThemedText type="bodyLargeMedium" style={styles.addWishListButtonText}>
              Новый список
            </ThemedText>
            <Icon name="plus" />
          </PlatformButton>
        </Link>

        <View style={styles.wishListsContainer}>
          {wishLists.map((wishList) => {
            const switchState = switchStates.find((s) => s.id === wishList.wishListId);
            return (
              <View key={wishList.wishListId} style={styles.wishList}>
                <ThemedText type="h5">{wishList.name}</ThemedText>
                <Switch value={switchState?.enabled || false} onValueChange={() => toggleSwitch(wishList.wishListId)} />
              </View>
            );
          })}
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
  addWishListButton: {
    flexDirection: 'row',
    gap: 8,
  },
  addWishListButtonText: {
    color: Colors.white,
  },
  wishListsContainer: {
    gap: 20,
  },
  wishList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
