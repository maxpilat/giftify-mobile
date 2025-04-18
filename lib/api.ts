// import { useAuthStore } from '@/store/useAuthStore';

import { REMOTE_URL } from '@/constants/api';

export const apiFetch = async (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: object) => {
  // const token = useAuthStore.getState().token;
  const token =
    'eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MSwiZW1haWwiOiJwaWxhdG1kQG91dGxvb2suY29tIiwic3ViIjoicGlsYXRtZEBvdXRsb29rLmNvbSIsImlhdCI6MTc0NDk1Nzk0NywiZXhwIjoxNzQ1MDQ0MzQ3fQ.PWe6lRvfNmAhSj5ZOEbU8MnlD5UONAF5Pd-VglnMFJQUZIXW-fI-Onq8AuPP2HGEETJg92UJGOr2ruzIAXFa-w';
  if (!token) throw new Error('Token Error');

  const response = await fetch(`${REMOTE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};
