import type { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';

import { Snackbar, Alert, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import type { Auth as FirebaseAuth } from 'firebase/auth';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

interface Props {
  firebaseAuth: FirebaseAuth;
}

function Auth({ firebaseAuth }: Props) {
  const theme = useTheme();
  const [email, setEmail] = useState('oltodo@msn.com');
  const [password, setPassword] = useState('DQ68sx89!');
  const [errorShown, setErrorShown] = useState(false);
  const [signInWithEmailAndPassword, , , error] =
    useSignInWithEmailAndPassword(firebaseAuth);

  const handleSubmit = (event: FormEvent) => {
    if (email && password) {
      signInWithEmailAndPassword(email, password);
    }

    event.preventDefault();
  };

  useEffect(() => {
    if (error) {
      setErrorShown(true);
    }
  }, [error]);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box width={360} boxShadow={20}>
          <Card>
            <CardContent
              sx={{
                background: theme.palette.tertiary.dark,
                color: theme.palette.text.primary,
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
              <Button
                color="primary"
                variant="outlined"
                type="submit"
                onClick={handleSubmit}
              >
                Valider
              </Button>
            </CardContent>
          </Card>
        </Box>
      </form>

      <Snackbar
        open={errorShown}
        autoHideDuration={6000}
        onClose={() => {
          setErrorShown(false);
        }}
      >
        <Alert severity="error">
          Connexion impossible. Veuillez vérifier vos identifiants.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Auth;
