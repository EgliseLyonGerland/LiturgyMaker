import React, { useEffect, useMemo, useState } from 'react';

import type { PaletteMode } from '@mui/material';
import {
  useMediaQuery,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from './firebase';
import AuthPage from './pages/Auth';
import MainPage from './pages/Main';
import getTheme from './theme';

function App() {
  const [user, loading] = useAuthState(auth);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<PaletteMode>(
    prefersDarkMode ? 'dark' : 'light',
  );
  const theme = useMemo(() => createTheme(getTheme(mode)), [mode]);

  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode, setMode]);

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? <MainPage /> : <AuthPage firebaseAuth={auth} />}
    </ThemeProvider>
  );
}

export default App;
