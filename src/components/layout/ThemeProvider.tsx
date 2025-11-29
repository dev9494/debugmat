import { useEffect } from 'react';
import { useThemeStore } from '../../stores/themeStore';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        const root = window.document.documentElement;
        root.setAttribute('data-theme', theme);
    }, [theme]);

    return <>{children}</>;
};
