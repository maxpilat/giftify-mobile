import { Icon } from '@/components/Icon';
import { PlatformButton } from '@/components/PlatformButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/themes';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';

export default function StartScreen() {
  return (
    <ImageBackground source={require('@/assets/images/bg-01.jpeg')} style={styles.background}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Image source={require('@/assets/images/logo-transparent.png')} style={styles.logo} />
        <Text style={styles.title}>Добро пожаловать!</Text>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttons}>
            <PlatformButton>
              <Icon name="apple" />
              <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
                Продолжить с Apple
              </ThemedText>
            </PlatformButton>
            <PlatformButton>
              <Icon name="google" />
              <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
                Продолжить с Google
              </ThemedText>
            </PlatformButton>
            <PlatformButton onPress={() => router.push('./signUp')}>
              <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
                Электронная почта
              </ThemedText>
            </PlatformButton>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 100,
  },
  logo: {
    width: 110,
    height: 140,
  },
  title: {
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'stolzl-medium',
    fontSize: 42,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  buttons: {
    flex: 1,
    gap: 20,
  },
  buttonText: {
    color: Colors.white,
  },
});
