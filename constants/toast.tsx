import { Colors, ThemeType } from '@/constants/themes';
import { SuccessToast, ErrorToast, ToastProps } from 'react-native-toast-message';

export const toastConfig = (themeType: ThemeType) => ({
  success: (props: ToastProps) => (
    <SuccessToast
      {...props}
      contentContainerStyle={{ backgroundColor: themeType === 'dark' ? Colors.darkBlue : Colors.white }}
      text1Style={{
        fontSize: 16,
        fontFamily: 'stolzl-regular',
        color: themeType === 'dark' ? Colors.white : Colors.black,
      }}
    />
  ),

  error: (props: ToastProps) => (
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
  ),
});
