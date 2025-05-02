import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from '@/components/TextInput';
import React, { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from '@/constants/themes';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

type SearchParams = {
  isSubmit?: 'true' | 'false';
};

export default function ChangePasswordScreen() {
  const { theme } = useTheme();
  const { isSubmit } = useLocalSearchParams<SearchParams>();

  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [errors, setErrors] = useState<Record<'password' | 'newPassword' | 'confirmNewPassword', string | undefined>>({
    password: undefined,
    newPassword: undefined,
    confirmNewPassword: undefined,
  });

  const { changePassword } = useAuth();

  useEffect(() => {
    handleSubmit();
  }, [isSubmit]);

  const handleSubmit = async () => {
    if (isSubmit !== 'true') return;

    if (isValid()) {
      await changePassword(password, newPassword);
      router.replace('/settings');
    }

    router.setParams({ isSubmit: 'false' });
  };

  const isValid = () => {
    const newErrors = {
      password: password.trim().length < 8 ? 'Не менее 8 символов' : undefined,
      newPassword: newPassword.trim().length < 8 ? 'Не менее 8 символов' : undefined,
      confirmNewPassword:
        confirmNewPassword.trim().length < 8
          ? 'Не менее 8 символов'
          : confirmNewPassword !== newPassword
          ? 'Пароли должны совпадать'
          : undefined,
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
      <View style={styles.content}>
        <ThemedText type="h1" style={styles.title}>
          Смена пароля
        </ThemedText>
        <View style={styles.fields}>
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
          <TextInput
            icon="lock"
            placeholder="Новый пароль"
            valid={!errors.password}
            errorMessage={errors.password}
            type="password"
            passwordRules="minlength: 8"
            onChangeText={(value) => {
              setNewPassword(value);
              setErrors((prev) => ({ ...prev, newPassword: undefined }));
            }}
            keyboardType="visible-password"
          />
          <TextInput
            icon="lock"
            placeholder="Повторите новый пароль"
            valid={!errors.password}
            errorMessage={errors.password}
            type="password"
            passwordRules="minlength: 8"
            onChangeText={(value) => {
              setConfirmNewPassword(value);
              setErrors((prev) => ({ ...prev, confirmNewPassword: undefined }));
            }}
            keyboardType="visible-password"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Link href="/(auth)/forgotPassword">
          <ThemedText type="bodyLargeMedium" style={[styles.forgotPasswordLink, { color: theme.primary }]}>
            Забыли пароль?
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
    paddingHorizontal: 16,
    marginVertical: 120,
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
  forgotPasswordLink: {
    textAlign: 'right',
  },
});
