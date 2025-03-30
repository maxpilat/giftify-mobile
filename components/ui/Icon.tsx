import { type IconName, Icons } from '@/constants/Icons';
import { StyleProp, Image, ImageStyle } from 'react-native';

export function Icon({
  name,
  color,
  size = 24,
  style,
}: {
  name: IconName;
  size?: number;
  color: string;
  style?: StyleProp<ImageStyle>;
  weight?: number;
}) {
  return (
    <Image
      source={Icons[name]}
      style={[
        {
          width: size,
          height: size,
          tintColor: color,
        },
        style,
      ]}
    />
  );
}
