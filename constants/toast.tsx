import { Colors, ThemeType } from '@/constants/themes';
import { SafeAreaView } from 'react-native';
import { SuccessToast, ErrorToast, ToastProps } from 'react-native-toast-message';

export const toastConfig = (themeType: ThemeType) => ({
  success: (props: ToastProps) => (
    <SafeAreaView>
      <SuccessToast
        {...props}
        contentContainerStyle={{ backgroundColor: themeType === 'dark' ? Colors.darkBlue : Colors.white }}
        text1Style={{
          fontSize: 16,
          fontFamily: 'stolzl-regular',
          color: themeType === 'dark' ? Colors.white : Colors.black,
        }}
      />
    </SafeAreaView>
  ),

  error: (props: ToastProps) => (
    <SafeAreaView>
      <ErrorToast
        {...props}
        style={{ borderLeftColor: 'red' }}
        contentContainerStyle={{
          backgroundColor: themeType === 'dark' ? Colors.darkBlue : Colors.white,
        }}
        text1Style={{
          fontSize: 16,
          fontFamily: 'stolzl-regular',
          color: themeType === 'dark' ? Colors.white : Colors.black,
        }}
      />
    </SafeAreaView>
  ),
});
