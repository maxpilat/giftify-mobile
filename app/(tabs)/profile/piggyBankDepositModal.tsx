import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TextInput } from '@/components/TextInput';
import { Currency } from '@/models';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStore';
import { apiFetchData } from '@/lib/api';
import { ThemedText } from '@/components/ThemedText';
import { showToast } from '@/utils/showToast';

type SearchParams = {
  isSubmit?: 'true' | 'false';
  piggyBankId: string;
};

export default function PiggyBankDepositModalScreen() {
  const { user } = useAuth();
  const { isSubmit, piggyBankId } = useLocalSearchParams<SearchParams>();
  const { piggyBanks, fetchPiggyBanks } = useStore();

  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [errors, setErrors] = useState<Record<'amount', boolean>>({
    amount: false,
  });

  useEffect(() => {
    if (piggyBankId) {
      const piggyBank = piggyBanks.find((piggyBank) => piggyBank.wishId === +piggyBankId)!;
      piggyBank.currency && setCurrency(piggyBank.currency);
    }
  }, [piggyBankId]);

  useEffect(() => {
    handleSubmit();
  }, [isSubmit]);

  const handleSubmit = () => {
    if (isSubmit !== 'true') return;

    if (isValid()) {
      apiFetchData({
        endpoint: API.wishes.deposit,
        method: 'POST',
        token: user.token,
        body: { piggyBankId: +piggyBankId, amount },
      })
        .then(() => {})
        .then(() => showToast('success', 'Копилка пополнена'))
        .catch(() => showToast('error', 'Не удалось пополнить копилку'));

      router.back();
    }

    router.setParams({ isSubmit: 'false' });
  };

  const isValid = () => {
    const newErrors = {
      amount: !amount,
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
