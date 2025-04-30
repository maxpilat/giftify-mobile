import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@/components/Icon';

type Props = {
  label?: string;
  isSelected?: boolean;
  onPress?: () => void;
};

export const Checkbox = ({ label, isSelected, onPress }: Props) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.checkbox, isSelected && { borderColor: theme.primary, backgroundColor: theme.primary }]}
      onPress={onPress}
    >
      {isSelected && <Icon name="accept" size={14} />}
      <ThemedText type="bodyLarge">{label}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: Colors.grey,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 2.5,
  },
});
