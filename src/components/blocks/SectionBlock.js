import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  (theme) => ({
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

const SectionBlock = ({ block }) => {
  const classes = useStyles();
  const {
    data: { title },
  } = block;

  return <div className={classes.root}>{title}</div>;
};

SectionBlock.propTypes = {
  block: PropTypes.object,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default SectionBlock;
