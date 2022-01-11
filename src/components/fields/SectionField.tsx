import React from 'react';

import type { FormFieldProps } from '../../types';
import TextFieldControl from '../controls/TextFieldControl';

function SectionField({ name, disabled = false }: FormFieldProps) {
  return (
    <TextFieldControl
      name={`${name}.title`}
      label="Titre"
      disabled={disabled}
    />
  );
}

export default SectionField;
