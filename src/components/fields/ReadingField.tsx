import React from 'react';

import type { FormFieldProps, ReadingBlockData } from '../../types';
import ArraySortableControl from '../controls/ArraySortableControl';
import BibleRefField from './BibleRefField';

function ReadingField({
  name,
  disabled = false,
}: FormFieldProps<ReadingBlockData>) {
  return (
    <ArraySortableControl
      name={`${name}.bibleRefs`}
      gutters={3}
      defaultItem={{ id: '', excerpt: '' }}
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
}

export default ReadingField;
