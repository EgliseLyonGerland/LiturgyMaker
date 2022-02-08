import { useLocalStorage, useMediaQuery } from 'usehooks-ts';

type Mode = 'light' | 'dark' | 'system';

type UseDarkModeOutput = [boolean, Mode, (mode: Mode) => void];

function useDarkMode(defaultMode: Mode = 'system'): UseDarkModeOutput {
  const isDarkSystem = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useLocalStorage<Mode>('mode', defaultMode);
  const dark = mode === 'system' ? isDarkSystem : mode === 'dark';

  return [dark, mode, setMode];
}

export default useDarkMode;
