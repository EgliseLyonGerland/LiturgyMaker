import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import ArraySortableControl from '../controls/ArraySortableControl';
import BibleRefField from './BibleRefField';
import TextFieldControl from '../controls/TextFieldControl';

const SermonField = ({ name, defaultValue, disabled = false }) => (
  <div>
    <TextFieldControl
      name={`${name}.title`}
      label="Titre"
      defaultValue={defaultValue.title}
      disabled={disabled}
    />
    <TextFieldControl
      name={`${name}.author`}
      label="Auteur"
      defaultValue={defaultValue.author}
      disabled={disabled}
    />

    <Box fontSize={16} fontWeight={900} mt={4} mb={2}>
      Passage(s) biblique(s)
    </Box>

    <ArraySortableControl
      name={`${name}.bibleRefs`}
      defaultItem={{ ref: '' }}
      disabled={disabled}
      renderItem={(item, index) => (
        <BibleRefField
          name={`${name}.bibleRefs.${index}`}
          defaultValue={item}
          withExcerpt={false}
          disabled={disabled}
        />
      )}
    />

    <Box fontSize={16} fontWeight={900} mt={4} mb={2}>
      Plan
    </Box>

    <ArraySortableControl
      name={`${name}.plan`}
      defaultItem={{ text: '' }}
      disabled={disabled}
      renderItem={(item, index) => (
        <TextFieldControl
          name={`${name}.plan.${index}.text`}
          defaultValue={item.text || ''}
          label={`Point #${index + 1}`}
          disabled={disabled}
        />
      )}
    />
  </div>
);

SermonField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default SermonField;
