import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from '@/components/TextInput';
import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PlatformButton } from '@/components/PlatformButton';
import { Colors } from '@/constants/themes';
import { Link, router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function SignUpScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Record<'email' | 'password', string | undefined>>({
    email: undefined,
    password: undefined,
  });

  const { signIn } = useAuth();

  const submit = async () => {
    if (isValid()) {
      await signIn(email, password);
      router.replace('../(tabs)');
    }
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
    <KeyboardAwareScrollView
      extraScrollHeight={60}
      keyboardOpeningTime={0}
      enableOnAndroid
      contentContainerStyle={styles.scrollViewContent}
    >
      <ThemedText type="h1" style={styles.title}>
        Вход
      </ThemedText>
      <View style={styles.content}>
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
          />
          <View style={styles.passwordContainer}>
            <TextInput
              icon="lock"
              placeholder="Пароль"
              valid={!errors.password}
              errorMessage={errors.password}
              mode="password"
              passwordRules="minlength: 8"
              onChangeText={(value) => {
                setPassword(value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              keyboardType="visible-password"
            />
            <Link href="./forgotPassword">
              <ThemedText type="bodyLargeMedium" style={styles.forgotPasswordLink}>
                Забыли пароль?
              </ThemedText>
            </Link>
          </View>
        </View>
        <PlatformButton style={styles.button} onPress={submit}>
          <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
            Войти
          </ThemedText>
        </PlatformButton>
      </View>

      <View style={styles.footer}>
        <ThemedText>Не зарегистрированы?</ThemedText>
        <Link href="./signUp">
          <ThemedText type="bodyLargeMedium" style={styles.signUpLink}>
            Создать аккаунт
          </ThemedText>
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 60,
  },
  content: {
    paddingHorizontal: 16,
    gap: 24,
    marginBottom: 0,
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
  button: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 5,
    paddingVertical: 17,
  },
  buttonText: {
    color: Colors.white,
  },
  footer: {
    paddingVertical: 60,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  signUpLink: {
    color: Colors.blue,
  },
  forgotPasswordLink: {
    color: Colors.blue,
    textAlign: 'right',
  },
});
