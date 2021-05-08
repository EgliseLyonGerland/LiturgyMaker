import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { TextField, Box } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import find from 'lodash/find';
import get from 'lodash/get';
import { selectAllSongs } from '../../redux/slices/songs';
import ArraySortableControl from '../controls/ArraySortableControl';
import TextFieldControl from '../controls/TextFieldControl';

const SongsField = ({ name, disabled = false }) => {
  const songs = useSelector(selectAllSongs);
  const { control } = useFormContext();

  const renderItem = (item, index) => {
    return (
      <div>
        <Controller
          name={`${name}.items.${index}.id`}
          control={control}
          defaultValue={item.id || ''}
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
                renderOption={(option) => (
                  <div>
                    <div>
                      <Box component="span" fontWeight={500}>
                        {option.title}
                      </Box>
                      {option.aka && ` (${option.aka})`}
                    </div>
                    <Box
                      fontSize="0.8em"
                      fontStyle="italic"
                      style={{ opacity: 0.7 }}
                    >
                      {option.authors || 'Aucun auteur'}
                      {option.number && ` (${option.number})`}
                    </Box>
                  </div>
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
          defaultValue={item.infos || ''}
          disabled={disabled}
          multiline
        />

        <FormControlLabel
          control={
            <Controller
              name={`${name}.items.${index}.repeat`}
              control={control}
              defaultValue={item.repeat || false}
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
    <ArraySortableControl
      name={`${name}.items`}
      defaultItem={{ id: '', infos: '', repeat: false }}
      renderItem={renderItem}
      gutters={3}
      disabled={disabled}
    />
  );
};

SongsField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default SongsField;
