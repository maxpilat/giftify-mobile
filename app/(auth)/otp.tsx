import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TextInput } from '@/components/TextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function OTPScreen() {
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
          <View style={styles.inputs}>
            <TextInput style={styles.input} keyboardType="numeric" inputMode="numeric" />
            <TextInput style={styles.input} keyboardType="numeric" inputMode="numeric" />
            <TextInput style={styles.input} keyboardType="numeric" inputMode="numeric" />
            <TextInput style={styles.input} keyboardType="numeric" inputMode="numeric" />
          </View>
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
  inputs: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  input: {
    fontSize: 32,
    fontFamily: 'stolzl-regular',
    width: 32,
    height: 32,
    textAlign: 'center',
  },
});
