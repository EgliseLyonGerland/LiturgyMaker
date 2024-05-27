import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  TextField,
} from '@mui/material'
import { Controller } from 'react-hook-form'

import type { FormFieldProps } from '../../types'
import ArraySortableControl from '../controls/ArraySortableControl'

function LyricsField({ name, disabled = false }: FormFieldProps) {
  return (
    <ArraySortableControl
      defaultItem={{ text: '', type: 'verse' }}
      disabled={disabled}
      gutters={3}
      name={name}
      renderItem={(item, index) => (
        <>
          <Controller
            name={`${name}.${index}.text`}
            render={({ field, fieldState: { error } }) => (
              <>
                <TextField
                  disabled={disabled}
                  fullWidth
                  multiline
                  placeholder="Lorem ipsum dolor sit amet..."
                  rows={6}
                  // label={`Paroles #${index + 1}`}
                  variant="filled"
                  {...field}
                />

                {error && (
                  <FormHelperText error>{error.message}</FormHelperText>
                )}
              </>
            )}
          />

          <Controller
            name={`${name}.${index}.type`}
            render={({ field: { value, onChange, onBlur } }) => (
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox checked={value === 'chorus'} />}
                  disabled={disabled}
                  label="Refrain"
                  onBlur={onBlur}
                  onChange={(event, checked) =>
                    onChange(checked ? 'chorus' : 'verse')}
                />
              </FormGroup>
            )}
          />
        </>
      )}
    />
  )
}

export default LyricsField
