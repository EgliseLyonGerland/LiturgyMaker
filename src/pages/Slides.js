import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import liturgy from '../config/fakeLiturgy.json';

const useStyles = makeStyles((theme) => ({
  root: {
    background: '#4843bb',
    width: '100vw',
    height: '100vh',
  },
}));

export default function Slides() {
  const classes = useStyles();

  return <div className={classes.root}>test</div>;
}
