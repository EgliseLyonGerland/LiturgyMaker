import React from 'react';

import PropTypes from 'prop-types';

import ArraySortableControl from '../controls/ArraySortableControl';
import TextFieldControl from '../controls/TextFieldControl';

const AnnouncementsField = ({ name, disabled = false }) => {
  return (
    <ArraySortableControl
      name={`${name}.items`}
      gutters={3}
      defaultItem={{ title: '', detail: '' }}
      disabled={disabled}
      renderItem={(item, index) => (
        <div>
          <TextFieldControl
            name={`${name}.items.${index}.title`}
            label="Titre"
            defaultValue={item.title}
            disabled={disabled}
          />
          <TextFieldControl
            name={`${name}.items.${index}.detail`}
            label="Détails"
            defaultValue={item.detail}
            disabled={disabled}
            multiline
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
