import { TextField } from '@mui/material'
import { useController } from 'react-hook-form'

interface Props {
  name: string
  label: string
  helperText?: string
  multiline?: boolean
  disabled?: boolean
  transformIn?: (value: any) => string
  transformOut?: (value: string) => any
}

function TextFieldControl({
  name,
  label,
  helperText = '',
  multiline = false,
  disabled = false,
  transformIn,
  transformOut,
}: Props) {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name })

  const { ref, value, onChange, ...rest } = field
  const params = {
    ...rest,
    value: transformIn?.(value) || value,
    inputRef: ref,
  }

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
        onChange(transformOut?.(e.target.value) || e.target.value)
      }}
      variant="filled"
      {...params}
    />
  )
}

export default TextFieldControl
