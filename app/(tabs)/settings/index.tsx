import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView, ScrollView, StyleSheet, View, Image, TouchableOpacity, Alert } from 'react-native';
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

  const fetchData = async () => {};

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

  const handleSignOut = async () => {
    Alert.alert('Подтвердите', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)');
        },
      },
    ]);
  };

  const handleDeactivateAccount = async () => {
    Alert.alert('Подтвердите', 'Вы уверены, что хотите безвозвратно удалить аккаунт?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить аккаунт',
        style: 'destructive',
        onPress: async () => {
          await deactivateAccount();
          router.replace('/(auth)');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText type="h1" style={styles.header}>
          Настройки
        </ThemedText>
        <View style={styles.content}>
          <View style={styles.body}>
            <View style={styles.mainInfo}>
              <Image
                source={avatar ? { uri: avatar } : require('@/assets/images/avatar.png')}
                style={[styles.avatar, { backgroundColor: theme.tabBarBorder }]}
              />
              <View style={styles.fullnameContainer}>
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

            <TextInput icon="user" placeholder="Никнейм" onChangeText={setUsername} />

            <View style={styles.actionsSection}>
              <TouchableOpacity style={styles.actionsSectionRow} onPress={() => router.push('/settings/changeEmail')}>
                <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
                  Изменить электронную почту
                </ThemedText>
                <Icon name="right" color={theme.primary} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.actionsSectionRow}
                onPress={() => router.push('/settings/changePassword')}
              >
                <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
                  Сменить пароль
                </ThemedText>
                <Icon name="right" color={theme.primary} />
              </TouchableOpacity>
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

            <View style={styles.genderPrivacyContainer}>
              <View style={styles.genderContainer}>
                <Checkbox isSelected={gender === 'Male'} onPress={() => handleGenderChange('Male')} label="Мужской" />
                <Checkbox
                  isSelected={gender === 'Female'}
                  onPress={() => handleGenderChange('Female')}
                  label="Женский"
                />
              </View>

              <View style={styles.privacyContainer}>
                <ThemedText type="bodyLargeMedium">Закрытый аккаунт</ThemedText>
                <Switch value={isPrivateAccount} onChange={handlePrivacyChange} />
              </View>
            </View>

            <View style={styles.actionsSection}>
              <TouchableOpacity style={styles.actionsSectionRow} onPress={() => router.push('/settings/changeTheme')}>
                <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
                  Тема приложения
                </ThemedText>
                <Icon name="right" color={theme.primary} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.actionsSectionRow} onPress={() => router.push('/settings/changeEmail')}>
                <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
                  Изменить цвета
                </ThemedText>
                <Icon name="right" color={theme.primary} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.actionsSectionRow} onPress={() => router.push('/settings/changeEmail')}>
                <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
                  Изменить фон профиля
                </ThemedText>
                <Icon name="right" color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.dangerZone}>
              <TouchableOpacity onPress={handleSignOut}>
                <ThemedText type="bodyLargeMedium" style={{ color: theme.primary }}>
                  Выход
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeactivateAccount}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 12,
  },
  content: {
    paddingBottom: 90,
    gap: 32,
    marginTop: 24,
  },
  body: {
    gap: 24,
  },
  mainInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  fullnameContainer: {
    flex: 1,
    gap: 16,
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
  genderPrivacyContainer: {
    marginVertical: 8,
    gap: 32,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    gap: 32,
  },
  dangerZone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});
