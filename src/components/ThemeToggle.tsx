import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        {theme === 'dark' ? (
          <Sun className="w-full h-full text-gray-600 dark:text-gray-400" />
        ) : (
          <Moon className="w-full h-full text-gray-600 dark:text-gray-400" />
        )}
      </div>
      <span className="sr-only">
        {theme === 'light' ? 'Enable dark mode' : 'Enable light mode'}
      </span>
    </button>
  );
}