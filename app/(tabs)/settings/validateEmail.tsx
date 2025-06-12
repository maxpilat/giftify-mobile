import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { OtpInput } from 'react-native-otp-entry';
import { Colors } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { showToast } from '@/utils/showToast';
import { useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

type SearchParams = {
  newEmail: string;
  code: string;
};

export default function ValidateEmailScreen() {
  const { theme } = useTheme();
  const { code, newEmail } = useLocalSearchParams<SearchParams>();
  const { changeEmail } = useAuth();

  const [isValid, setIsValid] = useState(true);

  const handleTextChange = () => {
    setIsValid(true);
  };

  const handleSubmit = (value: string) => {
    if (value === code) {
      changeEmail(newEmail)
        .then(() => showToast('success', 'Почта изменена'))
        .catch(() => showToast('error', 'Не удалось изменить почту'));
      router.replace('/settings');
    } else {
      setIsValid(false);
      shakeOtpInput();
    }
  };

  const shakeX = useSharedValue(0);

  const shakeOtpInput = () => {
    shakeX.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-4, { duration: 50 }),
      withTiming(4, { duration: 50 }),
      withTiming(-3, { duration: 50 }),
      withTiming(3, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 150);
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
            onTextChange={handleTextChange}
            onFilled={handleSubmit}
            hideStick
            theme={{
              containerStyle: styles.pinCode,
              pinCodeContainerStyle: { ...styles.pinCodeContainer, borderColor: isValid ? Colors.grey : Colors.red },
              pinCodeTextStyle: { color: theme.text, ...styles.pinCodeText },
              focusedPinCodeContainerStyle: { borderColor: isValid ? Colors.blue : Colors.red },
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
    width: 64,
    height: 64,
  },
  pinCodeText: {
    fontSize: 32,
    fontFamily: 'stolzl-regular',
  },
});
