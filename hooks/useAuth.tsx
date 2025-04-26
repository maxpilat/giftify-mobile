import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API } from '@/constants/api';
import { AuthData } from '@/models';
import { apiFetchData } from '@/lib/api';

const AuthContext = createContext<{
  user: { userId: number; email: string; token: string };
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: {
    name: string;
    surname: string;
    email: string;
    password: string;
    friendEmail?: string;
  }) => Promise<void>;
  signOut: () => void;
  changePassword: (email: string, oldPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  isAuth: () => boolean;
} | null>(null);

export const AuthProvider = ({ children, initialUser }: { children: ReactNode; initialUser?: AuthData }) => {
  const [user, setUser] = useState<AuthData | null>(initialUser || null);

  // useEffect(() => {
  //   signOut();
  // }, []);

  const signUp = async (userData: {
    name: string;
    surname: string;
    email: string;
    password: string;
    friendEmail?: string;
  }) => {
    const { id: userId, token } = await apiFetchData<{ id: number; token: string }>({
      endpoint: API.auth.signUp,
      method: 'POST',
      body: userData,
    });

    const { password, friendEmail, ...filteredUserData } = userData;
    const newUser = { ...filteredUserData, userId, token };

    setUser(newUser);
    await SecureStore.setItemAsync('user', JSON.stringify(newUser));
  };

  const signIn = async (email: string, password: string) => {
    const { id: userId, token } = await apiFetchData<{ id: number; token: string }>({
      endpoint: API.auth.signIn,
      method: 'POST',
      body: { email, password },
    });

    const newUser = { userId, email, token };

    setUser(newUser);
    await SecureStore.setItemAsync('user', JSON.stringify(newUser));
  };

  const signOut = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync('user');
  };

  const changePassword = async (email: string, oldPassword: string, newPassword: string) => {
    await apiFetchData({
      endpoint: API.auth.changePassword,
      method: 'PUT',
      body: { email, oldPassword, newPassword },
    });
  };

  const resetPassword = async (email: string, newPassword: string) => {
    await apiFetchData({
      endpoint: API.auth.resetPassword,
      method: 'POST',
      body: { email, newPassword },
    });
  };

  const isAuth = () => Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user: { userId: user?.userId!, email: user?.email!, token: user?.token! },
        signIn,
        signUp,
        signOut,
        changePassword,
        resetPassword,
        isAuth,
      }}
    >
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
