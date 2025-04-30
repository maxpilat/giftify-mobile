import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from '@/constants/themes';
import { TextInput } from '@/components/TextInput';
import { useState } from 'react';
import { PlatformButton } from '@/components/PlatformButton';
import { API } from '@/constants/api';
import { router } from 'expo-router';
import { apiFetchData } from '@/lib/api';

export default function OTPScreen() {
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<Record<'email', string | undefined>>({
    email: undefined,
  });

  const submit = async () => {
    const isUniqueEmail = await apiFetchData<boolean>({
      endpoint: API.auth.uniqueEmail,
      method: 'POST',
      body: email,
    });

    if (isUniqueEmail) {
      return setErrors((prev) => ({
        ...prev,
        email: 'Аккаунта с такой почтой не существует',
      }));
    }

    if (isValid()) {
      const { code } = await apiFetchData<{ code: string }>({
        endpoint: API.auth.validateEmail,
        method: 'POST',
        body: email,
      });
      router.push({ pathname: './resetPassword', params: { code, email } });
    }
  };

  const isValid = () => {
    const newErrors = {
      email: !email.trim() ? 'Обязательное поле' : undefined,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={-180}
      keyboardOpeningTime={0}
      enableOnAndroid
      contentContainerStyle={styles.scrollViewContent}
    >
      <ThemedText type="h1" style={styles.tittle}>
        Сбросить пароль
      </ThemedText>
      <ThemedView style={styles.body}>
        <ThemedText type="bodyLargeMedium" style={styles.subtitle}>
          Введите свою электронную почту и мы вышлем инструкции по сбросу пароля
        </ThemedText>
        <TextInput
          icon="email"
          placeholder="Электронная почта"
          valid={!errors.email}
          errorMessage={errors.email}
          onChangeText={(value) => {
            setEmail(value);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          keyboardType="email-address"
          inputMode="email"
        />
        <PlatformButton style={styles.button} onPress={submit}>
          <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
            Продолжить
          </ThemedText>
        </PlatformButton>
      </ThemedView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    marginTop: 60,
  },
  tittle: {
    textAlign: 'center',
  },
  body: {
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'center',
    marginBottom: 220,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 44,
  },
  button: {
    marginTop: 24,
  },
  buttonText: {
    color: Colors.white,
  },
});
