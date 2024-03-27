import { Box } from "@mui/material";

import BibleRefField from "./BibleRefField";
import type { FormFieldProps } from "../../types";
import ArraySortableControl from "../controls/ArraySortableControl";
import TextFieldControl from "../controls/TextFieldControl";

function SermonField({ name, disabled = false }: FormFieldProps) {
  return (
    <div>
      <TextFieldControl
        disabled={disabled}
        label="Titre"
        name={`${name}.title`}
      />
      <TextFieldControl
        disabled={disabled}
        label="Auteur"
        name={`${name}.author`}
      />

      <Box fontSize={16} fontWeight={900} mb={2} mt={4}>
        Passage(s) biblique(s)
      </Box>

      <ArraySortableControl
        defaultItem={{ id: "" }}
        disabled={disabled}
        name={`${name}.bibleRefs`}
        renderItem={(item, index) => (
          <BibleRefField
            disabled={disabled}
            name={`${name}.bibleRefs.${index}`}
            withExcerpt={false}
          />
        )}
      />

      <Box fontSize={16} fontWeight={900} mb={2} mt={4}>
        Plan
      </Box>

      <ArraySortableControl
        defaultItem={{ text: "" }}
        disabled={disabled}
        name={`${name}.plan`}
        renderItem={(item, index) => (
          <TextFieldControl
            disabled={disabled}
            label={`Point #${index + 1}`}
            name={`${name}.plan.${index}.text`}
          />
        )}
      />
    </div>
  );
}

export default SermonField;
