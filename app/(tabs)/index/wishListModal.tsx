import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TextInput } from '@/components/TextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useProfile } from '@/hooks/useProfile';
import { apiFetch } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';

type SearchParams = {
  submit?: 'true' | 'false';
  wishListId?: string;
};

export default function WishListModalScreen() {
  const { user, token } = useAuth();
  const { submit, wishListId } = useLocalSearchParams<SearchParams>();
  const { wishLists, fetchWishLists } = useProfile();

  const [name, setName] = useState<string>('');
  const [errors, setErrors] = useState<Record<'name', boolean>>({ name: false });

  useEffect(() => {
    if (wishListId) {
      const wishList = wishLists.find((wishList) => wishList.wishListId === +wishList)!;
      setName(wishList.name);
    }
  }, [wishListId]);

  useEffect(() => {
    handleSubmit();
  }, [submit]);

  const handleSubmit = async () => {
    if (submit !== 'true') return;

    if (isValid()) {
      if (wishListId) {
        await apiFetch({
          endpoint: API.wishLists.update,
          method: 'PUT',
          token,
          body: { wishListId: +wishListId, name },
        });
      } else {
        await apiFetch({
          endpoint: API.wishLists.create,
          method: 'POST',
          token,
          body: { creatorId: user.userId, name },
        });
      }

      await fetchWishLists();
      router.back();
    }

    router.setParams({ submit: 'false' });
  };

  const isValid = () => {
    const newErrors = {
      name: name.trim() === '',
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
