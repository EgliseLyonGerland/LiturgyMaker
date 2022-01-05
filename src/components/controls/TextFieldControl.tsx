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
  transform?(value: unknown): unknown;
}> = ({
  name,
  label,
  defaultValue = '',
  helperText = '',
  multiline = false,
  disabled = false,
  transform = (value) => value,
}) => {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name, control, defaultValue: transform(defaultValue) });

  const { ref, value, onChange, ...rest } = field;
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
      onChange={(e) => {
        onChange(transform(e.target.value));
      }}
      {...params}
    />
  );
};

export default TextFieldControl;
