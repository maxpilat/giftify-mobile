import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from '@/components/TextInput';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PlatformButton } from '@/components/PlatformButton';
import { Colors } from '@/constants/themes';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { showToast } from '@/utils/showToast';

export default function SignInScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Record<'email' | 'password', string | undefined>>({
    email: undefined,
    password: undefined,
  });

  const { signIn } = useAuth();

  const submit = () => {
    if (!isValid()) return;

    signIn(email, password)
      .then(({ id: userId }) => router.replace({ pathname: '/profile/[userId]', params: { userId } }))
      .catch(() => showToast('error', 'Неверные почта или пароль'));
  };

  const isValid = () => {
    const newErrors = {
      email: errors.email || (!email.trim() ? 'Обязательное поле' : undefined),
      password: password.trim().length < 8 ? 'Не менее 8 символов' : undefined,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  return (
    <KeyboardAwareScrollView enableOnAndroid contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.content}>
        <ThemedText type="h1" style={styles.title}>
          Вход
        </ThemedText>
        <View style={styles.fields}>
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
            autoCapitalize="none"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              icon="lock"
              placeholder="Пароль"
              valid={!errors.password}
              errorMessage={errors.password}
              type="password"
              passwordRules="minlength: 8"
              onChangeText={(value) => {
                setPassword(value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              keyboardType="visible-password"
            />
            <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
              <ThemedText type="bodyLargeMedium" style={styles.forgotPasswordLink}>
                Забыли пароль?
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        <PlatformButton onPress={submit}>
          <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
            Войти
          </ThemedText>
        </PlatformButton>
      </View>

      <View style={styles.footer}>
        <ThemedText>Не зарегистрированы?</ThemedText>
        <TouchableOpacity onPress={() => router.push('/signUp')}>
          <ThemedText type="bodyLargeMedium" style={styles.signUpLink}>
            Создать аккаунт
          </ThemedText>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 120,
    marginBottom: 60,
  },
  content: {
    gap: 80,
  },
  title: {
    textAlign: 'center',
  },
  fields: {
    gap: 20,
  },
  passwordContainer: {
    gap: 5,
  },
  buttonText: {
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  signUpLink: {
    color: Colors.blue,
  },
  forgotPasswordLink: {
    color: Colors.blue,
    textAlign: 'right',
  },
});
