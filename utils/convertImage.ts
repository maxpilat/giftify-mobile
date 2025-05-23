import { EncodingType, readAsStringAsync } from 'expo-file-system';
import { fromByteArray, toByteArray } from 'base64-js';

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return `data:image;base64,${fromByteArray(new Uint8Array(buffer))}`;
}

export function binaryArrayToBase64(binaryArray: number[]): string {
  return `data:image;base64,${fromByteArray(new Uint8Array(binaryArray))}`;
}

export function base64ToBinaryArray(base64: string): number[] {
  const base64Data = base64.split(',').pop() ?? '';
  return Array.from(toByteArray(base64Data));
}

export async function uriToBase64(imageUri: string): Promise<string> {
  const base64 = await readAsStringAsync(imageUri, { encoding: EncodingType.Base64 });
  return `data:image;base64,${base64}`;
}
