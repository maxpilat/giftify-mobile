type RequestOptions = {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  contetType?: 'application/json' | 'application/octet-stream';
  body?: object;
  token?: string;
};

export const apiFetch = async ({
  endpoint,
  method = 'GET',
  contetType = 'application/json',
  body,
  token,
}: RequestOptions) => {
  try {
    if (!token) throw new Error('Token Error');

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': contetType,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    if (contetType === 'application/json') return await response.json();
    return response;
  } catch (error) {
    console.error('Error in apiFetch:', error);
    throw error;
  }
};
