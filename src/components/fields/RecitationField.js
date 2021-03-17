import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import find from 'lodash/find';
import get from 'lodash/get';
import { Controller, useFormContext } from 'react-hook-form';
import { selectAllRecitations } from '../../redux/slices/recitations';
import TextFieldControl from '../controls/TextFieldControl';

const RecitationField = ({ name, defaultValue, disabled = false }) => {
  const recitations = useSelector(selectAllRecitations);
  const { control } = useFormContext();

  return (
    <div>
      <Controller
        name={`${name}.id`}
        control={control}
        defaultValue={defaultValue.id || ''}
        render={({
          field: { value, ref: inputRef, onChange, onBlur },
          fieldState: { error },
        }) => (
          <Autocomplete
            value={find(recitations, ['id', value]) || null}
            options={recitations}
            getOptionLabel={(option) =>
              `${option.title}${option.number ? ` (${option.number})` : ''}`
            }
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
        defaultValue={defaultValue.infos || ''}
        disabled={disabled}
        multiline
      />
    </div>
  );
};

RecitationField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default RecitationField;
