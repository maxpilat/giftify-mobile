import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
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
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.checkbox, isSelected && { borderColor: theme.primary, backgroundColor: theme.primary }]}>
        {isSelected && <Icon name="accept" size={12} color={Colors.white} />}
      </View>
      <ThemedText type="bodyLarge">{label}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.grey,
    borderWidth: 0.5,
    borderRadius: 4,
    padding: 2.5,
  },
});
