import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Google from 'expo-auth-session/providers/google';
import { API } from '@/constants/api';
import { AuthData } from '@/models';
import { apiFetchData } from '@/lib/api';

const AuthContext = createContext<{
  user: AuthData;
  signIn: (email: string, password: string) => Promise<AuthData>;
  signUp: (userData: {
    name: string;
    surname: string;
    email: string;
    password: string;
    friendEmail?: string;
  }) => Promise<AuthData>;
  signOut: () => Promise<void>;
  deactivateAccount: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  changeEmail: (newEmail: string) => Promise<void>;
  isAuth: () => boolean;
  handleGoogleAuth: () => Promise<void>;
} | null>(null);

export const AuthProvider = ({ children, initialUser }: { children: ReactNode; initialUser?: AuthData }) => {
  const [user, setUser] = useState<AuthData | null>(initialUser || null);
  const [_, googleResponse, startGoogleAuth] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    const authenticateGoogleUser = async () => {
      if (googleResponse?.type === 'success' && googleResponse.authentication?.idToken) {
        const idToken = googleResponse.authentication.idToken;

        const { id, email, token } = await apiFetchData<AuthData>({
          endpoint: API.auth.google,
          method: 'POST',
          body: { idToken },
        });

        const newUser = { id, email, token };
        setUser(newUser);
        await SecureStore.setItemAsync('user', JSON.stringify(newUser));
      }
    };

    authenticateGoogleUser();
  }, [googleResponse]);

  const handleGoogleAuth = async () => {
    await startGoogleAuth();
  };

  const signUp = async (userData: {
    name: string;
    surname: string;
    email: string;
    password: string;
    friendEmail?: string;
  }) => {
    const newUser = await apiFetchData<AuthData>({
      endpoint: API.auth.signUp,
      method: 'POST',
      body: userData,
    });

    setUser(newUser);
    await SecureStore.setItemAsync('user', JSON.stringify(newUser));

    return newUser;
  };

  const signIn = async (email: string, password: string) => {
    const newUser = await apiFetchData<AuthData>({
      endpoint: API.auth.signIn,
      method: 'POST',
      body: { email, password },
    });

    setUser(newUser);
    await SecureStore.setItemAsync('user', JSON.stringify(newUser));

    return newUser;
  };

  const signOut = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync('user');
  };

  const deactivateAccount = async () => {
    if (user) {
      setUser(null);
      await apiFetchData({ endpoint: API.auth.deactivateAccount(user.id), method: 'DELETE' });
      await SecureStore.deleteItemAsync('user');
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    await apiFetchData({
      endpoint: API.auth.updatePassword,
      method: 'PUT',
      body: { email: user?.email, oldPassword, newPassword },
    });
  };

  const resetPassword = async (email: string, newPassword: string) => {
    await apiFetchData({
      endpoint: API.auth.resetPassword,
      method: 'POST',
      body: { email, newPassword },
    });
  };

  const changeEmail = async (newEmail: string) => {
    await apiFetchData({
      endpoint: API.settings.updateEmail,
      method: 'PUT',
      body: { email: user?.email, newEmail },
    });
  };

  const isAuth = () => Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user: { id: user?.id!, email: user?.email!, token: user?.token! },
        signIn,
        signUp,
        signOut,
        deactivateAccount,
        changePassword,
        resetPassword,
        changeEmail,
        isAuth,
        handleGoogleAuth,
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
