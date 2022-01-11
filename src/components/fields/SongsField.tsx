import React from 'react';

import { TextField, Box } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import find from 'lodash/find';
import get from 'lodash/get';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { selectAllSongs } from '../../redux/slices/songs';
import type { FormFieldProps, SongsItem } from '../../types';
import ArraySortableControl from '../controls/ArraySortableControl';
import TextFieldControl from '../controls/TextFieldControl';

function SongsField({ name, disabled = false }: FormFieldProps) {
  const songs = useSelector(selectAllSongs);

  const renderItem = (item: SongsItem, index: number) => {
    return (
      <div>
        <Controller
          name={`${name}.items.${index}.id`}
          render={({
            field: { value, ref, onChange, onBlur },
            fieldState: { error },
          }) => {
            const song = find(songs, ['id', value]);

            return (
              <Autocomplete
                value={song || null}
                options={songs}
                disabled={disabled}
                onChange={(event, option) => {
                  onChange(get(option, 'id', null));
                }}
                onBlur={onBlur}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    key={option.id}
                    sx={{
                      '&.MuiAutocomplete-option': {
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      },
                    }}
                    {...props}
                  >
                    <Box>
                      <Box component="span" fontWeight={500}>
                        {option.title}
                      </Box>
                      {option.aka && ` (${option.aka})`}
                    </Box>
                    <Box
                      fontSize="0.8em"
                      fontStyle="italic"
                      style={{ opacity: 0.7 }}
                    >
                      {option.authors || 'Aucun auteur'}
                      {option.number && ` (${option.number})`}
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Titre"
                    variant="filled"
                    margin="dense"
                    inputRef={ref}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
                autoComplete
              />
            );
          }}
        />
        <TextFieldControl
          name={`${name}.items.${index}.infos`}
          label="Informations"
          disabled={disabled}
          multiline
        />

        <FormControlLabel
          control={
            <Controller
              name={`${name}.items.${index}.repeat`}
              render={({
                field: { value, ref: inputRef, onChange, onBlur },
              }) => (
                <Checkbox
                  disabled={disabled}
                  onChange={(e) => onChange(e.target.checked)}
                  checked={value}
                  {...{ inputRef, onBlur }}
                />
              )}
            />
          }
          label="Chanté deux fois ?"
        />
      </div>
    );
  };

  return (
    <ArraySortableControl<SongsItem>
      name={`${name}.items`}
      defaultItem={{ id: '', infos: '', repeat: false }}
      renderItem={renderItem}
      gutters={3}
      disabled={disabled}
    />
  );
}

export default SongsField;
