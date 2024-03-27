import BibleRefField from "./BibleRefField";
import type { FormFieldProps } from "../../types";
import ArraySortableControl from "../controls/ArraySortableControl";

function ReadingField({ name, disabled = false }: FormFieldProps) {
  return (
    <ArraySortableControl
      defaultItem={{ id: "", excerpt: "" }}
      disabled={disabled}
      gutters={3}
      name={`${name}.bibleRefs`}
      renderItem={(item, index) => (
        <BibleRefField
          disabled={disabled}
          name={`${name}.bibleRefs.${index}`}
        />
      )}
    />
  );
}

export default ReadingField;
