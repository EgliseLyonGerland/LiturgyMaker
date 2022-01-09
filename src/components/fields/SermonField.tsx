import React from 'react';

import { Box } from '@mui/material';

import type { FormFieldProps, SermonBlockData } from '../../types';
import ArraySortableControl from '../controls/ArraySortableControl';
import TextFieldControl from '../controls/TextFieldControl';
import BibleRefField from './BibleRefField';

function SermonField({
  name,
  defaultValue,
  disabled = false,
}: FormFieldProps<SermonBlockData>) {
  return (
    <div>
      <TextFieldControl
        name={`${name}.title`}
        label="Titre"
        defaultValue={defaultValue?.title}
        disabled={disabled}
      />
      <TextFieldControl
        name={`${name}.author`}
        label="Auteur"
        defaultValue={defaultValue?.author}
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
}

export default SermonField;