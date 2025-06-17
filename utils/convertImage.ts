import { EncodingType, readAsStringAsync } from 'expo-file-system';
import { fromByteArray, toByteArray } from 'base64-js';

export function binaryToBase64(binaryData: number[] | ArrayBuffer): string {
  const base64Data = fromByteArray(new Uint8Array(binaryData));
  return `data:image;base64,${base64Data}`;
}

export function base64ToBinaryArray(base64: string): number[] {
  const base64Data = base64.split(',').pop() ?? '';
  return Array.from(toByteArray(base64Data));
}

export async function uriToBase64(imageUri: string): Promise<string> {
  const base64 = await readAsStringAsync(imageUri, { encoding: EncodingType.Base64 });
  return `data:image;base64,${base64}`;
}
