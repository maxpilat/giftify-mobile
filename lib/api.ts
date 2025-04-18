// import { useAuthStore } from '@/store/useAuthStore';

import { REMOTE_URL } from '@/constants/api';

export const apiFetch = async (endpoint: string, method = 'GET', body?: object) => {
  // const token = useAuthStore.getState().token;
  const token =
    'eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MSwiZW1haWwiOiJwaWxhdG1kQG91dGxvb2suY29tIiwic3ViIjoicGlsYXRtZEBvdXRsb29rLmNvbSIsImlhdCI6MTc0NDkwODAxMCwiZXhwIjoxNzQ0OTk0NDEwfQ.3VyzwCO5ckyc4Ie5L9YhSeORcMB4y17XSxJ9BglxPSjR_3CiDjQwyy4jI-OOwyhYd-vQJw6gqdLC0JONTYXAnw';
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
