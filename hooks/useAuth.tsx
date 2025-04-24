import React, { createContext, useContext, ReactNode, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API } from '@/constants/api';
import { AuthData } from '@/models';
import { apiFetchData } from '@/lib/api';

const AuthContext = createContext<{
  user: AuthData;
  token: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: Omit<AuthData, 'userId'> & { name: string; surname: string }) => Promise<void>;
  signOut: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  isAuth: () => boolean;
} | null>(null);

export const AuthProvider = ({
  children,
  initialUser,
  initialToken,
}: {
  children: ReactNode;
  initialUser?: AuthData;
  initialToken?: string;
}) => {
  const [user, setUser] = useState<AuthData | null>(initialUser || null);
  const [token, setToken] = useState<string | null>(initialToken || null);

  const signIn = async (email: string, password: string) => {
    const { id: userId, token: userToken } = await apiFetchData<{ id: number; token: string }>({
      endpoint: API.auth.signIn,
      method: 'POST',
      body: { email, password },
    });

    const newUser = { userId, email, password };

    setUser(newUser);
    setToken(userToken);

    await SecureStore.setItemAsync('user', JSON.stringify(newUser));
    await SecureStore.setItemAsync('token', userToken);
  };

  const signUp = async (userData: Omit<AuthData, 'userId'> & { name: string; surname: string }) => {
    const { id: userId, token: userToken } = await apiFetchData<{ id: number; token: string }>({
      endpoint: API.auth.signUp,
      method: 'POST',
      body: userData,
    });

    const newUser = { ...userData, userId };

    setUser(newUser);
    setToken(userToken);

    await SecureStore.setItemAsync('user', JSON.stringify(newUser));
    await SecureStore.setItemAsync('token', userToken);
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);

    await SecureStore.deleteItemAsync('user');
    await SecureStore.deleteItemAsync('token');
  };

  const resetPassword = async (email: string, newPassword: string) => {
    await apiFetchData({
      endpoint: API.auth.changePassword,
      method: 'PUT',
      body: { email, oldPassword: user?.password, newPassword },
    });

    const updatedUser = { ...user, password: newPassword } as AuthData;
    setUser(updatedUser);
  };

  const isAuth = () => Boolean(user && token);

  return (
    <AuthContext.Provider value={{ user: user!, token: token!, signIn, signUp, signOut, resetPassword, isAuth }}>
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
