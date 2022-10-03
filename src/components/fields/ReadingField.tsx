import type { FormFieldProps } from '../../types';
import ArraySortableControl from '../controls/ArraySortableControl';
import BibleRefField from './BibleRefField';

function ReadingField({ name, disabled = false }: FormFieldProps) {
  return (
    <ArraySortableControl
      name={`${name}.bibleRefs`}
      gutters={3}
      defaultItem={{ id: '', excerpt: '' }}
      disabled={disabled}
      renderItem={(item, index) => (
        <BibleRefField
          name={`${name}.bibleRefs.${index}`}
          disabled={disabled}
        />
      )}
    />
  );
}

export default ReadingField;
