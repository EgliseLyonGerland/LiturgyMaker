import React from 'react';

import PropTypes from 'prop-types';

import ArraySortableControl from '../controls/ArraySortableControl';
import BibleRefField from './BibleRefField';

const ReadingField = ({ name, disabled = false }) => (
  <ArraySortableControl
    name={`${name}.bibleRefs`}
    gutters={3}
    defaultItem={{ ref: '', excerpt: '' }}
    disabled={disabled}
    renderItem={(item, index) => (
      <BibleRefField
        name={`${name}.bibleRefs.${index}`}
        defaultValue={item}
        disabled={disabled}
      />
    )}
  />
);

ReadingField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ReadingField;
