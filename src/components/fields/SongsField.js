import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Controller } from 'react-hook-form';
import find from 'lodash/find';
import get from 'lodash/get';
import { selectAllSongs } from '../../redux/slices/songs';
import FieldArraySortable from '../FieldArraySortable';

const SongsField = ({ name, control }) => {
  const songs = useSelector(selectAllSongs);

  const renderItem = (item, index) => {
    return (
      <div>
        <Controller
          name={`${name}[${index}].id`}
          control={control}
          defaultValue={item.id || ''}
          render={({ value, ref: inputRef, onChange, onBlur }) => {
            const song = find(songs, ['id', value]);

            return (
              <Autocomplete
                value={song || null}
                options={songs}
                onChange={(event, option) => {
                  onChange(get(option, 'id', null));
                }}
                onBlur={onBlur}
                getOptionLabel={(option) => {
                  if (option.number) {
                    return `${option.title} (${option.number})`;
                  }

                  const total = songs.filter(
                    ({ title }) => title === option.title,
                  );
                  if (total.length > 1) {
                    return `${option.title} (${option.authors})`;
                  }

                  return option.title;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Titre"
                    variant="filled"
                    margin="dense"
                    helperText={
                      song &&
                      song.lyrics.length === 0 &&
                      `Paroles manquantes pour ce chant (${song.id})`
                    }
                  />
                )}
                autoComplete
              />
            );
          }}
        />
        <Controller
          name={`${name}[${index}].infos`}
          control={control}
          defaultValue={item.infos || ''}
          render={({ value, ref: inputRef, onChange, onBlur }) => (
            <TextField
              label="Informations"
              variant="filled"
              margin="dense"
              gutters={3}
              fullWidth
              multiline
              {...{ value, inputRef, onChange, onBlur }}
            />
          )}
        />

        <FormControlLabel
          control={
            <Controller
              name={`${name}[${index}].repeat`}
              control={control}
              defaultValue={item.repeat || false}
              render={({ value, ref: inputRef, onChange, onBlur }) => (
                <Checkbox
                  onChange={(e) => onChange(e.target.checked)}
                  {...{ value, inputRef, onBlur }}
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
    <FieldArraySortable
      name={name}
      control={control}
      defaultItem={{ id: '', infos: '', repeat: false }}
      renderItem={renderItem}
      gutters={3}
    />
  );
};

SongsField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default SongsField;
