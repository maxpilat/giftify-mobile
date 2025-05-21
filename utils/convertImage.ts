import { EncodingType, readAsStringAsync } from 'expo-file-system';

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const binaryString = Array.from(new Uint8Array(buffer))
    .map((byte) => String.fromCharCode(byte))
    .join('');
  return `data:image;base64,${btoa(binaryString)}`;
}

export function binaryArrayToBase64(binaryArray: number[]): string {
  const binaryString = String.fromCharCode(...binaryArray);
  return `data:image;base64,${btoa(binaryString)}`;
}

export function base64ToBinaryArray(base64: string): number[] {
  const binaryString = atob(base64.split(',').pop() ?? '');
  return Array.from(binaryString, (char) => char.charCodeAt(0));
}

export async function uriToBase64(imageUri: string): Promise<string> {
  const base64 = await readAsStringAsync(imageUri, { encoding: EncodingType.Base64 });
  return `data:image;base64,${base64}`;
}
