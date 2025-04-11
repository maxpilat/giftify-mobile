import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';

export type Props = {
  targetAmount: number;
  currentAmount: number;
};

export function ProgressBar({ targetAmount, currentAmount }: Props) {
  const { theme } = useTheme();

  return (
    <></>
  );
}

const styles = StyleSheet.create({

});
