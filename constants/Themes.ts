export interface Theme {
    text: string;
    background: string;
    tint: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
    tabBarBorder: string;
    primary: string;
    secondary: string;
}

export type ThemeType = 'light' | 'dark';

export const DefaultCustomColors = {
    primary: '#0F53FF',
    secondary: '#FF740F',
};

export const Themes: { light: Theme; dark: Theme } = {
    light: {
        text: '#11181C',
        background: '#fff',
        tint: '#0a7ea4',
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: DefaultCustomColors.primary,
        tabBarBorder: '#D6D6D6',
        primary: DefaultCustomColors.primary,
        secondary: DefaultCustomColors.secondary,
    },
    dark: {
        text: '#ECEDEE',
        background: '#151718',
        tint: '#fff',
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: DefaultCustomColors.primary,
        tabBarBorder: '#474747',
        primary: DefaultCustomColors.primary,
        secondary: DefaultCustomColors.secondary,
    },
};
