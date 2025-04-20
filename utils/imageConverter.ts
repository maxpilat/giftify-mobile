export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const binaryString = Array.from(new Uint8Array(buffer))
    .map((byte) => String.fromCharCode(byte))
    .join('');

  return `data:image;base64,${btoa(binaryString)}`;
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const binaryLength = binaryString.length;
  const buffer = new ArrayBuffer(binaryLength);
  const uintArray = new Uint8Array(buffer);

  for (let i = 0; i < binaryLength; i++) {
    uintArray[i] = binaryString.charCodeAt(i);
  }

  return buffer;
};
