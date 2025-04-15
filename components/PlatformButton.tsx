import React from 'react';
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { Colors } from '@/constants/themes';

type Props = {
  onPress?: () => void;
  hapticFeedback?: keyof typeof ImpactFeedbackStyle | 'none';
  pressOpacity?: number;
  children: React.ReactNode;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};

export function PlatformButton({ onPress, hapticFeedback = 'Medium', pressOpacity = 0.9, children, style }: Props) {
  const handlePress = () => {
    hapticFeedback !== 'none' && impactAsync(ImpactFeedbackStyle[hapticFeedback]);
    onPress && onPress();
  };

  return (
    <PlatformPressable onPress={handlePress} style={[styles.container, style]} pressOpacity={pressOpacity}>
      {children}
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    paddingHorizontal: 5,
    paddingVertical: 17,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
