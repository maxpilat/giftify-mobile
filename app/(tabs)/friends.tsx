import { StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ExternalLink } from '@/components/ExternalLink';

export default function FriendsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="h1">Explore</ThemedText>
        <ExternalLink href="https://www.google.com">Ссылка</ExternalLink>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '110%',
  },
});
