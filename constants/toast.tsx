import { Colors } from '@/constants/themes';
import { SuccessToast, ErrorToast, ToastProps } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: ToastProps) => (
    <SuccessToast
      {...props}
      style={{
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
  ),

  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{
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
  ),
};
