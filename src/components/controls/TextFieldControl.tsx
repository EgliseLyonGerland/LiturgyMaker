import { TextField } from '@mui/material';
import { useController } from 'react-hook-form';

interface Props {
  name: string;
  label: string;
  helperText?: string;
  multiline?: boolean;
  disabled?: boolean;
  transformIn?(value: unknown): string;
  transformOut?(value: string): unknown;
}

function TextFieldControl({
  name,
  label,
  helperText = '',
  multiline = false,
  disabled = false,
  transformIn = (value: string) => value,
  transformOut = (value) => value,
}: Props) {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name });

  const { ref, value, onChange, ...rest } = field;
  const params = {
    ...rest,
    value: transformIn(value) || '',
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
        onChange(transformOut(e.target.value));
      }}
      {...params}
    />
  );
}

export default TextFieldControl;
