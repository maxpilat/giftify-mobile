import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { Appearance } from 'react-native';
import { Themes, Colors, Theme, ThemeType } from '@/constants/themes';
import { apiFetchData } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { SettingsData, ServerThemeType } from '@/models';

export const serverThemeToClient = (serverTheme: ServerThemeType): ThemeType | 'system' => {
  switch (serverTheme) {
    case 'TYPE_LIGHT':
      return 'light';
    case 'TYPE_DARK':
      return 'dark';
    case 'TYPE_SYSTEM':
      return 'system';
    default:
      throw new Error(`Unknown ServerThemeType: ${serverTheme}`);
  }
};

export const clientThemeToServer = (theme: ThemeType | 'system'): ServerThemeType => {
  switch (theme) {
    case 'light':
      return 'TYPE_LIGHT';
    case 'dark':
      return 'TYPE_DARK';
    case 'system':
      return 'TYPE_SYSTEM';
    default:
      throw new Error(`Unknown ThemeType: ${theme}`);
  }
};

const ThemeContext = createContext<{
  theme: Theme;
  themeType: ThemeType | 'system';
  changeTheme: (type: ThemeType | 'system') => void;
  updateCustomColors: (primary: string, secondary: string) => void;
} | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuth } = useAuth();

  const [themeType, setThemeType] = useState<ThemeType | 'system'>('system');
  const [systemThemeType, setSystemThemeType] = useState<ThemeType>(Appearance.getColorScheme() || 'light');
  const [customColors, setCustomColors] = useState<{ primary: string; secondary: string }>({
    primary: Colors.blue,
    secondary: Colors.orange,
  });

  const initThemeType = async () => {
    if (isAuth()) {
      const { themeType: storedThemeType } = await apiFetchData<SettingsData>({
        endpoint: API.settings.getSettings(user.userId),
        token: user.token,
      });

      if (storedThemeType) setThemeType(serverThemeToClient(storedThemeType));
    }
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemThemeType(colorScheme || 'light');
    });

    initThemeType();

    return () => subscription.remove();
  }, []);

  const theme: Theme = useMemo(
    () => ({
      ...Themes[themeType === 'system' ? systemThemeType : themeType],
      ...customColors,
    }),
    [themeType, systemThemeType, customColors]
  );

  const changeTheme = async (themeType: ThemeType | 'system') => {
    setThemeType(themeType);
    await apiFetchData({
      endpoint: API.settings.updateTheme,
      method: 'PUT',
      body: { email: user.email, newTheme: clientThemeToServer(themeType) },
      token: user.token,
    });
  };

  const updateCustomColors = (primary: string, secondary: string) => {
    setCustomColors({ primary, secondary });
  };

  return (
    <ThemeContext.Provider value={{ theme, themeType, changeTheme, updateCustomColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
