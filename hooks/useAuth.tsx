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
  const [user, setUser] = useState<AuthData>();
  const [token, setToken] = useState<string>();

  const signIn = async (email: string, password: string) => {
    const { id: userId, token: userToken }: { id: number; token: string } = await apiFetch({
      endpoint: API.auth.signIn,
      method: 'POST',
      token,
      body: { email, password },
    });

    setUser({ userId, email, password });
    setToken(userToken);
  };

  const signUp = async (userData: Omit<AuthData, 'userId'> & { name: string; surname: string }) => {
    const { id: userId, token: userToken }: { id: number; token: string } = await apiFetch({
      endpoint: API.auth.signUp,
      method: 'POST',
      body: userData,
    });

    setUser({ ...userData, userId });
    setToken(userToken);
  };

  const signOut = () => {
    setUser({ userId: 0, email: '', password: '' });
    setToken('');
  };

  const isAuth = () => Boolean(user && token);

  return (
    <AuthContext.Provider value={{ user: user!, token: token!, signIn, signUp, signOut, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};
