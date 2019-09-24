import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  theme => ({
    root: {
      padding: theme.spacing(2, 0),
      fontSize: 22,
      fontWeight: 700,
      color: '#777',
      textAlign: 'center',
    },
  }),
  {
    name: 'SectionBlock',
  },
);

export default ({ block }) => {
  const classes = useStyles();
  let {
    data: { title },
  } = block;

  return <div className={classes.root}>{title}</div>;
};
