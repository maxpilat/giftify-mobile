import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput as NativeTextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Icon } from '@/components/Icon';
import { Colors } from '@/constants/themes';
import { Icons } from '@/constants/icons';
import { ThemedText } from './ThemedText';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

type Props<T> = {
  icon?: keyof typeof Icons;
  valid?: boolean;
  errorMessage?: string;
  type?: 'options' | 'password' | 'search';
  options?: T[];
  getDisplayedValue?: (item: T) => string;
  getOptionLabel?: (item: T) => string;
  onSelectOption?: (item: T) => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
} & TextInputProps;

export function TextInput<T>({
  icon,
  valid = true,
  errorMessage,
  type,
  options,
  getDisplayedValue,
  getOptionLabel,
  onSelectOption,
  containerStyle,
  inputContainerStyle,
  ...inputConfig
}: Props<T>) {
  const { theme } = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const [value, setValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<T | null>(options?.[0] ?? null);
  const [isSecure, setIsSecure] = useState(type === 'password' ? true : false);
  const [isActive, setIsActive] = useState(false);

  const inputRef = useRef<NativeTextInput>(null);

  const errorHeight = useSharedValue(0);
  const errorOpacity = useSharedValue(0);

  useEffect(() => {
    if (errorMessage) {
      errorHeight.value = withTiming(20, { duration: 150 });
      errorOpacity.value = withTiming(1, { duration: 500 });
    } else {
      errorHeight.value = withTiming(0, { duration: 150 });
      errorOpacity.value = withTiming(0, { duration: 500 });
    }
  }, [errorMessage]);

  const animatedErrorContainerStyle = useAnimatedStyle(() => ({
    height: errorHeight.value,
  }));

  const animatedErrorTextStyle = useAnimatedStyle(() => ({
    opacity: errorOpacity.value,
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
    <Pressable
      style={[styles.container, containerStyle]}
      onPress={(event) => {
        inputConfig.onPress?.(event);
        inputRef.current?.focus();
      }}
    >
      <View
        style={[
          styles.inputContainer,
          { borderColor: isActive ? theme.secondary : Colors.grey },
          inputConfig.multiline && { alignItems: 'flex-start' },
          !valid && { borderColor: Colors.red },
          inputContainerStyle,
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
        <NativeTextInput
          ref={inputRef}
          style={[styles.input, { color: theme.text }, inputConfig.multiline && { height: 96 }]}
          placeholderTextColor={Colors.grey}
          secureTextEntry={isSecure}
          value={inputConfig.value || value}
          {...inputConfig}
          onChangeText={(value) => {
            setValue(value);
            inputConfig.onChangeText?.(value);
          }}
          onFocus={(event) => {
            setIsActive(true);
            inputConfig.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsActive(false);
            inputConfig.onBlur?.(event);
          }}
        />
        {type === 'options' && !!options?.length && getDisplayedValue && (
          <TouchableOpacity style={styles.button} onPress={openSheet}>
            <ThemedText style={styles.optionText}>
              {selectedOption ? getDisplayedValue(selectedOption) : getDisplayedValue(options[0])}
            </ThemedText>
          </TouchableOpacity>
        )}
        {type === 'password' && (
          <TouchableOpacity style={styles.button} onPress={() => setIsSecure((prev) => !prev)}>
            <Icon name={isSecure ? 'hide' : 'show'} size={20} color={Colors.grey} />
          </TouchableOpacity>
        )}
        {type === 'search' && value && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setValue('');
              inputConfig.onChangeText?.('');
            }}
          >
            <Icon name="close" size={20} color={Colors.grey} />
          </TouchableOpacity>
        )}
      </View>

      {errorMessage && (
        <Animated.View style={[styles.errorMessageContainer, animatedErrorContainerStyle]}>
          {errorMessage && (
            <ThemedText type="bodySmall" style={[styles.errorMessage, animatedErrorTextStyle]}>
              {errorMessage}
            </ThemedText>
          )}
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
    width: '100%',
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
    minWidth: 20,
  },
  button: {
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
