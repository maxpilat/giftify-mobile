import { useFonts } from 'expo-font';
import { Href, router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { AuthProvider } from '@/hooks/useAuth';
import { AuthData } from '@/models';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/constants/toast';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isFontsLoaded] = useFonts({
    'stolzl-regular': require('../assets/fonts/stolzl_regular.otf'),
    'stolzl-medium': require('../assets/fonts/stolzl_medium.otf'),
  });

  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [initialUser, setInitialUser] = useState<AuthData>();
  const [deepLink, setDeepLink] = useState<string | null>();

  const isLoaded = isFontsLoaded && isFirstLaunch !== null && isAuthLoaded && deepLink !== undefined;

  useEffect(() => {
    checkFirstLaunch();
    loadAuthData();
    Linking.getInitialURL().then(setDeepLink);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (isFirstLaunch) router.replace('/welcome');
    else if (initialUser) {
      router.replace({ pathname: '/(tabs)/profile/[userId]', params: { userId: initialUser.id } });
      if (deepLink) router.push(deepLink as Href);
    } else {
      router.replace('/(auth)');
    }

    setTimeout(() => SplashScreen.hideAsync(), 800);
  }, [isLoaded]);

  const checkFirstLaunch = async () => {
    const isFirstLaunch = !(await SecureStore.getItemAsync('hasLaunched'));
    if (isFirstLaunch) {
      setIsFirstLaunch(true);
    } else {
      setIsFirstLaunch(false);
    }
  };

  const loadAuthData = async () => {
    const storedUser = await SecureStore.getItemAsync('user');
    if (storedUser) setInitialUser(JSON.parse(storedUser));
    setIsAuthLoaded(true);
  };

  if (!isLoaded) return;

  // DEMO
  console.warn = () => {};
  console.error = () => {};

  return (
    <ActionSheetProvider>
      <AuthProvider initialUser={initialUser}>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <Toast config={toastConfig} />
        </ThemeProvider>
      </AuthProvider>
    </ActionSheetProvider>
  );
}
