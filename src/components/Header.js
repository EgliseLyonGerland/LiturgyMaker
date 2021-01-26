import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

const useStyles = makeStyles(
  (theme) => ({
    root: {
      background: theme.palette.background.dark,
      position: 'fixed',
      width: '100%',
      height: 60,
      top: 0,
      left: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 5),
    },
  }),
  { name: 'Header' },
);

const Header = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box fontWeight="bold" fontSize="1.1em">
        Gestion des présidences
      </Box>
    </div>
  );
};

Header.propTypes = {};

export default Header;
