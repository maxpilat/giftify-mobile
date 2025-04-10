import { useTheme } from '@/hooks/useTheme';
import { View, type ViewProps } from 'react-native';

type Props = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: Props) {
  const { theme } = useTheme();

  return <View style={[{ backgroundColor: theme.background }, style]} {...otherProps} />;
}
