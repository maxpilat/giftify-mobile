import React from 'react';
import { StyleProp } from 'react-native';
import { Icons } from '@/constants/Icons';
import { SvgXml } from 'react-native-svg';

export function Icon({
  name,
  size = 24,
  color,
  style,
}: {
  name: keyof typeof Icons;
  size?: number;
  color: string;
  style?: StyleProp<any>;
}) {
  return <SvgXml xml={Icons[name]} width={size} height={size} style={[style, { color }]} />;
}
