import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { StyleSheet } from 'react-native';

export default function ChatsScreen() {
  return (
    <>
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Chats</ThemedText>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({});
