import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { Themes, Colors, Theme, type ThemeType } from '@/constants/Themes';

const ThemeContext = createContext<{
  theme: Theme;
  themeType: ThemeType | 'system';
  changeTheme: (themeType: ThemeType | 'system') => void;
  updateCustomColors: (primary: string, secondary: string) => void;
} | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeType, setCurrentThemeType] = useState<ThemeType | 'system'>('system');
  const [currentSystemThemeType, setCurrentSystemThemeType] = useState<ThemeType>(
    Appearance.getColorScheme() || 'light'
  );
  const [currentCustomColors, setCurrentCustomColors] = useState<{ primary: string; secondary: string }>({
    primary: Colors.primary,
    secondary: Colors.secondary,
  });

  const currentTheme: Theme = useMemo(
    () => ({
      ...Themes[currentThemeType === 'system' ? currentSystemThemeType : currentThemeType],
      ...currentCustomColors,
    }),
    [currentThemeType, currentSystemThemeType, currentCustomColors]
  );

  useEffect(() => {
    setupSystemThemeSubscription();
  }, []);

  const setupSystemThemeSubscription = async () => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setCurrentSystemThemeType(colorScheme || 'light');
    });

    return () => subscription.remove();
  };

  const changeTheme = async (themeType: ThemeType | 'system') => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCurrentThemeType(themeType);
  };

  const updateCustomColors = async (primary: string, secondary: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCurrentCustomColors({ primary, secondary });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        themeType: currentThemeType,
        changeTheme,
        updateCustomColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext)!;
