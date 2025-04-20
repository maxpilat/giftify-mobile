import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { Appearance } from 'react-native';
import { Themes, Colors, Theme, ThemeType } from '@/constants/themes';

const ThemeContext = createContext<{
  theme: Theme;
  themeType: ThemeType | 'system';
  changeTheme: (type: ThemeType | 'system') => void;
  updateCustomColors: (primary: string, secondary: string) => void;
} | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
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

    return () => subscription.remove();
  }, []);

  const theme: Theme = useMemo(
    () => ({
      ...Themes[themeType === 'system' ? systemThemeType : themeType],
      ...customColors,
    }),
    [themeType, systemThemeType, customColors]
  );

  const changeTheme = (type: ThemeType | 'system') => {
    setThemeType(type);
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
