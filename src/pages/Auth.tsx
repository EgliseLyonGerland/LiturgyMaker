import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';

import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Snackbar, Alert, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import type { Auth as FirebaseAuth } from 'firebase/auth';
import {
  useSendPasswordResetEmail,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';

import ModeSwitcher from '../components/ModeSwitcher';

interface Props {
  firebaseAuth: FirebaseAuth;
}

function Auth({ firebaseAuth }: Props) {
  const theme = useTheme();
  const [email, setEmail] = useState('oltodo@msn.com');
  const [password, setPassword] = useState('');
  const [errorShown, setErrorShown] = useState(false);
  const [lostPasswordShown, setLostPasswordShown] = useState(false);
  const [signInWithEmailAndPassword, , , authError] =
    useSignInWithEmailAndPassword(firebaseAuth);
  const [sendPasswordResetEmail, , resetEmailError] =
    useSendPasswordResetEmail(firebaseAuth);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (email && password) {
      signInWithEmailAndPassword(email, password);
    }
  };

  const handleLostPassword = async (event: FormEvent) => {
    event.preventDefault();

    sendPasswordResetEmail(email);
    setLostPasswordShown(false);
  };

  useEffect(() => {
    if (authError || resetEmailError) {
      setErrorShown(true);
    }
  }, [authError, resetEmailError]);

  const error = authError || resetEmailError;

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: theme.transitions.create(['transform', 'opacity']),
          ...(lostPasswordShown
            ? {
                transform: 'translateX(-100px)',
                opacity: 0,
                pointerEvents: 'none',
              }
            : { transform: 'none' }),
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box width={360}>
            <Card
              sx={{
                border: 'solid 1px',
                borderRadius: '4px',
                borderColor: 'paper.border',
                boxShadow: '4px 4px 10px rgba(0,0,0,0.05)',
              }}
            >
              <CardContent
                sx={{
                  bgcolor: 'paper.header',
                  borderBottom: 'solid 1px',
                  borderColor: 'paper.border',
                  ...theme.typography.h6,
                }}
              >
                Identification
              </CardContent>
              <CardContent sx={{ padding: theme.spacing(2, 3) }}>
                <TextField
                  label="Email"
                  type="email"
                  margin="normal"
                  variant="filled"
                  autoComplete="off"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  autoFocus
                  fullWidth
                />
                <TextField
                  label="Mot de passe"
                  type="password"
                  margin="normal"
                  variant="filled"
                  autoComplete="off"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  fullWidth
                />
              </CardContent>
              <CardContent sx={{ padding: theme.spacing(2, 3) }}>
                <Button color="primary" variant="outlined" type="submit">
                  Valider
                </Button>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'right' }}>
            <Button
              variant="text"
              color="inherit"
              onClick={() => setLostPasswordShown(true)}
            >
              Mot de passe perdu <ChevronRight />
            </Button>
          </Box>
        </form>
      </Box>
      <Box
        sx={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: theme.transitions.create(['transform', 'opacity']),
          ...(lostPasswordShown
            ? { transform: 'none' }
            : {
                transform: 'translateX(100px)',
                opacity: 0,
                pointerEvents: 'none',
              }),
        }}
      >
        <form onSubmit={handleLostPassword}>
          <Box width={360}>
            <Card
              sx={{
                border: 'solid 1px',
                borderRadius: '4px',
                borderColor: 'paper.border',
                boxShadow: '4px 4px 10px rgba(0,0,0,0.05)',
              }}
            >
              <CardContent
                sx={{
                  bgcolor: 'paper.header',
                  borderBottom: 'solid 1px',
                  borderColor: 'paper.border',
                  ...theme.typography.h6,
                }}
              >
                Mot de passe perdu
              </CardContent>
              <CardContent sx={{ padding: theme.spacing(2, 3) }}>
                <TextField
                  label="Email"
                  type="email"
                  margin="normal"
                  variant="filled"
                  autoComplete="off"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  autoFocus
                  fullWidth
                />
              </CardContent>
              <CardContent sx={{ padding: theme.spacing(2, 3) }}>
                <Button color="primary" variant="outlined" type="submit">
                  Valider
                </Button>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="text"
              color="inherit"
              onClick={() => setLostPasswordShown(false)}
            >
              <ChevronLeft /> Retour
            </Button>
          </Box>
        </form>
      </Box>

      <Box sx={{ position: 'fixed', top: 32, right: 32 }}>
        <ModeSwitcher />
      </Box>
      <Snackbar
        open={errorShown}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setErrorShown(false)}>
          {error?.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Auth;
