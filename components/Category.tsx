import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Reanimated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Colors } from '@/constants/themes';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { ActionButton } from '@/components/ActionsButton';

type Props = {
  name: string;
  count: number;
  isActive?: boolean;
  onPress?: () => void;
  pressOpacity?: number;
  duration?: number;
};

export function Category({ name, count, isActive, onPress, pressOpacity = 0.7, duration = 300 }: Props) {
  const { theme } = useTheme();

  const backgroundColorValue = isActive ? theme.secondary : Colors.black;
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

  React.useEffect(() => {
    backgroundColor.value = backgroundColorValue;
    padding.value = paddingValue;
    translateX.value = translateXValue;
  }, [isActive]);

  return (
    <Reanimated.View style={[styles.container, animatedContainerStyle]}>
      <TouchableOpacity activeOpacity={pressOpacity} onPress={onPress}>
        <ThemedText type="bodyLarge" style={styles.text}>
          {name}
        </ThemedText>
        <ThemedText type="h1" style={styles.text}>
          {count}
        </ThemedText>

        <Reanimated.View style={[styles.actionButtonContainer, animatedActionButtonStyle]}>
          <ActionButton
            style={[styles.actionButton]}
            size={36}
            actions={[{ label: 'Поделиться', onPress: () => console.log('Поделиться') }]}
            pressOpacity={pressOpacity}
          />
        </Reanimated.View>
      </TouchableOpacity>
    </Reanimated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 20,
    overflow: 'hidden',
  },
  text: {
    color: Colors.white,
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
