import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { TextInput } from '@/components/TextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useStore } from '@/hooks/useStore';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { apiFetchData } from '@/lib/api';
import { showToast } from '@/utils/showToast';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';

type SearchParams = {
  wishListId?: string;
};

export default function WishListModalScreen() {
  const { user } = useAuth();
  const { wishListId } = useLocalSearchParams<SearchParams>();
  const { wishLists, fetchWishLists } = useStore();
  const { theme } = useTheme();

  const [name, setName] = useState<string>('');
  const [errors, setErrors] = useState<Record<'name', boolean>>({ name: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (wishListId) {
      const wishList = wishLists.find((wishList) => wishList.wishListId === +wishListId)!;
      setName(wishList.name);
    }
  }, [wishListId]);

  const handleSubmit = async () => {
    if (!isValid()) return;

    setIsSubmitting(true);

    try {
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
          body: { creatorId: user.id, name },
        });
      }

      await fetchWishLists();
      router.back();
      showToast('success', wishListId ? 'Список обновлён' : 'Список добавлен');
    } catch {
      showToast('error', wishListId ? 'Не удалось обновить список' : 'Не удалось добавить список');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = () => {
    const newErrors = {
      name: !name.trim(),
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

      <KeyboardAwareScrollView enableOnAndroid contentContainerStyle={styles.container}>
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
