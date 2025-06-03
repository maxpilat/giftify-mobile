import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';

type Props = {
  style?: ViewStyle;
  minOpacity?: number;
  maxOpacity?: number;
};

export function Skeleton({ style, minOpacity = 0.4, maxOpacity = 1 }: Props) {
  const { theme } = useTheme();

  const opacity = useSharedValue(minOpacity);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withRepeat(withTiming(maxOpacity, { duration: 800, easing: Easing.ease }), -1, true);
  }, []);

  return <Animated.View style={[{ backgroundColor: theme.subBackground }, style, animatedStyle]} />;
}
