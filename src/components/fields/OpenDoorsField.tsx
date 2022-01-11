import React from 'react';

import { Box } from '@mui/material';

import type { FormFieldProps, OpenDoorsBlockData } from '../../types';
import ArraySortableControl from '../controls/ArraySortableControl';
import TextFieldControl from '../controls/TextFieldControl';

function OpenDoorsField({ name, disabled = false }: FormFieldProps) {
  return (
    <div>
      <TextFieldControl
        name={`${name}.title`}
        label="Titre"
        disabled={disabled}
      />
      <TextFieldControl
        name={`${name}.detail`}
        label="Informations"
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
          />
        )}
      />
    </div>
  );
}

export default OpenDoorsField;
