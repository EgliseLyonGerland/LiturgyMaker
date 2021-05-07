import React from 'react';
import { TextField } from '@material-ui/core';
import { useFormContext, useController } from 'react-hook-form';

const TextFieldControl: React.FC<{
  name: string;
  label: string;
  defaultValue: unknown;
  helperText: string;
  multiline: boolean;
  disabled: boolean;
}> = ({
  name,
  label,
  defaultValue = '',
  helperText = '',
  multiline = false,
  disabled = false,
}) => {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name, control, defaultValue });

  const { ref, value, ...rest } = field;
  const params = {
    ...rest,
    value: value || '',
    inputRef: ref,
  };

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
};

export default TextFieldControl;
