import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

const SectionBlock = ({ block, onChange, onFocus, onBlur }) => {
  const { data } = block;
  const {
    data: { title },
  } = block;

  return (
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
  );
};

SectionBlock.propTypes = {
  block: PropTypes.object,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default SectionBlock;
