import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiDivider from '@material-ui/core/Divider';

const useStyles = makeStyles(
  theme => ({
    root: {
      margin: theme.spacing(6, 0),
    },
  }),
  { name: 'Divider' },
);

const Divider = () => {
  const classes = useStyles();

  return <MuiDivider className={classes.root} />;
};

export default Divider;
