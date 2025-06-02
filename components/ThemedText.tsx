import { Colors } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { TextProps, StyleProp, TextStyle, StyleSheet } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { colorKit } from 'reanimated-color-picker';

type Props = TextProps & {
  type?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'bodyLargeMedium'
    | 'bodyLarge'
    | 'bodyBase'
    | 'bodySmall'
    | 'bodyExtraSmall'
    | 'labelLarge'
    | 'labelBase'
    | 'labelSmall';
  parentBackgroundColor?: string;
  style?: StyleProp<TextStyle> | StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
};

export function ThemedText({ style, type = 'bodyBase', parentBackgroundColor, ...rest }: Props) {
  const { theme } = useTheme();

  return (
    <Animated.Text
      style={[
        {
          color: parentBackgroundColor
            ? colorKit.isDark(parentBackgroundColor)
              ? Colors.white
              : Colors.black
            : theme.text,
        },
        type === 'bodyBase' ? styles.bodyBase : undefined,
        type === 'h1' ? styles.h1 : undefined,
        type === 'h2' ? styles.h2 : undefined,
        type === 'h3' ? styles.h3 : undefined,
        type === 'h4' ? styles.h4 : undefined,
        type === 'h5' ? styles.h5 : undefined,
        type === 'bodyLargeMedium' ? styles.bodyLargeMedium : undefined,
        type === 'bodyLarge' ? styles.bodyLarge : undefined,
        type === 'bodySmall' ? styles.bodySmall : undefined,
        type === 'bodyExtraSmall' ? styles.bodyExtraSmall : undefined,
        type === 'labelLarge' ? styles.labelLarge : undefined,
        type === 'labelBase' ? styles.labelBase : undefined,
        type === 'labelSmall' ? styles.labelSmall : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 26,
    lineHeight: 38,
    fontFamily: 'stolzl-medium',
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'stolzl-medium',
  },
  h3: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'stolzl-medium',
  },
  h4: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: 'stolzl-medium',
  },
  h5: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'stolzl-medium',
  },
  bodyLargeMedium: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'stolzl-medium',
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'stolzl-regular',
  },
  bodyBase: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'stolzl-regular',
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'stolzl-regular',
  },
  bodyExtraSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'stolzl-regular',
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'stolzl-medium',
  },
  labelBase: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'stolzl-medium',
  },
  labelSmall: {
    fontSize: 10,
    lineHeight: 15,
    fontFamily: 'stolzl-medium',
  },
});
