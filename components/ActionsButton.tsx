import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Icon } from '@/components/Icon';
import { useTheme } from '@/hooks/useTheme';

export type Action = {
  label: string;
  onPress: () => void;
};

type Props = {
  actions: Action[];
  size?: number;
  pressOpacity?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ActionButton({ actions, size = 50, pressOpacity = 0.9, disabled, style }: Props) {
  const { showActionSheetWithOptions } = useActionSheet();
  const { theme } = useTheme();

  const handleActions = () => {
    if (disabled) return;

    const options = actions.map((action) => action.label);
    options.push('Отмена');
    const cancelButtonIndex = options.length - 1;

    const destructiveButtonIndex = actions.findIndex((action) => action.label === 'Удалить');

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        if (typeof buttonIndex === 'number' && buttonIndex < actions.length) {
          actions[buttonIndex].onPress();
        }
      }
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.button },
        style,
      ]}
      onPress={handleActions}
      activeOpacity={pressOpacity}
    >
      <Icon name="actions" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
