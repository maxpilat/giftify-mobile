import { useTheme } from '@/hooks/useTheme';
import Reanimated, { AnimatedStyle } from 'react-native-reanimated';
import { ViewProps, StyleProp, ViewStyle } from 'react-native';

type Props = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  style?: StyleProp<ViewStyle> | StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: Props) {
  const { theme } = useTheme();

  return <Reanimated.View style={[{ backgroundColor: theme.background }, style]} {...otherProps} />;
}
