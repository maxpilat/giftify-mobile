import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { AuthProvider } from '@/hooks/useAuth';
import { AuthData } from '@/models';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isFontsLoaded] = useFonts({
    'stolzl-regular': require('../assets/fonts/stolzl_regular.otf'),
    'stolzl-medium': require('../assets/fonts/stolzl_medium.otf'),
  });

  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [initialUser, setInitialUser] = useState<AuthData>();

  const isLoaded = isFontsLoaded && isFirstLaunch !== null && isAuthLoaded;

  useEffect(() => {
    // SecureStore.deleteItemAsync('hasLaunched').then(() => {
    checkFirstLaunch();
    loadAuthData();
    // });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (isFirstLaunch) router.replace('./welcome');
    else router.replace(initialUser ? './(tabs)' : './(auth)');

    setTimeout(() => SplashScreen.hideAsync(), 800);
  }, [isLoaded]);

  const checkFirstLaunch = async () => {
    const isFirstLaunch = !(await SecureStore.getItemAsync('hasLaunched'));
    if (isFirstLaunch) {
      await SecureStore.setItemAsync('hasLaunched', 'true');
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
        </ThemeProvider>
      </AuthProvider>
    </ActionSheetProvider>
  );
}
