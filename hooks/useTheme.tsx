import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { Appearance } from 'react-native';
import { Themes, Colors, Theme, ThemeType } from '@/constants/themes';
import { apiFetchData } from '@/lib/api';
import { API } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { SettingsData, ApiThemeType } from '@/models';

export const serverThemeToClient = (serverTheme: ApiThemeType): ThemeType | 'system' => {
  switch (serverTheme) {
    case 'TYPE_LIGHT':
      return 'light';
    case 'TYPE_DARK':
      return 'dark';
    case 'TYPE_SYSTEM':
      return 'system';
  }
};

export const clientThemeToServer = (theme: ThemeType | 'system'): ApiThemeType => {
  switch (theme) {
    case 'light':
      return 'TYPE_LIGHT';
    case 'dark':
      return 'TYPE_DARK';
    case 'system':
      return 'TYPE_SYSTEM';
  }
};

const ThemeContext = createContext<{
  theme: Theme;
  themeType: ThemeType | 'system';
  systemThemeType: ThemeType;
  changeTheme: (type: ThemeType | 'system') => Promise<void>;
  updateCustomColors: (primary: string, secondary: string) => Promise<void>;
} | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuth } = useAuth();

  const [themeType, setThemeType] = useState<ThemeType | 'system'>('system');
  const [systemThemeType, setSystemThemeType] = useState<ThemeType>(Appearance.getColorScheme() || 'light');
  const [customColors, setCustomColors] = useState<{ primary: string; secondary: string }>({
    primary: Colors.blue,
    secondary: Colors.orange,
  });

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemThemeType(colorScheme || 'light');
    });

    initThemeType();

    return () => subscription.remove();
  }, []);

  const initThemeType = async () => {
    if (isAuth()) {
      const { themeType: storedThemeType } = await apiFetchData<SettingsData>({
        endpoint: API.settings.getSettings(user.id),
        token: user.token,
      });

      if (storedThemeType) setThemeType(serverThemeToClient(storedThemeType));
    }
  };

  const theme: Theme = useMemo(
    () => ({
      ...Themes[themeType === 'system' ? systemThemeType : themeType],
      ...customColors,
    }),
    [themeType, systemThemeType, customColors]
  );

  const changeTheme = async (themeType: ThemeType | 'system') => {
    try {
      setThemeType(themeType);
      await apiFetchData({
        endpoint: API.settings.updateTheme,
        method: 'PUT',
        body: { email: user.email, newTheme: clientThemeToServer(themeType) },
        token: user.token,
      });
    } catch (error) {
      throw error;
    }
  };

  const updateCustomColors = async (primary: string, secondary: string) => {
    try {
      setCustomColors({ primary, secondary });
      await apiFetchData({
        endpoint: API.settings.updateColors,
        method: 'PUT',
        body: { email: user.email, newPrimaryColor: primary, newSecondaryColor: secondary },
        token: user.token,
      });
    } catch (error) {
      throw error;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeType, systemThemeType, changeTheme, updateCustomColors }}>
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
