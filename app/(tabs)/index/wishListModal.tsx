import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TextInput } from '@/components/TextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useProfile } from '@/hooks/useProfile';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { apiFetchData } from '@/lib/api';

type SearchParams = {
  isSubmit?: 'true' | 'false';
  wishListId?: string;
};

export default function WishListModalScreen() {
  const { user } = useAuth();
  const { isSubmit, wishListId } = useLocalSearchParams<SearchParams>();
  const { wishLists, fetchWishLists } = useProfile();

  const [name, setName] = useState<string>('');
  const [errors, setErrors] = useState<Record<'name', boolean>>({ name: false });

  useEffect(() => {
    if (wishListId) {
      const wishList = wishLists.find((wishList) => wishList.wishListId === +wishListId)!;
      setName(wishList.name);
    }
  }, [wishListId]);

  useEffect(() => {
    handleSubmit();
  }, [isSubmit]);

  const handleSubmit = async () => {
    if (isSubmit !== 'true') return;

    if (isValid()) {
      if (wishListId) {
        await apiFetchData({
          endpoint: API.wishLists.update,
          method: 'PUT',
          token: user.token,
          body: { wishListId: +wishListId, name },
        });
      } else {
        await apiFetchData({
          endpoint: API.wishLists.create,
          method: 'POST',
          token: user.token,
          body: { creatorId: user.userId, name },
        });
      }

      await fetchWishLists();
      router.back();
    }

    router.setParams({ isSubmit: 'false' });
  };

  const isValid = () => {
    const newErrors = {
      name: !name.trim(),
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
