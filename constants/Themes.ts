export interface Theme {
    text: string;
    background: string;
    tabIconDefault: string;
    tabIconSelected: string;
    tabBarBorder: string;
    primary: string;
    secondary: string;
}

export type ThemeType = 'light' | 'dark';

export const Colors = {
    primary: '#0F53FF',
    secondary: '#FF740F',
    green: '#0FA002',
    red: '#A02C02',
    white: '#FFFFFF',
    black: '#111318',
    light: '#D6D6D6',
    grey: '#88898B',
    dark: '#474747',
};

export const Themes: { light: Theme; dark: Theme } = {
    light: {
        text: Colors.black,
        background: Colors.white,
        tabIconDefault: Colors.black,
        tabIconSelected: Colors.secondary,
        tabBarBorder: Colors.light,
        primary: Colors.primary,
        secondary: Colors.secondary,
    },
    dark: {
        text: Colors.white,
        background: Colors.black,
        tabIconDefault: Colors.white,
        tabIconSelected: Colors.secondary,
        tabBarBorder: Colors.dark,
        primary: Colors.primary,
        secondary: Colors.secondary,
    },
};
