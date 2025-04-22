import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ImagePicker } from '@/components/ImagePicker';
import { TextInput } from '@/components/TextInput';
import { Currency } from '@/models';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PlatformButton } from '@/components/PlatformButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/themes';
import { Icon } from '@/components/Icon';
import { Switch } from '@/components/Switch';
import { apiFetch } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { base64ToArrayBuffer } from '@/utils/imageConverter';
import { EncodingType, readAsStringAsync } from 'expo-file-system';

type SearchParams = {
  submit?: 'true' | 'false';
  wishId?: string;
};

type SwitchState = {
  id: number;
  enabled: boolean;
};

export default function WishModalScreen() {
  const { user, token } = useAuth();
  const { submit, wishId } = useLocalSearchParams<SearchParams>();
  const { wishes, wishLists, fetchWishes } = useProfile();

  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [link, setLink] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Record<'name' | 'link' | 'image', boolean>>({
    name: false,
    link: false,
    image: false,
  });
  const [switchStates, setSwitchStates] = useState<SwitchState[]>(
    wishLists.map((wishList) => ({
      id: wishList.wishListId,
      enabled: false,
    }))
  );
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    apiFetch({ endpoint: API.currencies.getCurrencies, token }).then((currencies) => {
      setCurrencies(currencies);
      if (!currency) setCurrency(currencies[0]);
    });
  }, []);

  useEffect(() => {
    if (wishId) {
      const wish = wishes.find((wish) => wish.wishId === +wishId)!;
      setImage(wish.image!);
      setName(wish.name);
      setPrice(wish.price ? wish.price.toString() : '0');
      wish.currency && setCurrency(wish.currency);
      setLink(wish.link || '');
      setDescription(wish.description || '');
    }
  }, [wishId]);

  useEffect(() => {
    handleSubmit();
  }, [submit]);

  const handleSubmit = async () => {
    if (submit !== 'true') return;

    if (isValid()) {
      const payload = {
        wishType: 'TYPE_WISH',
        name,
        description,
        price: +price,
        currency,
        link,
      };

      const base64 = await readAsStringAsync(image!, { encoding: EncodingType.Base64 });
      const buffer = new Uint8Array(base64ToArrayBuffer(base64));
      console.log(buffer);

      if (wishId) {
        (payload as any).wishId = +wishId;
        await apiFetch({
          endpoint: API.wishes.update,
          method: 'PUT',
          token,
          body: { ...payload, image: buffer },
        });
      } else {
        (payload as any).wisherId = user.userId;
        await apiFetch({
          endpoint: API.wishes.create,
          method: 'POST',
          token,
          body: { ...payload, image: buffer },
        });
      }

      await fetchWishes();
      router.back();
    }

    router.setParams({ submit: 'false' });
  };

  const isValid = () => {
    const errors = {
      name: !name.trim(),
      link: !link.trim(),
      image: !image?.trim(),
    };
    setErrors(errors);
    return !errors.name && !errors.link && !errors.image;
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
          valid={!errors.image}
          value={image || undefined}
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
            icon="ticketStart"
            placeholder="Цена"
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

        <PlatformButton
          style={styles.addWishListButton}
          hapticFeedback="none"
          onPress={() => router.push('./wishListModal')}
        >
          <ThemedText type="bodyLargeMedium" style={styles.addWishListButtonText}>
            Новый список
          </ThemedText>
          <Icon name="plus" />
        </PlatformButton>

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
