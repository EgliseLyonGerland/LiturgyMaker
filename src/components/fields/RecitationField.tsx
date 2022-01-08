import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import find from 'lodash/find';
import get from 'lodash/get';
import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { selectAllRecitations } from '../../redux/slices/recitations';
import type { FormFieldProps, RecitationBlockData } from '../../types';
import TextFieldControl from '../controls/TextFieldControl';

function RecitationField({
  name,
  defaultValue,
  disabled = false,
}: FormFieldProps<RecitationBlockData>) {
  const recitations = useSelector(selectAllRecitations);
  const { control } = useFormContext();

  return (
    <div>
      <Controller
        name={`${name}.id`}
        control={control}
        defaultValue={defaultValue?.id || ''}
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
        defaultValue={defaultValue?.infos || ''}
        disabled={disabled}
        multiline
      />
    </div>
  );
}

export default RecitationField;
