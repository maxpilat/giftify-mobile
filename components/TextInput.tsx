import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput as Input, TextInputProps } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Icon } from '@/components/Icon';
import { Colors } from '@/constants/themes';
import { Icons } from '@/constants/icons';
import { ThemedText } from './ThemedText';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

type Props<T> = {
  icon?: keyof typeof Icons;
  valid?: boolean;
  errorMessage?: string;
  mode?: 'options' | 'password';
  options?: T[];
  getDisplayedValue?: (item: T) => string;
  getOptionLabel?: (item: T) => string;
  onSelectOption?: (item: T) => void;
} & TextInputProps;

export function TextInput<T>({
  icon,
  valid = true,
  errorMessage,
  mode,
  options,
  getDisplayedValue,
  getOptionLabel,
  onSelectOption,
  ...inputConfig
}: Props<T>) {
  const { showActionSheetWithOptions } = useActionSheet();

  const [selectedOption, setSelectedOption] = useState<T | null>(options?.[0] ?? null);
  const [secure, setSecure] = useState(mode === 'password' ? true : false);

  const errorHeight = useSharedValue(0);
  const errorOpacity = useSharedValue(0);
  const errorTranslateY = useSharedValue(-5);

  useEffect(() => {
    if (errorMessage) {
      errorHeight.value = withTiming(20, { duration: 300 });
      errorOpacity.value = withTiming(1, { duration: 500 });
      errorTranslateY.value = withTiming(0, { duration: 300 });
    } else {
      errorHeight.value = withTiming(0, { duration: 300 });
      errorOpacity.value = withTiming(0, { duration: 500 });
      errorTranslateY.value = withTiming(-5, { duration: 300 });
    }
  }, [errorMessage]);

  const animatedErrorContainerStyle = useAnimatedStyle(() => ({
    height: errorHeight.value,
  }));

  const animatedErrorTextStyle = useAnimatedStyle(() => ({
    opacity: errorOpacity.value,
    transform: [{ translateY: errorTranslateY.value }],
  }));

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
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
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
          secureTextEntry={secure}
          {...inputConfig}
        />
        {mode === 'options' && !!options?.length && getDisplayedValue && (
          <TouchableOpacity style={styles.optionButton} onPress={openSheet}>
            <ThemedText style={styles.optionText}>
              {selectedOption ? getDisplayedValue(selectedOption) : getDisplayedValue(options[0])}
            </ThemedText>
          </TouchableOpacity>
        )}
        {mode === 'password' && (
          <TouchableOpacity onPress={() => setSecure((prev) => !prev)}>
            <Icon name={secure ? 'hide' : 'show'} size={20} color={Colors.grey} />
          </TouchableOpacity>
        )}
      </View>

      <Animated.View style={[styles.errorMessageContainer, animatedErrorContainerStyle]}>
        {errorMessage && (
          <ThemedText type="bodySmall" style={[styles.errorMessage, animatedErrorTextStyle]}>
            {errorMessage}
          </ThemedText>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  inputContainer: {
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
    minWidth: 20,
  },
  optionButton: {
    paddingHorizontal: 8,
  },
  optionText: {
    color: Colors.grey,
  },
  errorMessageContainer: {
    overflow: 'hidden',
  },
  errorMessage: {
    color: Colors.red,
  },
});
