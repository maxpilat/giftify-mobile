import { arrayBufferToBase64 } from '@/utils/convertImage';

export type ApiFetchDataParams = {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any> | string;
  token?: string;
};

export const apiFetchData = async <T = void>({
  endpoint,
  method = 'GET',
  body,
  token,
}: ApiFetchDataParams): Promise<T> => {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(response);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error('Error in fetchData:', error);
    throw error;
  }
};

export type ApiFetchImageParams = {
  endpoint: string;
  token?: string;
};

export const apiFetchImage = async ({ endpoint, token }: ApiFetchImageParams): Promise<string> => {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/octet-stream' };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    return arrayBufferToBase64(await response.arrayBuffer());
  } catch (error) {
    console.error('Error in fetchImage:', error);
    throw error;
  }
};
