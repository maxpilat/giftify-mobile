import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { StyleSheet } from 'react-native';

export default function FriendsScreen() {
  return (
    <>
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Friends</ThemedText>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({});
