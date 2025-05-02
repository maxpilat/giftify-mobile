import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from '@/components/TextInput';
import React, { useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PlatformButton } from '@/components/PlatformButton';
import { Colors } from '@/constants/themes';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { API } from '@/constants/api';
import { apiFetchData } from '@/lib/api';

type SearchParams = {
  friendEmail?: string;
};

export default function SignUpScreen() {
  const { friendEmail } = useLocalSearchParams<SearchParams>();

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

  const typingTimeoutRef = useRef<number | null>(null);

  const submit = async () => {
    if (!isValid()) {
      return;
    }

    const isUniqueEmail = await apiFetchData<boolean>({
      endpoint: API.auth.uniqueEmail,
      method: 'POST',
      body: email,
    });

    if (!isUniqueEmail) {
      setErrors((prev) => ({ ...prev, email: 'Аккаунт с такой почтой уже существует' }));
      return;
    }

    const { code } = await apiFetchData<{ code: string }>({
      endpoint: API.auth.validateEmail,
      method: 'POST',
      body: email,
    });
    router.push({ pathname: './validateEmail', params: { name, surname, email, password, friendEmail, code } });
  };

  const isValid = () => {
    const newErrors = {
      name: !name.trim() ? 'Обязательное поле' : undefined,
      surname: !surname.trim() ? 'Обязательное поле' : undefined,
      email: errors.email || (!email.trim() ? 'Обязательное поле' : undefined),
      password: password.trim().length < 8 ? 'Не менее 8 символов' : undefined,
    };

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return !Object.values(newErrors).some((error) => error);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: undefined }));

    if (!value) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      const isUnique = await apiFetchData<boolean>({
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
            type="password"
            passwordRules="minlength: 8"
            onChangeText={(value) => {
              setPassword(value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            keyboardType="visible-password"
          />
        </View>
        <PlatformButton onPress={submit}>
          <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
            Зарегистрироваться
          </ThemedText>
        </PlatformButton>
      </View>

      <View style={styles.footer}>
        <ThemedText>Уже есть аккаунт?</ThemedText>
        <Link href="./signIn">
          <ThemedText type="bodyLargeMedium" style={styles.signInLink}>
            Войти
          </ThemedText>
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flex: 1,
    marginVertical: 60,
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: 16,
    gap: 80,
  },
  title: {
    textAlign: 'center',
  },
  fields: {
    gap: 16,
  },
  buttonText: {
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  signInLink: {
    color: Colors.blue,
  },
});
