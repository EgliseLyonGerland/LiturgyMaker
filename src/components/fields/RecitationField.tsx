import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import find from 'lodash/find';
import get from 'lodash/get';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { selectAllRecitations } from '../../redux/slices/recitations';
import type { FormFieldProps } from '../../types';
import TextFieldControl from '../controls/TextFieldControl';

function RecitationField({ name, disabled = false }: FormFieldProps) {
  const recitations = useSelector(selectAllRecitations);

  return (
    <div>
      <Controller
        name={`${name}.id`}
        render={({
          field: { value, ref: inputRef, onChange, onBlur },
          fieldState: { error },
        }) => (
          <Autocomplete
            value={find(recitations, ['id', value]) || null}
            options={recitations}
            getOptionLabel={(option) => option.title}
            onChange={(event, option) => {
              onChange(get(option, 'id', null));
            }}
            onBlur={onBlur}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Titre"
                variant="filled"
                margin="dense"
                inputRef={inputRef}
                error={!!error}
                helperText={error?.message}
              />
            )}
            autoComplete
          />
        )}
      />
      <TextFieldControl
        name={`${name}.infos`}
        label="Informations"
        disabled={disabled}
        multiline
      />
    </div>
  );
}

export default RecitationField;
