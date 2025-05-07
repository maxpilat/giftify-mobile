import { PlatformButton } from '@/components/PlatformButton';
import { TextInput } from '@/components/TextInput';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/themes';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';
import { ProfileBackground } from '@/models';
import { getDefaultBackground } from '@/utils/profileBackground';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ColorPicker, { Panel2, BrightnessSlider, colorKit } from 'reanimated-color-picker';

export default function PickProfileBackgroundColorScreen() {
  const { theme, themeType, systemThemeType } = useTheme();
  const themeTypeValue = themeType === 'system' ? systemThemeType : themeType;

  const { background, changeBackground } = useProfile();

  const [currentBackground, setCurrentBackground] = useState<ProfileBackground>(background);
  const [textInputValue, setTextInputValue] = useState(background.backgroundColor);
  const [error, setError] = useState('');

  const handleColorChange = (color: string) => {
    setError('');
    setTextInputValue(color);

    let background: ProfileBackground = { backgroundType: 'TYPE_COLOR', backgroundColor: color };

    if (!colorKit.getFormat(color)) {
      setError('Неверный формат цвета');
      background = getDefaultBackground(themeTypeValue);
    }

    setCurrentBackground(background);
  };

  const handleSubmit = () => {
    changeBackground(currentBackground);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={[styles.preview]}>
          <View style={[styles.outerCircle, { borderColor: currentBackground.backgroundColor }]}>
            <View style={[styles.innerCircle, { backgroundColor: currentBackground.backgroundColor }]} />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput
              inputContainerStyle={{ backgroundColor: theme.background }}
              errorMessage={error}
              icon="user"
              value={textInputValue}
              onChangeText={handleColorChange}
            />
          </View>
        </View>
        <ColorPicker value={currentBackground.backgroundColor} onCompleteJS={(color) => handleColorChange(color.hex)}>
          <Panel2 style={{ borderRadius: 0 }} />
          <BrightnessSlider />
        </ColorPicker>
      </View>

      <View style={styles.controls}>
        <PlatformButton style={[styles.button, { backgroundColor: Colors.black }]} onPress={router.back}>
          <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
            Отмена
          </ThemedText>
        </PlatformButton>
        <PlatformButton style={styles.button} onPress={handleSubmit}>
          <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
            Применить
          </ThemedText>
        </PlatformButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    width: '50%',
    padding: 8,
    borderRadius: 40,
    alignItems: 'center',
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
  },
  outerCircle: {
    width: 36,
    height: 36,
    borderRadius: '100%',
    borderWidth: 2,
    justifyContent: 'center',
    alignContent: 'center',
  },
  innerCircle: {
    borderRadius: '100%',
    flex: 1,
    margin: 2,
  },
  textInputContainer: {
    flex: 1,
    borderRadius: 14,
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
  },
  button: {
    flex: 1,
  },
  buttonText: {
    color: Colors.white,
  },
});
