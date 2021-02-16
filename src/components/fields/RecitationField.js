import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import find from 'lodash/find';
import get from 'lodash/get';
import { Controller } from 'react-hook-form';
import { selectAllRecitations } from '../../redux/slices/recitations';

const RecitationField = ({ name, control, defaultValue }) => {
  const recitations = useSelector(selectAllRecitations);

  return (
    <div>
      <Controller
        name={`${name}.id`}
        control={control}
        defaultValue={defaultValue.id || ''}
        render={({ value, ref: inputRef, onChange, onBlur }) => (
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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Titre"
                variant="filled"
                margin="dense"
                inputRef={inputRef}
              />
            )}
            autoComplete
          />
        )}
      />
      <Controller
        name={`${name}.infos`}
        control={control}
        defaultValue={defaultValue.infos || ''}
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
    </div>
  );
};

RecitationField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default RecitationField;
