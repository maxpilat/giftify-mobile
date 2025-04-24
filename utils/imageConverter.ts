import { EncodingType, readAsStringAsync } from 'expo-file-system';

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const binaryString = Array.from(new Uint8Array(buffer))
    .map((byte) => String.fromCharCode(byte))
    .join('');

  return `data:image;base64,${btoa(binaryString)}`;
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const cleanBase64 = base64.startsWith('data:image') ? base64.split(',')[1] : base64;

  const binaryString = atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

export async function uriToBase64(imageUri: string): Promise<string> {
  const base64 = await readAsStringAsync(imageUri, { encoding: EncodingType.Base64 });
  return `data:image;base64,${base64}`;
}
