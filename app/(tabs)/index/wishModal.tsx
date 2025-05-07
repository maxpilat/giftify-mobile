import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ImagePicker } from '@/components/ImagePicker';
import { TextInput } from '@/components/TextInput';
import { Currency, WishType } from '@/models';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PlatformButton } from '@/components/PlatformButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/themes';
import { Icon } from '@/components/Icon';
import { Switch } from '@/components/Switch';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { base64ToBinaryArray } from '@/utils/convertImage';
import { apiFetchData } from '@/lib/api';

type SearchParams = {
  isSubmit?: 'true' | 'false';
  wishId?: string;
};

type SwitchState = {
  id: number;
  enabled: boolean;
};

export default function WishModalScreen() {
  const { user } = useAuth();
  const { isSubmit, wishId: wishIdParam } = useLocalSearchParams<SearchParams>();
  const { wishes, wishLists, fetchWishes, fetchWishLists } = useProfile();

  const [image, setImage] = useState<string>();
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>();
  const [link, setLink] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Record<'name' | 'link' | 'image', boolean>>({
    name: false,
    link: false,
    image: false,
  });
  const [switchStates, setSwitchStates] = useState<SwitchState[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    apiFetchData<Currency[]>({ endpoint: API.currencies.getCurrencies, token: user.token }).then((currencies) => {
      setCurrencies(currencies);
      if (!currency) setCurrency(currencies[0]);
    });
  }, []);

  useEffect(() => {
    setSwitchStates(() =>
      wishLists.map((wishList) => {
        if (wishIdParam) {
          const enabled = Boolean(wishList.wishes.find((wish) => wish.wishId === +wishIdParam));

          return {
            id: wishList.wishListId,
            enabled,
          };
        }

        return {
          id: wishList.wishListId,
          enabled: false,
        };
      })
    );
  }, [wishLists]);

  useEffect(() => {
    if (wishIdParam) {
      const wish = wishes.find((wish) => wish.wishId === +wishIdParam)!;
      setImage(wish.image);
      setName(wish.name);
      setPrice(wish.price ? wish.price.toString() : '0');
      wish.currency && setCurrency(wish.currency);
      setLink(wish.link || '');
      setDescription(wish.description || '');
    }
  }, [wishIdParam]);

  useEffect(() => {
    handleSubmit();
  }, [isSubmit]);

  const handleSubmit = async () => {
    if (isSubmit !== 'true') return;

    if (isValid()) {
      const payload = {
        wisherId: user.userId,
        wishType: 'TYPE_WISH' as WishType,
        name,
        description,
        price: +price,
        currencyId: currency?.currencyId,
        link,
      };

      const binaryImage = base64ToBinaryArray(image!);

      let wishId = wishIdParam ? +wishIdParam : null;

      if (wishId) {
        (payload as any).wishId = wishId;
        await apiFetchData({
          endpoint: API.wishes.update,
          method: 'PUT',
          token: user.token,
          body: { ...payload, image: binaryImage },
        });
      } else {
        (payload as any).wisherId = user.userId;
        wishId = await apiFetchData<number>({
          endpoint: API.wishes.create,
          method: 'POST',
          token: user.token,
          body: { ...payload, image: binaryImage },
        });
      }

      await Promise.all(
        switchStates.map((state) => {
          if (
            state.enabled &&
            !wishLists
              .find((wishList) => wishList.wishListId === state.id)
              ?.wishes.find((wish) => wish.wishId === wishId)
          ) {
            return apiFetchData({
              endpoint: API.wishes.addToWishList,
              method: 'POST',
              body: { wishId, wishListId: state.id },
              token: user.token,
            });
          } else {
            // Удалить желание из списка

            return Promise.resolve();
          }
        })
      );

      await Promise.all([fetchWishes(), fetchWishLists()]);

      router.back();
    }

    router.setParams({ isSubmit: 'false' });
  };

  const isValid = () => {
    const newErrors = {
      name: !name.trim(),
      link: !link.trim(),
      image: !image?.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
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
          initialImage={image}
          onImagePicked={async (image) => {
            setImage(image);
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
            type="options"
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
          onPress={() => router.push('../wishListModal')}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 32,
  },
  fields: {
    gap: 20,
  },
  addWishListButton: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: Colors.black,
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
