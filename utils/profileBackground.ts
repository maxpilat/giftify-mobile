import { ProfileBackground } from '@/models';
import { Asset } from 'expo-asset';
import { Colors, ThemeType } from '@/constants/themes';

export async function loadDefaultBackgrounds(): Promise<ProfileBackground[]> {
  const assets = [
    Asset.fromModule(require('@/assets/images/bg-01.jpeg')),
    Asset.fromModule(require('@/assets/images/bg-02.jpeg')),
    Asset.fromModule(require('@/assets/images/bg-03.jpeg')),
    Asset.fromModule(require('@/assets/images/bg-04.jpeg')),
  ];

  await Promise.all(assets.map((asset) => asset.downloadAsync()));

  return assets.map((asset) => ({
    backgroundType: 'TYPE_IMAGE',
    backgroundId: assets.indexOf(asset) + 1,
    backgroundUri: asset.localUri!,
  }));
}

export function getDefaultBackground(themeType: ThemeType): ProfileBackground {
  return {
    backgroundId: 0,
    backgroundType: 'TYPE_COLOR',
    backgroundColor: themeType === 'light' ? Colors.light : Colors.darkBlue,
  };
}
