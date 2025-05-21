import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from '@/components/TextInput';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PlatformButton } from '@/components/PlatformButton';
import { Colors } from '@/constants/themes';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { OtpInput } from 'react-native-otp-entry';
import { useTheme } from '@/hooks/useTheme';
import { showToast } from '@/utils/showToast';

type SearchParams = {
  code: string;
  email: string;
};

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<SearchParams>();
  const { theme } = useTheme();
  const { resetPassword } = useAuth();

  const [code, setCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [errors, setErrors] = useState<Record<'code' | 'newPassword' | 'confirmNewPassword', string | undefined>>({
    code: undefined,
    newPassword: undefined,
    confirmNewPassword: undefined,
  });

  const handleSubmit = () => {
    if (isValid()) {
      resetPassword(params.email, newPassword)
        .then(() => {
          router.replace('/signIn');
          showToast('success', 'Пароль изменён');
        })
        .catch(() => showToast('error', 'Не удалось изменить пароль'));
    }
  };

  const isValid = () => {
    const newErrors = {
      code: code !== params.code ? 'Неверный код' : undefined,
      newPassword: newPassword.trim().length < 8 ? 'Не менее 8 символов' : undefined,
      confirmNewPassword:
        confirmNewPassword.trim().length < 8
          ? 'Не менее 8 символов'
          : confirmNewPassword !== newPassword
          ? 'Пароли должны совпадать'
          : undefined,
    };
    setErrors(newErrors);

    if (newErrors.code) showToast('error', newErrors.code);

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
        Сброс пароля
      </ThemedText>
      <View style={styles.content}>
        <ThemedText type="bodyLargeMedium" style={styles.title}>
          Введите свою электронную почту и мы вышлем инструкции по сбросу пароля
        </ThemedText>
        <View style={styles.fields}>
          <OtpInput
            numberOfDigits={4}
            onFilled={setCode}
            hideStick
            theme={{
              containerStyle: styles.pinCode,
              pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: { color: theme.text, ...styles.pinCodeText },
              focusedPinCodeContainerStyle: styles.focusedPinCodeContainer,
            }}
          />
          <TextInput
            icon="lock"
            placeholder="Новый пароль"
            valid={!errors.newPassword}
            errorMessage={errors.newPassword}
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
            valid={!errors.confirmNewPassword}
            errorMessage={errors.confirmNewPassword}
            type="password"
            passwordRules="minlength: 8"
            onChangeText={(value) => {
              setConfirmNewPassword(value);
              setErrors((prev) => ({ ...prev, confirmNewPassword: undefined }));
            }}
            keyboardType="visible-password"
          />
        </View>
        <PlatformButton style={styles.button} onPress={handleSubmit}>
          <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
            Подтвердить
          </ThemedText>
        </PlatformButton>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    marginTop: 60,
  },
  content: {
    paddingHorizontal: 16,
    marginTop: 60,
  },
  title: {
    textAlign: 'center',
  },
  fields: {
    gap: 20,
    marginTop: 40,
  },
  pinCode: {
    marginBottom: 6,
    justifyContent: 'center',
    gap: 20,
  },
  pinCodeContainer: {
    borderColor: Colors.grey,
    width: 64,
    height: 64,
  },
  pinCodeText: {
    fontSize: 32,
    fontFamily: 'stolzl-regular',
  },
  focusedPinCodeContainer: {
    borderColor: Colors.blue,
  },
  button: {
    marginTop: 24,
  },
  buttonText: {
    color: Colors.white,
  },
});
