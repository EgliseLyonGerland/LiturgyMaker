import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { Controller } from 'react-hook-form';
import FieldArraySortable from '../FieldArraySortable';

const AnnouncementsField = ({ name, control }) => {
  return (
    <FieldArraySortable
      name={name}
      control={control}
      gutters={3}
      defaultItem={{ title: '', detail: '' }}
      renderItem={(item, index) => (
        <div>
          <Controller
            name={`${name}[${index}].title`}
            control={control}
            defaultValue={item.title || ''}
            render={({ value, ref: inputRef, onChange, onBlur }) => (
              <TextField
                label="Titre"
                variant="filled"
                margin="dense"
                fullWidth
                {...{ value, inputRef, onChange, onBlur }}
              />
            )}
          />
          <Controller
            name={`${name}[${index}].detail`}
            control={control}
            defaultValue={item.detail || ''}
            render={({ value, ref: inputRef, onChange, onBlur }) => (
              <TextField
                label="Détails"
                variant="filled"
                margin="dense"
                fullWidth
                multiline
                {...{ value, inputRef, onChange, onBlur }}
              />
            )}
          />
        </div>
      )}
    />
  );
};

AnnouncementsField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default AnnouncementsField;
