import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from '@/components/TextInput';
import React, { useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PlatformButton } from '@/components/PlatformButton';
import { Colors } from '@/constants/themes';
import { Link, router } from 'expo-router';
import { apiFetch } from '@/lib/api';
import { API } from '@/constants/api';

export default function SignUpScreen() {
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [errors, setErrors] = useState<Record<'name' | 'surname' | 'email' | 'password', string | undefined>>({
    name: undefined,
    surname: undefined,
    email: undefined,
    password: undefined,
  });

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async () => {
    const isUniqueEmail: boolean = await apiFetch({
      endpoint: API.auth.uniqueEmail,
      method: 'POST',
      body: email,
    });
    if (isValid() && isUniqueEmail) {
      const { code }: { code: string } = await apiFetch({
        endpoint: API.auth.validateEmail,
        method: 'POST',
        body: email,
      });
      router.push({ pathname: './validateEmail', params: { name, surname, email, password, code } });
    }
  };

  const isValid = () => {
    const newErrors = {
      name: !name.trim() ? 'Поле обязательно' : undefined,
      surname: !surname.trim() ? 'Поле обязательно' : undefined,
      email: errors.email || (!email.trim() ? 'Поле обязательно' : undefined),
      password: password.trim().length < 6 ? 'Не менее 8 символов' : undefined,
    };
    setErrors(newErrors);
    return !Object.values(errors).some((error) => error);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: undefined }));

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      const isUnique: boolean = await apiFetch({
        endpoint: API.auth.uniqueEmail,
        method: 'POST',
        body: value,
      });

      if (!isUnique) {
        setErrors((prev) => ({ ...prev, email: 'Аккаунт с такой почтой уже существует' }));
      }
    }, 300);
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={60}
      keyboardOpeningTime={0}
      enableOnAndroid
      contentContainerStyle={styles.scrollViewContent}
    >
      <View style={styles.content}>
        <ThemedText type="h1" style={styles.title}>
          Регистрация
        </ThemedText>
        <View style={styles.fields}>
          <TextInput
            icon="user"
            placeholder="Имя"
            valid={!errors.name}
            errorMessage={errors.name}
            onChangeText={(value) => {
              setName(value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />
          <TextInput
            icon="user"
            placeholder="Фамилия"
            valid={!errors.surname}
            errorMessage={errors.surname}
            onChangeText={(value) => {
              setSurname(value);
              setErrors((prev) => ({ ...prev, surname: undefined }));
            }}
          />
          <TextInput
            icon="email"
            placeholder="Электронная почта"
            valid={!errors.email}
            errorMessage={errors.email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            inputMode="email"
          />
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
        </View>
        <PlatformButton style={styles.button} onPress={handleSubmit}>
          <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
            Зарегистрироваться
          </ThemedText>
        </PlatformButton>
      </View>

      <View style={styles.footer}>
        <ThemedText>Уже есть аккаунт?</ThemedText>
        <Link href="./">
          <ThemedText style={styles.signInLink}>Войти</ThemedText>
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    marginTop: 60,
    paddingHorizontal: 16,
    gap: 80,
  },
  title: {
    textAlign: 'center',
  },
  fields: {
    flex: 1,
    gap: 20,
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
    padding: 60,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  signInLink: {
    color: Colors.blue,
  },
});
