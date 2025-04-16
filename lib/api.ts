// import { useAuthStore } from '@/store/useAuthStore';

import { REMOTE_URL } from '@/constants/api';

export const apiRequest = async (endpoint: string, method = 'GET', body?: object) => {
  // const token = useAuthStore.getState().token;
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwic3ViIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDc5MjUwNSwiZXhwIjoxNzQ0ODc4OTA1fQ.cmSFTEQRTWUUYRB81l-EfAoupn9kG_XfR9YzQ2-emOe4O6-MCLsquWiQksKuJSEhvvsj5hptJgw8adZdlYkw2A";
  if (!token) throw new Error('Token Error');

  const response = await fetch(`${REMOTE_URL}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};
