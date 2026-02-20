import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-border bg-background-secondary hover:bg-background-tertiary transition-all duration-200 cursor-pointer"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-text-secondary hover:text-text-primary transition-colors" />
      ) : (
        <Moon className="h-5 w-5 text-text-secondary hover:text-text-primary transition-colors" />
      )}
    </button>
  );
}
