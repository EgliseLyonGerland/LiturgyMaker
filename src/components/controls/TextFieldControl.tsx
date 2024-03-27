import { TextField } from "@mui/material";
import { useController } from "react-hook-form";

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
  helperText = "",
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
    value: transformIn(value) || "",
    inputRef: ref,
  };

  return (
    <TextField
      autoComplete="off"
      disabled={disabled}
      error={invalid}
      fullWidth
      helperText={error?.message || helperText}
      label={label}
      margin="dense"
      multiline={multiline}
      onChange={(e) => {
        onChange(transformOut(e.target.value));
      }}
      variant="filled"
      {...params}
    />
  );
}

export default TextFieldControl;
