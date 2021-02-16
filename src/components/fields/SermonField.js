import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { Box } from '@material-ui/core';
import { Controller } from 'react-hook-form';
import FieldArraySortable from '../FieldArraySortable';
import BibleRefField from './BibleRefField';

const SermonField = ({ name, control, defaultValue }) => (
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
      name={`${name}.author`}
      control={control}
      defaultValue={defaultValue.author || ''}
      render={({ value, ref: inputRef, onChange, onBlur }) => (
        <TextField
          label="Auteur"
          variant="filled"
          margin="dense"
          fullWidth
          {...{ value, inputRef, onChange, onBlur }}
        />
      )}
    />

    <Box fontSize={16} fontWeight={900} mt={4} mb={2}>
      Passage(s) biblique(s)
    </Box>

    <FieldArraySortable
      name={`${name}.bibleRefs`}
      control={control}
      defaultItem={{ ref: '' }}
      renderItem={(item, index) => (
        <BibleRefField
          name={`${name}.bibleRefs[${index}]`}
          control={control}
          defaultValue={item}
          withExcerpt={false}
        />
      )}
    />

    <Box fontSize={16} fontWeight={900} mt={4} mb={2}>
      Plan
    </Box>

    <FieldArraySortable
      name={`${name}.plan`}
      control={control}
      defaultItem={{ text: '' }}
      renderItem={(item, index) => (
        <Controller
          name={`${name}.plan[${index}].text`}
          control={control}
          defaultValue={item.text || ''}
          render={({ value, ref: inputRef, onChange, onBlur }) => (
            <TextField
              label={`Point #${index + 1}`}
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

SermonField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default SermonField;
