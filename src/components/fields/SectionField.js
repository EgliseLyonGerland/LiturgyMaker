import React from 'react';

import PropTypes from 'prop-types';

import TextFieldControl from '../controls/TextFieldControl';

const SectionField = ({ name, defaultValue, disabled = false }) => {
  return (
    <TextFieldControl
      name={`${name}.title`}
      label="Titre"
      defaultValue={defaultValue.title}
      disabled={disabled}
    />
  );
};

SectionField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default SectionField;
