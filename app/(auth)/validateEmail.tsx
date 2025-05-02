import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { OtpInput } from 'react-native-otp-entry';
import { Colors } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

type SearchParams = {
  email: string;
  password: string;
  name: string;
  surname: string;
  friendEmail: string;
  code: string;
};

export default function ValidateEmailScreen() {
  const { theme } = useTheme();
  const { code, ...userData } = useLocalSearchParams<SearchParams>();
  const { signUp } = useAuth();

  const handleSubmit = async (value: string) => {
    if (value === code) {
      await signUp(userData);
      router.replace('../(tabs)');
    }
  };

  return (
    <KeyboardAwareScrollView extraScrollHeight={60} keyboardOpeningTime={0} enableOnAndroid>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText type="h1" style={styles.tittle}>
            Подтвердите адрес электронной почты
          </ThemedText>
          <ThemedText type="bodyLargeMedium" style={styles.subtitle}>
            Код для подтверждения отправлен вам на электронную почту
          </ThemedText>
          <OtpInput
            numberOfDigits={4}
            onFilled={handleSubmit}
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
