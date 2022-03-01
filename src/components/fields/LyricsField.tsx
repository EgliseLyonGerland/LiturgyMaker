import React from 'react';

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  TextField,
} from '@mui/material';
import { Controller } from 'react-hook-form';

import type { FormFieldProps } from '../../types';
import ArraySortableControl from '../controls/ArraySortableControl';

function LyricsField({ name, disabled = false }: FormFieldProps) {
  return (
    <ArraySortableControl
      name={name}
      gutters={3}
      defaultItem={{ text: '', type: 'verse' }}
      disabled={disabled}
      renderItem={(item, index) => (
        <>
          <Controller
            name={`${name}.${index}.text`}
            render={({ field, fieldState: { error } }) => (
              <>
                <TextField
                  rows={6}
                  // label={`Paroles #${index + 1}`}
                  variant="filled"
                  placeholder="Lorem ipsum dolor sit amet..."
                  disabled={disabled}
                  fullWidth
                  multiline
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
                  label="Refrain"
                  disabled={disabled}
                  onBlur={onBlur}
                  onChange={(event, checked) =>
                    onChange(checked ? 'chorus' : 'verse')
                  }
                />
              </FormGroup>
            )}
          />
        </>
      )}
    />
  );
}

export default LyricsField;
