import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView, ScrollView, StyleSheet, View, Image, TouchableOpacity, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Gender } from '@/models';
import { TextInput } from '@/components/TextInput';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@/components/Icon';
import { Colors } from '@/constants/themes';
import { dateToString } from '@/utils/formatDate';
import { Checkbox } from '@/components/Checkbox';
import { Switch } from '@/components/Switch';
import { PlatformButton } from '@/components/PlatformButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function SettingsScreen() {
  const { theme } = useTheme();

  const [avatar, setAvatar] = useState<string>();
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [username, setUsername] = useState<string>();
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
  const [gender, setGender] = useState<Gender>();
  const [isPrivateAccount, setIsPrivateAccount] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<'name' | 'surname', string | undefined>>({
    name: undefined,
    surname: undefined,
  });

  return (
    <SafeAreaView>
      <ScrollView style={{ paddingHorizontal: 16, height: '100%' }}>
        <ThemedText type="h1">Настройки</ThemedText>
        <View style={{ flexDirection: 'row', gap: 32 }}>
          <Image
            source={avatar ? { uri: avatar } : require('@/assets/images/avatar.png')}
            style={[{ width: 110, height: 110, borderRadius: 55 }, { backgroundColor: theme.tabBarBorder }]}
          />
        </View>
        <View>
          <TextInput
            icon="user"
            placeholder="Имя"
            valid={!errors.name}
            errorMessage={errors.name}
            onChangeText={(value) => {
              setName(value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />
          <TextInput
            icon="user"
            placeholder="Фамилия"
            valid={!errors.surname}
            errorMessage={errors.surname}
            onChangeText={(value) => {
              setSurname(value);
              setErrors((prev) => ({ ...prev, surname: undefined }));
            }}
          />
        </View>
        <TextInput
          icon="user"
          placeholder="Никнейм"
          onChangeText={(value) => {
            setUsername(value);
          }}
        />
        <View style={{ backgroundColor: Colors.grey }}>
          <View style={{ flexDirection: 'row' }}>
            <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
              Изменить электронную почту
            </ThemedText>
            <Icon name="right" color={theme.primary} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
              Сменить пароль
            </ThemedText>
            <Icon name="right" color={theme.primary} />
          </View>
        </View>
        <Pressable onPress={() => setIsDatePickerVisible(true)}>
          <TextInput icon="user" placeholder="DD.MM.YYYY" value={dateToString(birthDate)} editable={false} />
        </Pressable>
        <DateTimePickerModal
          pickerComponentStyleIOS={{ minWidth: '100%' }}
          date={birthDate}
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(value) => {
            setBirthDate(value);
            setIsDatePickerVisible(false);
          }}
          onCancel={() => setIsDatePickerVisible(false)}
          accentColor={theme.primary}
          confirmTextIOS="Сохранить"
          cancelTextIOS="Отмена"
          locale="ru"
        />
        <View style={{ flexDirection: 'row' }}>
          <Checkbox isSelected={gender === 'Male'} onPress={() => setGender('Male')} label="Мужской" />
          <Checkbox isSelected={gender === 'Female'} onPress={() => setGender('Female')} label="Женский" />
        </View>
        <View>
          <ThemedText type="bodyLargeMedium">Закрытый аккаунт</ThemedText>
          <Switch value={isPrivateAccount} onChange={(prev) => setIsPrivateAccount(!prev)} />
        </View>
        <View style={{ backgroundColor: Colors.grey }}>
          <View style={{ flexDirection: 'row' }}>
            <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
              Тема приложения
            </ThemedText>
            <Icon name="right" color={theme.primary} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
              Изменить цвета
            </ThemedText>
            <Icon name="right" color={theme.primary} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
              Изменить фон профиля
            </ThemedText>
            <Icon name="right" color={theme.primary} />
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <ThemedText type="bodyLargeMedium" style={{ color: theme.primary }}>
              Выход
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity>
            <ThemedText type="bodyLargeMedium" style={{ color: Colors.red }}>
              Удалить аккаунт
            </ThemedText>
          </TouchableOpacity>
        </View>
        <PlatformButton>
          <ThemedText type="bodyLargeMedium" style={{ color: Colors.white }}>
            Связаться с нами
          </ThemedText>
        </PlatformButton>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
