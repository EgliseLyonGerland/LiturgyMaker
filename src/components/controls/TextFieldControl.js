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

  const { ref, value, ...params } = field;
  params.value = value || '';
  params.inputRef = ref;

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
      {...params}
    />
  );
}

export default TextFieldControl;
