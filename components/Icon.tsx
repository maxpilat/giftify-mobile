import { Icons } from '@/constants/icons';
import { Colors } from '@/constants/themes';
import { StyleProp } from 'react-native';
import { NumberProp, SvgXml } from 'react-native-svg';
import { colorKit } from 'reanimated-color-picker';

type Props = {
  name: keyof typeof Icons;
  size?: NumberProp;
  color?: string;
  parentBackgroundColor?: string;
  style?: StyleProp<object>;
};

export function Icon({ name, size = 24, color, parentBackgroundColor, style }: Props) {
  const getColor = () => {
    if (color) return color;
    if (parentBackgroundColor) {
      return colorKit.isDark(parentBackgroundColor) ? Colors.white : Colors.black;
    }
    return Colors.white;
  };

  return <SvgXml xml={Icons[name]} width={size} height={size} style={[style, { color: getColor() }]} />;
}
