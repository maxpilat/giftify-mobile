import { useTheme } from '@/hooks/useTheme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurTint, BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabBarBackground() {
  const { themeType } = useTheme();

  const tint: BlurTint = themeType === 'system' ? 'default' : themeType === 'dark' ? 'dark' : 'systemMaterialLight';

  return <BlurView tint={tint} intensity={100} style={StyleSheet.absoluteFill} />;
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}
