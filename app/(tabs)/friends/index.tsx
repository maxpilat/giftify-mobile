import { ThemedText } from '@/components/ThemedText';
import { View, Easing, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function FriendsScreen() {
  const { theme } = useTheme();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const getTabTextAnimatedStyle = (index: number) =>
    useAnimatedStyle(() => ({
      color: withTiming(currentTabIndex === index ? theme.background : theme.text, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      }),
    }));

  return (
    <View style={styles.container}>
      <ThemedText type="h1">Друзья</ThemedText>
      <View style={[styles.tabs]}>
        {['Список', 'Заявки'].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, currentTabIndex === index && { backgroundColor: theme.secondary }]}
            activeOpacity={0.7}
            onPress={() => setCurrentTabIndex(index)}
          >
            <ThemedText type="bodyLargeMedium" style={[getTabTextAnimatedStyle(index)]}>
              {tab}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  tabs: {
    flexDirection: 'row',
    borderRadius: 40,
    padding: 5,
    marginTop: 15,
    width: '100%',
  },
  tab: {
    flex: 1,
    padding: 8,
    borderRadius: 40,
    alignItems: 'center',
  },
});
