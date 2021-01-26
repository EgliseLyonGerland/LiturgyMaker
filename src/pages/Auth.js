import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    background: theme.palette.background.dark,
    color: theme.palette.text.primary,
    ...theme.typography.h6,
  },
  content: {
    padding: theme.spacing(2, 3),
  },
}));

const Auth = ({ onSubmit = () => {} }) => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    if (email && password) {
      onSubmit(email, password);
    }

    event.preventDefault();
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit}>
        <Box width={360} boxShadow={20}>
          <Card className={classes.box}>
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
    </div>
  );
};

Auth.propTypes = {
  onSubmit: PropTypes.func,
};

export default Auth;
