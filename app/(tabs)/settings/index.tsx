import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <>
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Settings</ThemedText>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({});
