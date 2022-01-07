import React from 'react';

import { Box } from '@material-ui/core';

import type { FormFieldProps, OpenDoorsBlockData } from '../../types';
import ArraySortableControl from '../controls/ArraySortableControl';
import TextFieldControl from '../controls/TextFieldControl';

function OpenDoorsField({
  name,
  defaultValue,
  disabled = false,
}: FormFieldProps<OpenDoorsBlockData>) {
  return (
    <div>
      <TextFieldControl
        name={`${name}.title`}
        label="Titre"
        defaultValue={defaultValue?.title}
        disabled={disabled}
      />
      <TextFieldControl
        name={`${name}.detail`}
        label="Informations"
        defaultValue={defaultValue?.detail}
        disabled={disabled}
        multiline
      />

      <Box fontSize={16} fontWeight={900} mt={4} mb={2}>
        Sujets de prière
      </Box>

      <ArraySortableControl<OpenDoorsBlockData['prayerTopics'][number]>
        name={`${name}.prayerTopics`}
        maxItems={3}
        defaultItem={{ text: '' }}
        disabled={disabled}
        renderItem={(item, index) => (
          <TextFieldControl
            name={`${name}.prayerTopics.${index}.text`}
            label={`Sujet #${index + 1}`}
            defaultValue={item.text || ''}
          />
        )}
      />
    </div>
  );
}

export default OpenDoorsField;
