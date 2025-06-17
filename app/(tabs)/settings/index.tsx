import { ThemedText } from '@/components/ThemedText';
import { StyleSheet, View, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { Gender, SettingsData } from '@/models';
import { TextInput } from '@/components/TextInput';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@/components/Icon';
import { Colors } from '@/constants/themes';
import { dateToString, stringToDate } from '@/utils/formatDate';
import { Checkbox } from '@/components/Checkbox';
import { Switch } from '@/components/Switch';
import { PlatformButton } from '@/components/PlatformButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useAuth } from '@/hooks/useAuth';
import { Link, router, Stack } from 'expo-router';
import { apiFetchData } from '@/lib/api';
import { API, SUPPORT_BOT_URL } from '@/constants/api';
import { useStore } from '@/hooks/useStore';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { showToast } from '@/utils/showToast';
import { GestureHandlerRootView, RefreshControl, ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { user, signOut, deactivateAccount } = useAuth();
  const { avatar: myAvatar, changeAvatar } = useStore();

  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [birthDate, setBirthDate] = useState<Date>(new Date(2000, 0, 1));
  const [gender, setGender] = useState<Gender | null>(null);
  const [isPrivateAccount, setIsPrivateAccount] = useState<boolean>(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<'name' | 'surname' | 'username', string | undefined>>({
    name: undefined,
    surname: undefined,
    username: undefined,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData().finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const settings = await apiFetchData<SettingsData>({
      endpoint: API.settings.getSettings(user.id),
      token: user.token,
    });

    setName(settings.name);
    setSurname(settings.surname);
    setUsername(settings.username || user.email);
    settings.birthDate && setBirthDate(stringToDate(settings.birthDate));
    setGender(settings.isMan ? 'Male' : 'Female');
    setIsPrivateAccount(settings.isPrivate);
  };

  const pickAvatar = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      changeAvatar(uri)
        .then(() => showToast('success', 'Данные сохранены'))
        .catch(() => showToast('error', 'Не удалось сохранить данные'));
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleSurnameChange = (value: string) => {
    setSurname(value);
    setErrors((prev) => ({ ...prev, surname: undefined }));
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setErrors((prev) => ({ ...prev, username: undefined }));
  };

  const handleBirthDateChange = (value: Date) => {
    setBirthDate(value);
    setIsDatePickerVisible(false);
  };

  const handleGenderChange = (value: Gender) => {
    setGender(value === gender ? null : value);
  };

  const handlePrivacyChange = () => {
    setIsPrivateAccount((prev) => !prev);
  };

  const handleSignOut = () => {
    Alert.alert('Подтвердите', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: () => {
          AsyncStorage.clear();
          router.replace('/(auth)');
          signOut().catch(() => showToast('error', 'Не удалось выйти из аккаунта'));
        },
      },
    ]);
  };

  const handleDeactivateAccount = () => {
    Alert.alert('Подтвердите', 'Вы уверены, что хотите безвозвратно удалить аккаунт?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить аккаунт',
        style: 'destructive',
        onPress: () => {
          deactivateAccount().catch(() => showToast('error', 'Не удалось деактивировать аккаунт'));
          router.replace('/(auth)');
        },
      },
    ]);
  };

  const isValid = () => {
    let isValid = true;

    if (username.length < 2) {
      setErrors((prev) => ({ ...prev, username: 'Минимум 2 символа' }));
      isValid = false;
    }

    if (!name) {
      setErrors((prev) => ({ ...prev, name: 'Обязательное поле' }));
      isValid = false;
    }

    if (!surname) {
      setErrors((prev) => ({ ...prev, surname: 'Обязательное поле' }));
      isValid = false;
    }

    return isValid;
  };

  const saveSettings = () => {
    if (!isValid()) return;

    setIsSubmitting(true);

    const namePromise = apiFetchData({
      endpoint: API.settings.updateName,
      method: 'PUT',
      body: { email: user.email, newName: name, newSurname: surname },
      token: user.token,
    });

    const surnamePromise = apiFetchData({
      endpoint: API.settings.updateName,
      method: 'PUT',
      body: { email: user.email, newName: name, newSurname: surname },
      token: user.token,
    });

    const usernamePromise = apiFetchData({
      endpoint: API.settings.updateUsername,
      method: 'PUT',
      body: { email: user.email, newUsername: username || user.email },
      token: user.token,
    });

    const birthDatePromise = apiFetchData({
      endpoint: API.settings.updateBirthDate,
      method: 'PUT',
      body: { email: user.email, newBirthDate: dateToString(birthDate) },
      token: user.token,
    });

    const genderPromise = apiFetchData({
      endpoint: API.settings.updateGender,
      method: 'PUT',
      body: { email: user.email, newGender: gender === 'Male' ? true : false },
      token: user.token,
    });

    const privacyPromise = apiFetchData({
      endpoint: API.settings.updatePrivacy,
      method: 'PUT',
      body: { email: user.email, newPrivacy: isPrivateAccount },
      token: user.token,
    });

    Promise.all([namePromise, surnamePromise, usernamePromise, birthDatePromise, genderPromise, privacyPromise])
      .then(() => showToast('success', 'Данные сохранены'))
      .catch(() => showToast('error', 'Не удалось сохранить данные'))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Настройки',
          headerTitleStyle: {
            fontFamily: 'stolzl-medium',
            color: theme.text,
          },
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerLargeTitleStyle: {
            fontFamily: 'stolzl-medium',
            color: theme.text,
          },
          headerStyle: {
            backgroundColor: theme.background,
          },
          contentStyle: {
            backgroundColor: theme.background,
          },
          headerRight: () =>
            isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <TouchableOpacity onPress={saveSettings}>
                <ThemedText style={{ color: theme.primary }}>Сохранить</ThemedText>
              </TouchableOpacity>
            ),
        }}
      />
      <GestureHandlerRootView>
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          >
            <View style={styles.content}>
              <View style={styles.body}>
                <View style={styles.mainInfo}>
                  <TouchableOpacity activeOpacity={0.7} onPress={pickAvatar}>
                    <Image
                      source={myAvatar ? { uri: myAvatar } : require('@/assets/images/avatar.png')}
                      style={[styles.avatar, { backgroundColor: theme.tabBarBorder }]}
                    />
                  </TouchableOpacity>
                  <View style={styles.fullnameContainer}>
                    <TextInput
                      icon="user"
                      placeholder="Имя"
                      value={name}
                      valid={!errors.name}
                      errorMessage={errors.name}
                      onChangeText={handleNameChange}
                      returnKeyType="done"
                    />
                    <TextInput
                      icon="user"
                      placeholder="Фамилия"
                      value={surname}
                      valid={!errors.surname}
                      errorMessage={errors.surname}
                      onChangeText={handleSurnameChange}
                      returnKeyType="done"
                    />
                  </View>
                </View>

                <TextInput
                  icon="user"
                  placeholder="Никнейм"
                  value={username}
                  onChangeText={handleUsernameChange}
                  valid={!errors.username}
                  errorMessage={errors.username}
                  returnKeyType="done"
                  autoCapitalize="none"
                />

                <View style={styles.actionsSection}>
                  <TouchableOpacity
                    style={styles.actionsSectionRow}
                    onPress={() => router.push('/settings/changeEmail')}
                  >
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
                  onConfirm={handleBirthDateChange}
                  onCancel={() => setIsDatePickerVisible(false)}
                  accentColor={theme.primary}
                  confirmTextIOS="Сохранить"
                  cancelTextIOS="Отмена"
                  locale="ru"
                />

                <View style={styles.genderPrivacyContainer}>
                  <View style={styles.genderContainer}>
                    <Checkbox
                      isSelected={gender === 'Male'}
                      onPress={() => handleGenderChange('Male')}
                      label="Мужской"
                    />
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
                  <TouchableOpacity
                    style={styles.actionsSectionRow}
                    onPress={() => router.push('/settings/changeTheme')}
                  >
                    <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
                      Тема приложения
                    </ThemedText>
                    <Icon name="right" color={theme.primary} />
                  </TouchableOpacity>
                  <View style={styles.divider} />
                  <TouchableOpacity
                    style={styles.actionsSectionRow}
                    onPress={() => router.push('/settings/pickCustomColors')}
                  >
                    <ThemedText type="bodyLarge" style={{ color: theme.primary }}>
                      Изменить цвета
                    </ThemedText>
                    <Icon name="right" color={theme.primary} />
                  </TouchableOpacity>
                  <View style={styles.divider} />
                  <TouchableOpacity
                    style={styles.actionsSectionRow}
                    onPress={() => router.push('/settings/changeProfileBackground')}
                  >
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
                <Link asChild href={SUPPORT_BOT_URL}>
                  <PlatformButton>
                    <ThemedText type="bodyLargeMedium" parentBackgroundColor={theme.primary}>
                      Связаться с нами
                    </ThemedText>
                  </PlatformButton>
                </Link>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 16,
  },
  content: {
    paddingBottom: 90,
    marginTop: 16,
    gap: 32,
  },
  body: {
    gap: 24,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
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
