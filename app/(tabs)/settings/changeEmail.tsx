import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from '@/constants/themes';
import { TextInput } from '@/components/TextInput';
import { useState } from 'react';
import { PlatformButton } from '@/components/PlatformButton';
import { API } from '@/constants/api';
import { router } from 'expo-router';
import { apiFetchData } from '@/lib/api';

export default function ChangeEmailScreen() {
  const [newEmail, setNewEmail] = useState<string>('');
  const [errors, setErrors] = useState<Record<'newEmail', string | undefined>>({
    newEmail: undefined,
  });

  const submit = async () => {
    if (isValid()) {
      const { code } = await apiFetchData<{ code: string }>({
        endpoint: API.auth.validateEmail,
        method: 'POST',
        body: newEmail,
      });
      router.push({ pathname: './validateEmail', params: { code, newEmail } });
    }
  };

  const isValid = () => {
    const newErrors = {
      newEmail: !newEmail.trim() ? 'Обязательное поле' : undefined,
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
      <View style={styles.content}>
        <ThemedText type="h1" style={styles.tittle}>
          Изменить электронную почту
        </ThemedText>
        <ThemedText type="bodyLargeMedium" style={styles.subtitle}>
          На новую почту будет выслано письмо для подтверждения
        </ThemedText>
        <TextInput
          icon="email"
          placeholder="Электронная почта"
          valid={!errors.newEmail}
          errorMessage={errors.newEmail}
          onChangeText={(value) => {
            setNewEmail(value);
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
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    marginTop: 100,
  },
  tittle: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  button: {
    marginTop: 24,
  },
  buttonText: {
    color: Colors.white,
  },
});
