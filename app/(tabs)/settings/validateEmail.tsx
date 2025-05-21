import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { OtpInput } from 'react-native-otp-entry';
import { Colors } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';

type SearchParams = {
  newEmail: string;
  code: string;
};

export default function ValidateEmailScreen() {
  const { theme } = useTheme();
  const { code, newEmail } = useLocalSearchParams<SearchParams>();
  const { changeEmail } = useAuth();

  const submit = (value: string) => {
    if (value === code) {
      changeEmail(newEmail)
        .then(() => Toast.show({ type: 'success', text1: 'Почта изменена' }))
        .catch(() => Toast.show({ type: 'error', text1: 'Не удалось изменить почту' }));
      router.replace('/settings');
    }
  };

  return (
    <KeyboardAwareScrollView extraScrollHeight={60} keyboardOpeningTime={0} enableOnAndroid>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText type="h1" style={styles.tittle}>
            Осталось проверить почту
          </ThemedText>
          <ThemedText type="bodyLargeMedium" style={styles.subtitle}>
            Код для подтверждения отправлен вам на электронную почту
          </ThemedText>
          <OtpInput
            numberOfDigits={4}
            onFilled={submit}
            hideStick
            theme={{
              containerStyle: styles.pinCode,
              pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: { color: theme.text, ...styles.pinCodeText },
              focusedPinCodeContainerStyle: styles.focusedPinCodeContainer,
            }}
          />
        </View>
      </ThemedView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  content: {
    marginTop: 60,
  },
  tittle: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 60,
  },
  pinCode: {
    marginTop: 40,
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
});
