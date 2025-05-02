import { Checkbox } from '@/components/Checkbox';
import { Colors } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { ScrollView, View } from 'react-native';

export default function ChangeThemeScreen() {
  const { changeTheme, themeType } = useTheme();

  return (
    <ScrollView style={{ paddingHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', gap: 24, paddingHorizontal: 24, paddingVertical: 15 }}>
        <Checkbox label="Светлая" isSelected={themeType === 'light'} onPress={() => changeTheme('light')} />
      </View>
      <View style={{ backgroundColor: Colors.grey }}></View>
      <View style={{ flexDirection: 'row', gap: 24, paddingHorizontal: 24, paddingVertical: 15 }}>
        <Checkbox label="Тёмная" isSelected={themeType === 'dark'} onPress={() => changeTheme('dark')} />
      </View>
      <View style={{ backgroundColor: Colors.grey }}></View>
      <View style={{ flexDirection: 'row', gap: 24, paddingHorizontal: 24, paddingVertical: 15 }}>
        <Checkbox label="Системная" isSelected={themeType === 'system'} onPress={() => changeTheme('system')} />
      </View>
    </ScrollView>
  );
}
