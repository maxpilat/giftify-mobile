import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TextInput } from '@/components/TextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type SearchParams = {
  submit?: 'true' | 'false';
  wishListId?: string;
};

export default function WishListModalScreen() {
  const params = useLocalSearchParams<SearchParams>();

  const [name, setName] = useState<string>('');
  const [errors, setErrors] = useState<Record<'name', boolean>>({ name: false });

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
      name: name.trim() === '',
    };
    setErrors(errors);
    return !errors.name;
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
