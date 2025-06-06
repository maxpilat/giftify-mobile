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
import Animated, { useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

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

  const [isValid, setIsValid] = useState(true);

  const handleTextChange = () => {
    setIsValid(true);
  };

  const handleSubmit = (value: string) => {
    if (value === code) {
      signUp(userData)
        .then((user) => router.replace({ pathname: '/profile/[userId]', params: { userId: user.id } }))
        .catch(() => showToast('error', 'Не удалось авторизоваться'));
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
            Подтвердите адрес электронной почты
          </ThemedText>
          <ThemedText type="bodyLargeMedium" style={styles.subtitle}>
            Код для подтверждения отправлен вам на электронную почту
          </ThemedText>
          <Animated.View style={[{ transform: [{ translateX: shakeX }] }]}>
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
          </Animated.View>
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
