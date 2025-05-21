import { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Action, ActionButton } from '@/components/ActionsButton';

type Props = {
  name: string;
  count: number;
  isActive?: boolean;
  onPress?: () => void;
  pressOpacity?: number;
  duration?: number;
  actions?: Action[];
};

export function WishListTab({
  name,
  count,
  isActive = false,
  onPress,
  pressOpacity = 0.7,
  duration = 300,
  actions = [],
}: Props) {
  const { theme } = useTheme();

  const backgroundColorValue = isActive ? theme.secondary : theme.button;
  const paddingValue = isActive ? 50 : 14;
  const translateXValue = isActive ? 0 : 10;

  const backgroundColor = useSharedValue(backgroundColorValue);
  const padding = useSharedValue(paddingValue);
  const translateX = useSharedValue(translateXValue);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    paddingRight: withTiming(padding.value, { duration, easing: Easing.inOut(Easing.back(3)) }),
    backgroundColor: withTiming(backgroundColor.value, { duration, easing: Easing.inOut(Easing.ease) }),
  }));

  const animatedActionButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(translateX.value, { duration, easing: Easing.inOut(Easing.ease) }) }],
  }));

  useEffect(() => {
    backgroundColor.value = backgroundColorValue;
    padding.value = paddingValue;
    translateX.value = translateXValue;
  }, [isActive, theme]);

  return (
    <TouchableOpacity activeOpacity={pressOpacity} onPress={onPress}>
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <View>
          <ThemedText type="bodyLarge" backgroundColor={isActive ? theme.secondary : theme.button}>
            {name}
          </ThemedText>
          <ThemedText type="h1" backgroundColor={isActive ? theme.secondary : theme.button}>
            {count}
          </ThemedText>

          {actions.length > 0 && (
            <Animated.View style={[styles.actionButtonContainer, animatedActionButtonStyle]}>
              <ActionButton style={styles.actionButton} size={36} actions={actions} pressOpacity={pressOpacity} />
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionButtonContainer: {
    position: 'absolute',
    top: -5,
    right: -42,
  },
  actionButton: {
    backgroundColor: 'transparent',
  },
});
