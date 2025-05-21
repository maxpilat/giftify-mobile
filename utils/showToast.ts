import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";

export const showToast = (type: "success" | "error", text: string) => {
  Toast.show({
    type,
    text1: text,
    onShow: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  });
};
