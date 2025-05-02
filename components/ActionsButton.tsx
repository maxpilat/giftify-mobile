import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Colors } from '@/constants/themes';
import { Icon } from '@/components/Icon';

export type Action = {
  label: string;
  onPress: () => void;
};

type Props = {
  actions: Action[];
  size?: number;
  pressOpacity?: number;
  style?: StyleProp<ViewStyle>;
};

export function ActionButton({ actions, size = 50, pressOpacity = 0.9, style }: Props) {
  const { showActionSheetWithOptions } = useActionSheet();

  const handleActions = () => {
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
      style={[styles.button, style, { width: size, height: size, borderRadius: size / 2 }]}
      onPress={handleActions}
      activeOpacity={pressOpacity}
    >
      <Icon name="actions" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
