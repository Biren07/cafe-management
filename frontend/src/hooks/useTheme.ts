import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { setThemeMode, ThemeMode } from '@/store/slices/themeSlice';

export function useTheme() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);

  const setTheme = (newMode: ThemeMode) => {
    dispatch(setThemeMode(newMode));
  };

  const toggleTheme = () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    dispatch(setThemeMode(nextMode));
  };

  return {
    mode,
    setTheme,
    toggleTheme,
    isDark: mode === 'dark',
  };
}
