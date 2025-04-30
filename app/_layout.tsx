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

  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [initialUser, setInitialUser] = useState<AuthData>();

  useEffect(() => {
    loadAuthData();
  }, []);

  useEffect(() => {
    if (isFontsLoaded && isAuthLoaded) {
      initialUser && router.replace('./(tabs)');
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 800);
    }
  }, [isFontsLoaded, isAuthLoaded]);

  const loadAuthData = async () => {
    const storedUser = await SecureStore.getItemAsync('auth');

    if (storedUser) setInitialUser(JSON.parse(storedUser));
    setIsAuthLoaded(true);
  };

  if (!isFontsLoaded || !isAuthLoaded) {
    return null;
  }

  return (
    <ActionSheetProvider>
      <AuthProvider initialUser={initialUser}>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </ActionSheetProvider>
  );
}
