import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { cn } from '../../lib/utils';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "p-2 rounded-lg transition-all duration-200",
                theme === 'dark'
                    ? "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                    : "bg-black/5 hover:bg-black/10 text-slate-600 hover:text-black"
            )}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
};
