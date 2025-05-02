import { Colors } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { Switch as NativeSwitch, SwitchProps } from 'react-native';

export function Switch(props: SwitchProps) {
  const { theme } = useTheme();

  const { disabled } = props;

  const disabledTrackColor = 'rgba(184, 184, 186, 0.4)';

  const trackColor = {
    false: disabled ? disabledTrackColor : theme.tabBarBorder,
    true: disabled ? disabledTrackColor : theme.primary,
  };

  return (
    <NativeSwitch
      {...props}
      trackColor={trackColor}
      thumbColor={Colors.white}
      ios_backgroundColor={disabled ? disabledTrackColor : theme.tabBarBorder}
    />
  );
}
