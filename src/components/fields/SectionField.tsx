import React from 'react';

import type { FormFieldProps, SectionBlockData } from '../../types';
import TextFieldControl from '../controls/TextFieldControl';

function SectionField({
  name,
  defaultValue,
  disabled = false,
}: FormFieldProps<SectionBlockData>) {
  return (
    <TextFieldControl
      name={`${name}.title`}
      label="Titre"
      defaultValue={defaultValue?.title}
      disabled={disabled}
    />
  );
}

export default SectionField;
