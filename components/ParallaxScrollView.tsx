import type { PropsWithChildren, ReactElement } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Platform, RefreshControlProps, ViewStyle } from 'react-native';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/TabBarBackground';
import { useBottomTabOverflow as useBottomTabOverflowIOS } from '@/components/TabBarBackground.ios';

type Props = PropsWithChildren<{
  header: ReactElement;
  headerHeight?: number;
  translateYFactor?: [number, number, number];
  scale?: [number, number, number];
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  refreshControl?: ReactElement<RefreshControlProps>;
  style?: ViewStyle;
}>;

import { useState } from 'react';

export function ParallaxScrollView({
  children,
  header,
  translateYFactor = [-0.5, 0, 0.3],
  scale = [2, 1, 1],
  onScroll,
  refreshControl,
  style,
}: Props) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = Platform.OS === 'ios' ? useBottomTabOverflowIOS() : useBottomTabOverflow();

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-headerHeight, 0, headerHeight],
          translateYFactor.map((factor) => factor * headerHeight)
        ),
      },
      {
        scale: interpolate(scrollOffset.value, [-headerHeight, 0, headerHeight], scale),
      },
    ],
  }));

  return (
    <ThemedView style={[{ flex: 1, width: '100%' }, style]}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        onScroll={onScroll}
        refreshControl={refreshControl}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <Animated.View
          style={[headerAnimatedStyle]}
          onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
        >
          {header}
        </Animated.View>
        <ThemedView>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}
