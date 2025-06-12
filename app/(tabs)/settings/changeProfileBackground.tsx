import { Icon } from '@/components/Icon';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, Image, ScrollView, Pressable } from 'react-native';
import { useStore } from '@/hooks/useStore';
import { ProfileBackground } from '@/models';
import { getDefaultBackground } from '@/utils/profileBackground';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { showToast } from '@/utils/showToast';

export default function ChangeProfileBackgroundScreen() {
  const { theme, themeType, systemThemeType } = useTheme();
  const { allBackgrounds, background, fetchAllBackgrounds, changeBackground, addBackgroundImage } = useStore();

  useEffect(() => {
    fetchAllBackgrounds();
  }, []);

  const handleSelectBackground = (newBackground: ProfileBackground) => {
    changeBackground(
      background.id === newBackground.id
        ? getDefaultBackground(themeType === 'system' ? systemThemeType : themeType)
        : newBackground
    )
      .then(() => showToast('success', 'Фон изменён'))
      .catch(() => showToast('error', 'Не удалось изменить фон'));
  };

  const pickImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      addBackgroundImage(uri)
        .then(changeBackground)
        .then(() => showToast('success', 'Фон изменён'))
        .catch(() => showToast('error', 'Не удалось изменить фон'));
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionsSectionRow}
          onPress={() => router.push('/settings/pickProfileBackgroundColor')}
        >
          <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
            Задать цвет
          </ThemedText>
          <Icon name="right" color={theme.primary} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.actionsSectionRow} onPress={pickImage}>
          <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
            Выбрать из галереи
          </ThemedText>
          <Icon name="right" color={theme.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        style={[styles.backgrounds, { backgroundColor: theme.subBackground }]}
        contentContainerStyle={styles.backgroundsContentContainer}
        data={allBackgrounds}
        renderItem={({ item, index }) => (
          <View style={[styles.backgroundWrapper, { [index % 2 === 0 ? 'marginRight' : 'marginLeft']: 5 }]}>
            <Pressable style={styles.background} onPress={() => handleSelectBackground(item)}>
              <Image style={styles.backgroundImage} source={{ uri: item.backgroundImage }} />
              {item.id === background.id && (
                <View style={styles.acceptIcon}>
                  <Icon name="accept" color={Colors.white} />
                </View>
              )}
            </Pressable>
          </View>
        )}
        numColumns={2}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 110,
  },
  actionsSection: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 14,
  },
  actionsSectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grey,
  },
  backgrounds: {
    padding: 12,
    borderRadius: 34,
    marginTop: 24,
  },
  backgroundsContentContainer: {
    gap: 10,
  },
  backgroundWrapper: {
    flex: 1,
  },
  background: {
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  acceptIcon: {
    padding: 14,
    borderRadius: 26,
    position: 'absolute',
    backgroundColor: Colors.black,
  },
});
