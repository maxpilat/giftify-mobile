import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Currency } from '@/models';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

type Props = {
  currentAmount?: number;
  targetAmount?: number;
  currency?: Currency;
};

export function ProgressBar({ currentAmount = 0, targetAmount = 100, currency }: Props) {
  const { theme } = useTheme();

  const progress = Math.min((currentAmount / targetAmount) * 100, 100);

  const [barWidth, setBarWidth] = useState<number | null>(null);
  const [labelWidth, setLabelWidth] = useState<number | null>(null);

  const animatedBar = useSharedValue(0);
  const animatedLabel = useSharedValue(0);

  useEffect(() => {
    if (barWidth !== null && labelWidth !== null) {
      const baseDuration = 2000;
      const minDuration = 1000;
      const duration = Math.max(minDuration, (progress / 100) * baseDuration);

      const options = {
        duration,
        easing: Easing.out(Easing.back(1)),
      };

      animatedBar.value = withTiming(progress, options);

      const offset = ((barWidth / 100) * progress) / 2 - labelWidth / 2;
      animatedLabel.value = withTiming(Math.max(offset, 0), options);
    }
  }, [barWidth, labelWidth, progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${animatedBar.value}%`,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedLabel.value }],
  }));

  return (
    <View>
      <View
        style={[styles.progressBar, { backgroundColor: theme.subBackground }]}
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
      >
        <Animated.View style={[styles.progressFill, barStyle, { backgroundColor: theme.secondary }]} />
      </View>

      {currency && (
        <View style={styles.textContainer}>
          <ThemedText
            type="labelLarge"
            style={[labelStyle, { color: theme.secondary }]}
            onLayout={(event) => setLabelWidth(event.nativeEvent.layout.width)}
          >
            {currentAmount} {currency.transcription}
          </ThemedText>
          <ThemedText type="labelLarge">
            {targetAmount} {currency.transcription}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    height: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
});
