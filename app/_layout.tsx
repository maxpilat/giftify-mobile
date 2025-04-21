import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { AuthProvider } from '@/hooks/useAuth';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '+not-found',
};

export default function RootLayout() {
  const [loaded] = useFonts({
    'stolzl-regular': require('../assets/fonts/stolzl_regular.otf'),
    'stolzl-medium': require('../assets/fonts/stolzl_medium.otf'),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ActionSheetProvider>
      <AuthProvider>
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
