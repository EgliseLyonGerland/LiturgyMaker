import { CssBaseline, ThemeProvider } from '@mui/material'
import * as Sentry from '@sentry/react'
import { SnackbarProvider } from 'notistack'
import { useEffect, useMemo } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from './firebase'
import useDarkMode from './libs/hooks/useDarkMode'
import AuthPage from './pages/Auth'
import MainPage from './pages/Main'
import { darkTheme, lightTheme } from './theme'

function App() {
  const [user, loading] = useAuthState(auth)
  const [dark] = useDarkMode()
  const mode = dark ? 'dark' : 'light'
  const theme = useMemo(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode],
  )

  useEffect(() => {
    if (user) {
      Sentry.setUser({
        email: user.email || 'unknown',
        username: user.displayName || 'unknown',
      })
    }
  }, [user])

  if (loading) {
    return null
  }

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <CssBaseline />
        {user ? <MainPage /> : <AuthPage firebaseAuth={auth} />}
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
