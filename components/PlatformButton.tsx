import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  onPress?: () => void;
  hapticFeedback?: keyof typeof Haptics.ImpactFeedbackStyle | 'none';
  pressOpacity?: number;
  children?: React.ReactNode;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};

export function PlatformButton({ onPress, hapticFeedback = 'Medium', pressOpacity = 0.9, children, style }: Props) {
  const { theme } = useTheme();

  const handlePress = () => {
    hapticFeedback !== 'none' && Haptics.impactAsync(Haptics.ImpactFeedbackStyle[hapticFeedback]);
    onPress && onPress();
  };

  return (
    <PlatformPressable
      onPress={handlePress}
      style={[styles.container, { backgroundColor: theme.primary }, style]}
      pressOpacity={pressOpacity}
    >
      {children}
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    paddingHorizontal: 5,
    paddingVertical: 17,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    color: Colors.white,
  },
});
