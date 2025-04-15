import React from 'react';
import { StyleSheet, TextInput as NativeTextInput, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Colors } from '@/constants/themes';
import { Icons } from '@/constants/icons';

type Props = {
  placeholder?: string;
  value?: string;
  onChangeValue?: (text: string) => void;
  icon?: keyof typeof Icons;
};

export function TextInput({ icon, placeholder, value, onChangeValue }: Props) {
  return (
    <View style={[styles.container, { borderColor: Colors.grey }]}>
      {icon && <Icon name={icon} color={Colors.grey} size={16} />}
      <NativeTextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.grey}
        value={value}
        onChangeText={onChangeValue}
      />
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
});
