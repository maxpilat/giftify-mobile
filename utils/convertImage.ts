import { EncodingType, readAsStringAsync } from 'expo-file-system';
import { Buffer } from 'buffer';

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return `data:image;base64,${Buffer.from(buffer).toString('base64')}`;
}

export function binaryArrayToBase64(binaryArray: number[]): string {
  const buffer = Buffer.from(binaryArray);
  return `data:image;base64,${buffer.toString('base64')}`;
}

export function base64ToBinaryArray(base64: string): number[] {
  const base64Data = base64.split(',').pop() ?? '';
  const binaryString = atob(base64Data);
  const length = binaryString.length;
  const result = new Array<number>(length);

  for (let i = 0; i < length; i++) {
    result[i] = binaryString.charCodeAt(i);
  }

  return result;
}

export async function uriToBase64(imageUri: string): Promise<string> {
  const base64 = await readAsStringAsync(imageUri, { encoding: EncodingType.Base64 });
  return `data:image;base64,${base64}`;
}
