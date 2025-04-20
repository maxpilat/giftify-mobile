import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput as Input, TextInputProps } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Icon } from '@/components/Icon';
import { Colors } from '@/constants/themes';
import { Icons } from '@/constants/icons';
import { ThemedText } from './ThemedText';

type Props<T> = {
  icon?: keyof typeof Icons;
  valid?: boolean;
  options?: T[];
  getDisplayedValue?: (item: T) => string;
  getOptionLabel?: (item: T) => string;
  onSelectOption?: (item: T) => void;
} & TextInputProps;

export function TextInput<T>({
  icon,
  valid = true,
  options,
  getDisplayedValue,
  getOptionLabel,
  onSelectOption,
  ...inputConfig
}: Props<T>) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [selectedOption, setSelectedOption] = useState<T | null>(options?.[0] ?? null);

  const openSheet = () => {
    if (!options || !getOptionLabel) return;
    showActionSheetWithOptions(
      {
        options: [...options.map(getOptionLabel), 'Отмена'],
        cancelButtonIndex: options.length,
      },
      (index) => {
        if (index !== undefined && index < options.length) {
          const selected = options[index];
          setSelectedOption(selected);
          onSelectOption?.(selected);
        }
      }
    );
  };

  useEffect(() => {
    if (options) setSelectedOption(options[0]);
  }, [options]);

  return (
    <View
      style={[
        styles.container,
        { borderColor: Colors.grey },
        inputConfig.multiline && { alignItems: 'flex-start' },
        !valid && { borderColor: Colors.red },
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          color={valid ? Colors.grey : Colors.red}
          size={16}
          style={inputConfig.multiline && { marginTop: 6 }}
        />
      )}
      <Input
        style={[styles.input, inputConfig.multiline && { height: 96 }]}
        placeholderTextColor={Colors.grey}
        {...inputConfig}
      />
      {!!options?.length && getDisplayedValue && (
        <TouchableOpacity style={styles.optionButton} onPress={openSheet}>
          <ThemedText style={styles.optionText}>
            {selectedOption ? getDisplayedValue(selectedOption) : getDisplayedValue(options[0])}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'stolzl-regular',
    color: Colors.grey,
  },
  optionButton: {
    paddingHorizontal: 8,
  },
  optionText: {
    color: Colors.grey,
  },
});
