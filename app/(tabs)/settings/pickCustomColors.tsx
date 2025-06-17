import { ColorPickerThumb } from '@/components/ColorPickerThumb';
import { PlatformButton } from '@/components/PlatformButton';
import { TextInput } from '@/components/TextInput';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { showToast } from '@/utils/showToast';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ColorPicker, { Panel2, BrightnessSlider, colorKit } from 'reanimated-color-picker';

export default function PickCustomColorsScreen() {
  const { theme, updateCustomColors } = useTheme();

  const [tabIndex, setTabIndex] = useState(0);
  const [primaryColor, setPrimaryColor] = useState<string>(theme.primary);
  const [secondaryColor, setSecondaryColor] = useState<string>(theme.secondary);
  const currentColor = tabIndex === 0 ? primaryColor : secondaryColor;
  const [textInputValue, setTextInputValue] = useState(currentColor);
  const [error, setError] = useState('');

  useEffect(() => {
    setTextInputValue(currentColor);
  }, [currentColor]);

  const handleColorChange = (color: string) => {
    setError('');
    setTextInputValue(color);

    if (!colorKit.getFormat(color)) {
      setError('Неверный формат цвета');
      color = tabIndex === 0 ? theme.primary : theme.secondary;
    }

    (tabIndex === 0 ? setPrimaryColor : setSecondaryColor)(color);
  };

  const handleSubmit = (primaryColor: string, secondaryColor: string) => {
    updateCustomColors(primaryColor, secondaryColor)
      .then(() => showToast('success', 'Цвета обновлены'))
      .catch(() => showToast('error', 'Не удалось обновить цвета'));
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {['Основной', 'Дополнительный'].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, tabIndex === index && { backgroundColor: theme.secondary }]}
            onPress={() => {
              setTabIndex(index);
            }}
          >
            <ThemedText
              type="bodyLargeMedium"
              parentBackgroundColor={tabIndex === index ? theme.secondary : theme.background}
            >
              {tab}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.colorPickerContainer}>
        <View style={[styles.preview]}>
          <View style={[styles.outerCircle, { borderColor: currentColor }]}>
            <View style={[styles.innerCircle, { backgroundColor: currentColor }]} />
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
        <ColorPicker value={currentColor} onCompleteJS={(color) => handleColorChange(color.hex)}>
          <Panel2 style={{ borderRadius: 0 }} />
          <BrightnessSlider
            sliderThickness={40}
            style={{ borderRadius: 24, marginHorizontal: 16 }}
            renderThumb={ColorPickerThumb}
          />
        </ColorPicker>
      </View>

      <View style={styles.controls}>
        <PlatformButton style={[styles.button, { backgroundColor: Colors.black }]} onPress={router.back}>
          <ThemedText type="bodyLargeMedium" style={styles.buttonText}>
            Отмена
          </ThemedText>
        </PlatformButton>
        <PlatformButton style={styles.button} onPress={() => handleSubmit(primaryColor, secondaryColor)}>
          <ThemedText type="bodyLargeMedium" parentBackgroundColor={theme.primary}>
            Применить
          </ThemedText>
        </PlatformButton>
      </View>

      <TouchableOpacity onPress={() => handleSubmit(Colors.blue, Colors.orange)}>
        <ThemedText type="bodyLargeMedium" style={{ color: theme.primary }}>
          Сбросить настройки цвета
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    gap: 36,
    alignItems: 'center',
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
  colorPickerContainer: {
    width: '100%',
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
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignContent: 'center',
  },
  innerCircle: {
    borderRadius: 18,
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
