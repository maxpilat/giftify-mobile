
export const Colors = {
    blue: '#0F53FF',
    orange: '#FF740F',
    green: '#0FA002',
    red: '#A02C02',
    white: '#FFFFFF',
    black: '#111318',
    light: '#D6D6D6',
    grey: '#88898B',
    dark: '#474747',
} as const;

export type ThemeType = 'light' | 'dark';

export interface Theme {
    text: string;
    subtext: string,
    background: string;
    tabIconDefault: string;
    tabIconSelected: string;
    tabBarBorder: string;
    primary: string;
    secondary: string;
}

export const Themes: { light: Theme; dark: Theme } = {
    light: {
        text: Colors.black,
        subtext: Colors.grey,
        background: Colors.white,
        tabIconDefault: Colors.black,
        tabIconSelected: Colors.orange,
        tabBarBorder: Colors.light,
        primary: Colors.blue,
        secondary: Colors.orange,
    },
    dark: {
        text: Colors.white,
        subtext: Colors.white,
        background: Colors.black,
        tabIconDefault: Colors.white,
        tabIconSelected: Colors.orange,
        tabBarBorder: Colors.dark,
        primary: Colors.blue,
        secondary: Colors.orange,
    },
};
