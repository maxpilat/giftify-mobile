import { Colors } from '@/constants/themes';
import { Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SuccessToast, ErrorToast, ToastProps } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: ToastProps) => {
    const { top } = useSafeAreaInsets();
    const marginTop = (Platform.OS === 'ios' ? top : (StatusBar.currentHeight || 20) + 10) - 45;

    return (
      <SuccessToast
        {...props}
        style={{
          marginTop,
          borderLeftWidth: 0,
          width: '100%',
          paddingHorizontal: 8,
          backgroundColor: 'transparent',
        }}
        contentContainerStyle={{
          backgroundColor: Colors.green,
          borderRadius: 40,
        }}
        text1Style={{
          fontSize: 16,
          fontFamily: 'stolzl-regular',
          color: Colors.white,
        }}
      />
    );
  },

  error: (props: ToastProps) => {
    const { top } = useSafeAreaInsets();
    const marginTop = (Platform.OS === 'ios' ? top : (StatusBar.currentHeight || 20) + 10) - 45;

    return (
      <ErrorToast
        {...props}
        style={{
          marginTop,
          borderLeftWidth: 0,
          width: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'transparent',
        }}
        contentContainerStyle={{
          backgroundColor: Colors.red,
          borderRadius: 40,
        }}
        text1Style={{
          fontSize: 16,
          fontFamily: 'stolzl-regular',
          color: Colors.white,
        }}
      />
    );
  },
};
