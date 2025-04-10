import { useTheme } from '@/hooks/useTheme';
import { Text, type TextProps, StyleSheet } from 'react-native';

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
    | 'labelLarge'
    | 'labelBase'
    | 'labelSmall';
};

export function ThemedText({ style, type = 'bodyBase', ...rest }: Props) {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        { color: theme.text },
        type === 'bodyBase' ? styles.bodyBase : undefined,
        type === 'h1' ? styles.h1 : undefined,
        type === 'h2' ? styles.h2 : undefined,
        type === 'h3' ? styles.h3 : undefined,
        type === 'h4' ? styles.h4 : undefined,
        type === 'h5' ? styles.h5 : undefined,
        type === 'bodyLargeMedium' ? styles.bodyLargeMedium : undefined,
        type === 'bodyLarge' ? styles.bodyLarge : undefined,
        type === 'bodySmall' ? styles.bodySmall : undefined,
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
    fontWeight: 500,
    fontFamily: 'stolzl-medium',
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 500,
    fontFamily: 'stolzl-medium',
  },
  h3: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 500,
    fontFamily: 'stolzl-medium',
  },
  h4: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: 500,
    fontFamily: 'stolzl-medium',
  },
  h5: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 500,
    fontFamily: 'stolzl-medium',
  },
  bodyLargeMedium: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: 500,
    fontFamily: 'stolzl-medium',
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: 400,
    fontFamily: 'stolzl-regular',
  },
  bodyBase: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 400,
    fontFamily: 'stolzl-regular',
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 400,
    fontFamily: 'stolzl-regular',
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
    fontFamily: 'stolzl-medium',
  },
  labelBase: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 500,
    fontFamily: 'stolzl-medium',
  },
  labelSmall: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: 500,
    fontFamily: 'stolzl-medium',
  },
});
