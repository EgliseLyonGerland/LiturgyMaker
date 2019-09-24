import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(
  theme => ({
    root: {
      margin: theme.spacing(6, 0),
    },
  }),
  { name: 'Divider' },
);

export default () => {
  const classes = useStyles();

  return <Divider className={classes.root} />;
};
