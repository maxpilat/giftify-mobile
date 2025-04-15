import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

export default function WishListModalScreen() {
  const params = useLocalSearchParams();

  useEffect(() => {
    if (Boolean(params?.submit)) {
      handleFormSubmit();
      router.setParams({ submit: 'false' });
      // if valid
      router.back();
    }
  }, [params]);

  const handleFormSubmit = () => {
    console.log('submit');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText>Wish List Modal</ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
});
