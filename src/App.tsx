import React, { useMemo } from 'react';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from './firebase';
import useDarkMode from './libs/hooks/useDarkMode';
import AuthPage from './pages/Auth';
import MainPage from './pages/Main';
import getTheme from './theme';

function App() {
  const [user, loading] = useAuthState(auth);
  const [dark] = useDarkMode();
  const mode = dark ? 'dark' : 'light';
  const theme = useMemo(() => createTheme(getTheme(mode)), [mode]);

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
