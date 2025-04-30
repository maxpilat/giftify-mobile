import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView, ScrollView, StyleSheet, View, Image, TouchableOpacity, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Gender, Profile, SettingsData } from '@/models';
import { TextInput } from '@/components/TextInput';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@/components/Icon';
import { Colors } from '@/constants/themes';
import { dateToString } from '@/utils/formatDate';
import { Checkbox } from '@/components/Checkbox';
import { Switch } from '@/components/Switch';
import { PlatformButton } from '@/components/PlatformButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { apiFetchData } from '@/lib/api';
import { API } from '@/constants/api';
import { useProfile } from '@/hooks/useProfile';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { user, signOut, deactivateAccount } = useAuth();
  const { avatar: myAvatar } = useProfile();

  const [avatar, setAvatar] = useState<string | null>(myAvatar || null);
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [username, setUsername] = useState<string>();
  const [birthDate, setBirthDate] = useState<Date>();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
  const [gender, setGender] = useState<Gender | null>(null);
  const [isPrivateAccount, setIsPrivateAccount] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<'name' | 'surname', string | undefined>>({
    name: undefined,
    surname: undefined,
  });

  const fetchData = async () => {
    const settingsData = await apiFetchData<SettingsData>({ endpoint: API.(user.userId) });
  };

  const handleGenderChange = (value: Gender) => {
    if (value === gender) {
      // fetch
      setGender(null);
    } else {
      // fetch
      setGender(value);
    }
  };

  const handlePrivacyChange = () => {
    // fetch
    setIsPrivateAccount((prev) => !prev);
  };

  const handleSignOut = () => {
    router.replace('../../(auth)');
    signOut();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 16 }}>
        <View style={{ paddingBottom: 90, paddingTop: 8 }}>
          <ThemedText type="h1">Настройки</ThemedText>
          <View style={{ gap: 24 }}>
            <View style={{ flexDirection: 'row', gap: 20, marginTop: 32 }}>
              <Image
                source={avatar ? { uri: avatar } : require('@/assets/images/avatar.png')}
                style={[{ width: 110, height: 110, borderRadius: 55 }, { backgroundColor: theme.tabBarBorder }]}
              />
              <View style={{ flex: 1, gap: 16 }}>
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
            </View>
            <TextInput
              icon="user"
              placeholder="Никнейм"
              onChangeText={(value) => {
                setUsername(value);
              }}
            />
            <View style={{ borderWidth: 1, borderColor: Colors.grey, borderRadius: 14 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 24,
                  paddingVertical: 15,
                }}
              >
                <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
                  Изменить электронную почту
                </ThemedText>
                <Icon name="right" color={theme.primary} />
              </View>
              <View style={{ height: 1, backgroundColor: Colors.grey }} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 24,
                  paddingVertical: 15,
                }}
              >
                <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
                  Сменить пароль
                </ThemedText>
                <Icon name="right" color={theme.primary} />
              </View>
            </View>
            <TextInput
              icon="user"
              placeholder="DD.MM.YYYY"
              value={birthDate && dateToString(birthDate)}
              editable={false}
              onPress={() => setIsDatePickerVisible(true)}
            />
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
            <View style={{ flexDirection: 'row', gap: 24, marginTop: 8 }}>
              <Checkbox isSelected={gender === 'Male'} onPress={() => handleGenderChange('Male')} label="Мужской" />
              <Checkbox isSelected={gender === 'Female'} onPress={() => handleGenderChange('Female')} label="Женский" />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <ThemedText type="bodyLargeMedium">Закрытый аккаунт</ThemedText>
              <Switch value={isPrivateAccount} onChange={handlePrivacyChange} />
            </View>
            <View style={{ borderWidth: 1, borderColor: Colors.grey, borderRadius: 14, marginTop: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 24,
                  paddingVertical: 15,
                }}
              >
                <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
                  Тема приложения
                </ThemedText>
                <Icon name="right" color={theme.primary} />
              </View>
              <View style={{ height: 1, backgroundColor: Colors.grey }} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 24,
                  paddingVertical: 15,
                }}
              >
                <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
                  Изменить цвета
                </ThemedText>
                <Icon name="right" color={theme.primary} />
              </View>
              <View style={{ height: 1, backgroundColor: Colors.grey }} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 24,
                  paddingVertical: 15,
                }}
              >
                <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
                  Изменить фон профиля
                </ThemedText>
                <Icon name="right" color={theme.primary} />
              </View>
            </View>
          </View>

          <View style={{ marginTop: 32, gap: 32 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 }}>
              <TouchableOpacity onPress={handleSignOut}>
                <ThemedText type="bodyLargeMedium" style={{ color: theme.primary }}>
                  Выход
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={deactivateAccount}>
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
