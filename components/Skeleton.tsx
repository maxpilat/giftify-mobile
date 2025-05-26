import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  style?: ViewStyle;
};

export function Skeleton({ style }: Props) {
  const { theme } = useTheme();

  const opacity = useSharedValue(0.4);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);

  return <Animated.View style={[styles.skeleton, { backgroundColor: theme.subBackground }, style, animatedStyle]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 25,
  },
});
