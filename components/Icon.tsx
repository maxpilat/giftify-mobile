import React from 'react';
import { StyleProp } from 'react-native';
import { Icons } from '@/constants/Icons';
import { NumberProp, SvgXml } from 'react-native-svg';

export function Icon({
  name,
  size = 24,
  color,
  style,
}: {
  name: keyof typeof Icons;
  size?: NumberProp;
  color?: string;
  style?: StyleProp<object>;
}) {
  return <SvgXml xml={Icons[name]} width={size} height={size} style={[style, { color }]} />;
}
