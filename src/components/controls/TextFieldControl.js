import React from 'react';
import { TextField } from '@material-ui/core';
import { useFormContext, useController } from 'react-hook-form';

function TextFieldControl({
  name,
  label,
  defaultValue = '',
  helperText = '',
  multiline = false,
  disabled = false,
}) {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name, control, defaultValue });

  return (
    <TextField
      label={label}
      variant="filled"
      margin="dense"
      multiline={multiline}
      disabled={disabled}
      error={invalid}
      helperText={error?.message || helperText}
      autoComplete="off"
      fullWidth
      {...{ ...field, value: field.value || '' }}
    />
  );
}

export default TextFieldControl;
