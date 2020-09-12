import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

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

const SectionBlock = ({ block, onChange, onFocus, onBlur }) => {
  const classes = useStyles();
  const { data } = block;
  const {
    data: { title },
  } = block;

  return (
    <div className={classes.root}>
      <TextField
        label="Titre"
        defaultValue={title}
        onChange={({ target }) => {
          data.title = target.value;
          onChange(data);
        }}
        onFocus={() => onFocus(['title'])}
        onBlur={onBlur}
        variant="filled"
        margin="dense"
        fullWidth
      />
    </div>
  );
};

SectionBlock.propTypes = {
  block: PropTypes.object,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default SectionBlock;
