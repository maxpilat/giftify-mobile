import { Icon } from '@/components/Icon';
import { PlatformButton } from '@/components/PlatformButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/themes';
import { Link } from 'expo-router';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';

export default function SignUpScreen() {
  return (
    <ImageBackground source={require('@/assets/images/bg-01.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <Image source={require('@/assets/images/logo-transparent.png')} style={styles.logo} />
        <Text style={styles.title}>Добро пожаловать!</Text>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttons}>
            <PlatformButton style={styles.button}>
              <Icon name="apple" />
              <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
                Продолжить с Apple
              </ThemedText>
            </PlatformButton>
            <PlatformButton style={styles.button}>
              <Icon name="google" />
              <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
                Продолжить с Google
              </ThemedText>
            </PlatformButton>
            <Link asChild href={'./signUp'}>
              <PlatformButton style={styles.button}>
                <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
                  Электронная почта
                </ThemedText>
              </PlatformButton>
            </Link>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
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
  button: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: Colors.blue,
    paddingHorizontal: 5,
    paddingVertical: 17,
  },
  buttonText: {
    color: Colors.white,
  },
});
