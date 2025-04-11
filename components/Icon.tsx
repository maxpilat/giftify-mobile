import { Icons } from '@/constants/icons';
import React from 'react';
import { StyleProp } from 'react-native';
import { NumberProp, SvgXml } from 'react-native-svg';

type Props = {
  name: keyof typeof Icons;
  size?: NumberProp;
  color?: string;
  style?: StyleProp<object>;
};

export function Icon({ name, size = 24, color, style }: Props) {
  return <SvgXml xml={Icons[name]} width={size} height={size} style={[style, { color }]} />;
}
