import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { Controller } from 'react-hook-form';

const SectionField = ({ name, register, control, defaultValue }) => {
  return (
    <Controller
      name={`${name}.title`}
      control={control}
      defaultValue={defaultValue.title || ''}
      render={({ value, ref: inputRef, onChange, onBlur }) => (
        <TextField
          label="Titre"
          variant="filled"
          margin="dense"
          fullWidth
          {...{ value, inputRef, onChange, onBlur }}
        />
      )}
    />
  );
};

SectionField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default SectionField;
