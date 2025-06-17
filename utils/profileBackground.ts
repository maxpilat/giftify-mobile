import { ProfileBackground } from '@/models';
import { Asset } from 'expo-asset';
import { Image } from 'react-native';

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
    id: assets.indexOf(asset) + 1,
    backgroundImage: asset.localUri!,
  }));
}

export function getDefaultBackground(): ProfileBackground {
  return {
    id: 1,
    backgroundType: 'TYPE_IMAGE',
    backgroundImage: Image.resolveAssetSource(require('@/assets/images/bg-01.jpeg')).uri,
  };
}
