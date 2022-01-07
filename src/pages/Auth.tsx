import type { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';

import { Snackbar } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Alert } from '@material-ui/lab';
import type { Auth as FirebaseAuth } from 'firebase/auth';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

interface Props {
  firebaseAuth: FirebaseAuth;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    background: theme.palette.tertiary.dark,
    color: theme.palette.text.primary,
    ...theme.typography.h6,
  },
  content: {
    padding: theme.spacing(2, 3),
  },
}));

function Auth({ firebaseAuth }: Props) {
  const classes = useStyles();
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
    <div className={classes.root}>
      <form onSubmit={handleSubmit}>
        <Box width={360} boxShadow={20}>
          <Card>
            <CardContent className={classes.header}>Identification</CardContent>
            <CardContent className={classes.content}>
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
            <CardContent className={classes.content}>
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
    </div>
  );
}

export default Auth;
