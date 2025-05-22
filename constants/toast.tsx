import { Colors } from '@/constants/themes';
import { SuccessToast, ErrorToast, ToastProps } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: ToastProps) => (
    <SuccessToast
      {...props}
      style={{ borderLeftWidth: 0, borderRadius: 40 }}
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
  ),

  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftWidth: 0, borderRadius: 40 }}
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
  ),
};
