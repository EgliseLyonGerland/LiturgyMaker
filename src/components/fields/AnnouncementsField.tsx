import React from 'react';

import type { FormFieldProps } from '../../types';
import ArraySortableControl from '../controls/ArraySortableControl';
import TextFieldControl from '../controls/TextFieldControl';

function AnnouncementsField({ name, disabled = false }: FormFieldProps) {
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
            disabled={disabled}
          />
          <TextFieldControl
            name={`${name}.items.${index}.detail`}
            label="Détails"
            disabled={disabled}
            multiline
          />
        </div>
      )}
    />
  );
}

export default AnnouncementsField;
