import { arrayBufferToBase64 } from '@/utils/imageConverter';

type RequestOptions = {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  contentType?: 'application/json' | 'application/octet-stream';
  body?: any;
  token?: string;
};

export const apiFetch = async ({
  endpoint,
  method = 'GET',
  contentType = 'application/json',
  body,
  token,
}: RequestOptions) => {
  try {
    const headers: Record<string, string> = { 'Content-Type': contentType };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    if (contentType === 'application/json') return await response.json();
    return arrayBufferToBase64(await response.arrayBuffer());
  } catch (error) {
    console.error('Error in apiFetch:', error);
    throw error;
  }
};
