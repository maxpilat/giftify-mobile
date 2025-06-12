import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { TextInput } from '@/components/TextInput';
import { Currency } from '@/models';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStore';
import { apiFetchData } from '@/lib/api';
import { ThemedText } from '@/components/ThemedText';
import { showToast } from '@/utils/showToast';
import { useTheme } from '@/hooks/useTheme';

type SearchParams = {
  piggyBankId: string;
};

export default function PiggyBankDepositModalScreen() {
  const { user } = useAuth();
  const { piggyBankId } = useLocalSearchParams<SearchParams>();
  const { piggyBanks, fetchPiggyBanks } = useStore();
  const { theme } = useTheme();

  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [errors, setErrors] = useState<Record<'amount', boolean>>({
    amount: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (piggyBankId) {
      const piggyBank = piggyBanks.find((piggyBank) => piggyBank.wishId === +piggyBankId)!;
      piggyBank.currency && setCurrency(piggyBank.currency);
    }
  }, [piggyBankId]);

  const handleSubmit = () => {
    if (!isValid()) return;

    setIsSubmitting(true);

    apiFetchData({
      endpoint: API.wishes.deposit,
      method: 'POST',
      token: user.token,
      body: { piggyBankId: +piggyBankId, amount },
    })
      .then(fetchPiggyBanks)
      .then(() => {
        router.back();
        showToast('success', 'Копилка пополнена');
      })
      .catch(() => showToast('error', 'Не удалось пополнить копилку'))
      .finally(() => setIsSubmitting(false));
  };

  const isValid = () => {
    const newErrors = {
      amount: !amount,
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
      <KeyboardAwareScrollView extraScrollHeight={80} enableOnAndroid contentContainerStyle={{ paddingBottom: 80 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <ThemedText type="h2">Сколько вы хотите положить в копилку?</ThemedText>
          <View style={styles.fields}>
            <TextInput
              icon="ticketStart"
              placeholder="Сумма"
              keyboardType="numeric"
              inputMode="decimal"
              value={amount}
              valid={!errors.amount}
              onChangeText={setAmount}
              type="options"
              options={[currency]}
              getDisplayedValue={(currency) => currency?.symbol || ''}
              getOptionLabel={(currency) => `${currency?.symbol} - ${currency?.transcription}`}
              onSelectOption={setCurrency}
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
  },
  fields: {
    gap: 20,
  },
});
