import type { PropsWithChildren, ReactElement } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Platform, ViewStyle } from 'react-native';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/TabBarBackground';
import { useBottomTabOverflow as useBottomTabOverflowIOS } from '@/components/TabBarBackground.ios';

type Props = PropsWithChildren<{
  header: ReactElement;
  headerHeight?: number;
  translateY?: [number, number, number];
  scale?: [number, number, number];
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  style?: ViewStyle;
}>;

export function ParallaxScrollView({
  children,
  header,
  headerHeight = 300,
  translateY = [-headerHeight / 2, 0, headerHeight * 0],
  scale = [2, 1, 1],
  style,
  onScroll,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = Platform.OS === 'ios' ? useBottomTabOverflowIOS() : useBottomTabOverflow();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(scrollOffset.value, [-headerHeight, 0, headerHeight], translateY),
        },
        {
          scale: interpolate(scrollOffset.value, [-headerHeight, 0, headerHeight], scale),
        },
      ],
    };
  });

  return (
    <ThemedView style={[{ flex: 1, width: '100%' }, style]}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        onScroll={onScroll}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <Animated.View style={[{ height: headerHeight }, headerAnimatedStyle]}>{header}</Animated.View>
        <ThemedView>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}
