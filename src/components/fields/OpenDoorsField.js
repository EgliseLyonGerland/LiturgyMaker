import React from 'react';

import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';

import ArraySortableControl from '../controls/ArraySortableControl';
import TextFieldControl from '../controls/TextFieldControl';

const OpenDoorsField = ({ name, defaultValue, disabled = false }) => (
  <div>
    <TextFieldControl
      name={`${name}.title`}
      label="Titre"
      defaultValue={defaultValue.title}
      disabled={disabled}
    />
    <TextFieldControl
      name={`${name}.detail`}
      label="Informations"
      defaultValue={defaultValue.detail}
      disabled={disabled}
      multiline
    />

    <Box fontSize={16} fontWeight={900} mt={4} mb={2}>
      Sujets de prière
    </Box>

    <ArraySortableControl
      name={`${name}.prayerTopics`}
      maxItems={3}
      defaultItem={{ text: '' }}
      renderItem={(item, index) => (
        <TextFieldControl
          name={`${name}.prayerTopics.${index}.text`}
          label={`Sujet #${index + 1}`}
          defaultValue={item.text || ''}
          disabled={disabled}
        />
      )}
    />
  </div>
);

OpenDoorsField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default OpenDoorsField;
