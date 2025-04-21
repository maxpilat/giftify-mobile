import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TextInput } from '@/components/TextInput';
import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PlatformButton } from '@/components/PlatformButton';
import { Colors } from '@/constants/themes';
import { Link } from 'expo-router';

export default function SignUpScreen() {
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [errors, setErrors] = useState<Record<'name' | 'surname' | 'email' | 'password', boolean>>({
    name: false,
    surname: false,
    email: false,
    password: false,
  });

  const handleSubmit = async () => {};

  const isValid = () => {
    // const errors = {
    //   name: !name.trim(),
    // };
    // setErrors(errors);
    // return !errors.name;
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={80}
      keyboardOpeningTime={0}
      enableOnAndroid
      contentContainerStyle={styles.scrollViewContent}
    >
      <ThemedView>
        <View style={styles.content}>
          <ThemedText type="h1" style={styles.title}>
            Регистрация
          </ThemedText>
          <View style={styles.fields}>
            <TextInput
              icon="user"
              placeholder="Имя"
              valid={!errors.name}
              onChangeText={(value) => {
                setName(value);
                setErrors((prev) => ({ ...prev, name: false }));
              }}
            />
            <TextInput
              icon="user"
              placeholder="Фамилия"
              valid={!errors.surname}
              onChangeText={(value) => {
                setSurname(value);
                setErrors((prev) => ({ ...prev, surname: false }));
              }}
            />
            <TextInput
              icon="email"
              placeholder="Электронная почта"
              valid={!errors.email}
              onChangeText={(value) => {
                setEmail(value);
                setErrors((prev) => ({ ...prev, email: false }));
              }}
              keyboardType="email-address"
              inputMode="email"
            />
            <TextInput
              icon="lock"
              placeholder="Пароль"
              valid={!errors.password}
              onChangeText={(value) => {
                setPassword(value);
                setErrors((prev) => ({ ...prev, password: false }));
              }}
              keyboardType="visible-password"
            />
          </View>
          <PlatformButton style={styles.button}>
            <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
              Зарегистрироваться
            </ThemedText>
          </PlatformButton>
        </View>
      </ThemedView>

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
    paddingTop: 60,
    flex: 1,
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
