import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { AuthProvider } from '@/hooks/useAuth';
import { AuthData } from '@/models';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '+not-found',
};

export default function RootLayout() {
  const [isFontsLoaded] = useFonts({
    'stolzl-regular': require('../assets/fonts/stolzl_regular.otf'),
    'stolzl-medium': require('../assets/fonts/stolzl_medium.otf'),
  });

  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [initialUser, setInitialUser] = useState<AuthData>();
  const [initialToken, setInitialToken] = useState<string>();

  useEffect(() => {
    if (isFontsLoaded && isAuthLoaded) SplashScreen.hideAsync();
  }, [isFontsLoaded, isAuthLoaded]);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        const storedToken = await SecureStore.getItemAsync('token');

        if (storedUser && storedToken) {
          setInitialUser(JSON.parse(storedUser));
          setInitialToken(storedToken);
        }
      } catch (error) {
        console.error('Error while retrieving Auth Data from Secure Store:', error);
      } finally {
        setIsAuthLoaded(true);
      }
    };

    loadAuthData();
  }, []);

  if (!isFontsLoaded || !isAuthLoaded) {
    return null;
  }

  return (
    <ActionSheetProvider>
      <AuthProvider initialUser={initialUser} initialToken={initialToken}>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </ActionSheetProvider>
  );
}
