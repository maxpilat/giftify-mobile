import React, { createContext, useContext, ReactNode, useState } from 'react';
import { API } from '@/constants/api';
import { apiFetch } from '@/lib/api';
import { AuthData } from '@/models';

const AuthContext = createContext<{
  user: AuthData;
  token: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: Omit<AuthData, 'userId'> & { name: string; surname: string }) => Promise<void>;
  signOut: () => void;
  isAuth: () => boolean;
} | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthData>({
    userId: 7,
    email: 'pilatmd@outlook.com',
    password: 'maxpil14012004',
  });
  const [token, setToken] = useState<string>(
    'eyJhbGciOiJIUzUxMiJ9.eyJpZCI6NywiZW1haWwiOiJwaWxhdG1kQG91dGxvb2suY29tIiwic3ViIjoicGlsYXRtZEBvdXRsb29rLmNvbSIsImlhdCI6MTc0NTE2MjYyOCwiZXhwIjoxNzQ1MjQ5MDI4fQ.zZf2u3CKHfJ9-vY_keCi4_v8NSzNwXdyfAfpCGer_v5MyP0jhrwe8epip74y0YLBuWqKFKDvdu8qrvFQD88a0Q'
  );

  const signIn = async (email: string, password: string) => {
    const response: Response = await apiFetch({
      endpoint: API.auth.signIn,
      method: 'POST',
      token,
      body: { email, password },
    });
    const { id: userId, token: userToken } = (await response.json()) as { id: number; token: string };

    setUser({ userId, email, password });
    setToken(userToken);
  };

  const signUp = async (userData: Omit<AuthData, 'userId'> & { name: string; surname: string }) => {
    const response: Response = await apiFetch({ endpoint: API.auth.signUp, method: 'POST', token, body: userData });
    const { id: userId, token: userToken } = (await response.json()) as { id: number; token: string };

    setUser({ ...userData, userId });
    setToken(userToken);
  };

  const signOut = () => {
    setUser({ userId: 0, email: '', password: '' });
    setToken('');
  };

  const isAuth = () => Boolean(user && token);

  return (
    <AuthContext.Provider value={{ user, token, signIn, signUp, signOut, isAuth }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};
