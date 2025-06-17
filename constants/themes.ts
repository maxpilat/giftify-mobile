export const Colors = {
  blue: '#0F53FF',
  lightBlue: '#CFDDFF',
  darkBlue: '#1D2028',
  orange: '#FF740F',
  green: '#0FA002',
  red: '#A02C02',
  white: '#FFFFFF',
  black: '#111318',
  grey: '#88898B',
  light: '#D6D6D6',
  dark: '#474747',
} as const;

export type ThemeType = 'light' | 'dark';

export interface Theme {
  text: string;
  background: string;
  subBackground: string;
  tabBarBorder: string;
  primary: string;
  secondary: string;
  button: string;
  tabBarTint: string;
}

export const Themes: { light: Theme; dark: Theme } = {
  light: {
    text: Colors.black,
    background: Colors.white,
    subBackground: Colors.light,
    tabBarBorder: Colors.light,
    primary: Colors.blue,
    secondary: Colors.orange,
    button: Colors.black,
    tabBarTint: Colors.black,
  },
  dark: {
    text: Colors.white,
    background: Colors.black,
    subBackground: Colors.darkBlue,
    tabBarBorder: Colors.dark,
    primary: Colors.blue,
    secondary: Colors.orange,
    button: Colors.darkBlue,
    tabBarTint: Colors.grey,
  },
};
