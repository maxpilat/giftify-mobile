import { useTheme } from '@/hooks/useTheme';
import { Text, type TextProps, StyleSheet } from 'react-native';

export type ThemedTextProps = TextProps & {
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

export function ThemedText({ style, type = 'bodyBase', ...rest }: ThemedTextProps) {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        { color: theme.text, fontFamily: 'stolzl' },
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
    fontSize: 34,
    lineHeight: 38,
    fontWeight: 500,
  },
  h2: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: 500,
  },
  h3: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: 500,
  },
  h4: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: 500,
  },
  h5: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 500,
  },
  bodyLargeMedium: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 500,
  },
  bodyLarge: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 400,
  },
  bodyBase: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 400,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 400,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  labelBase: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 500,
  },
  labelSmall: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: 500,
  },
});
