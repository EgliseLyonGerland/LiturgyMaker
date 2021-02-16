import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { Box } from '@material-ui/core';
import { Controller } from 'react-hook-form';
import FieldArraySortable from '../FieldArraySortable';

const OpenDoorsField = ({ name, defaultValue, control }) => (
  <div>
    <Controller
      name={`${name}.title`}
      control={control}
      defaultValue={defaultValue.title || ''}
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
      name={`${name}.detail`}
      control={control}
      defaultValue={defaultValue.detail || ''}
      render={({ value, ref: inputRef, onChange, onBlur }) => (
        <TextField
          label="Informations"
          variant="filled"
          margin="dense"
          fullWidth
          multiline
          {...{ value, inputRef, onChange, onBlur }}
        />
      )}
    />

    <Box fontSize={16} fontWeight={900} mt={4} mb={2}>
      Sujets de prière
    </Box>

    <FieldArraySortable
      name={`${name}.prayerTopics`}
      control={control}
      maxItems={3}
      defaultItem={{ text: '' }}
      renderItem={(item, index) => (
        <Controller
          name={`${name}.prayerTopics[${index}].text`}
          control={control}
          defaultValue={item.text || ''}
          render={({ value, ref: inputRef, onChange, onBlur }) => (
            <TextField
              label={`Sujet #${index + 1}`}
              variant="filled"
              margin="dense"
              fullWidth
              {...{ value, inputRef, onChange, onBlur }}
            />
          )}
        />
      )}
    />
  </div>
);

OpenDoorsField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default OpenDoorsField;
