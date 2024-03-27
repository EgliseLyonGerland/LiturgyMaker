import { Autocomplete, Box, TextField, useTheme } from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import books from "../../config/bibleBooks.json";
import type { FormFieldProps } from "../../types";
import { getPassage } from "../../utils/bibleRef";
import TextFieldControl from "../controls/TextFieldControl";

interface Props extends FormFieldProps {
  withExcerpt?: boolean;
}

function BibleRefField({ name, withExcerpt = true, disabled = false }: Props) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { setValue, getValues } = useFormContext();

  const handleFillPassage = async () => {
    setLoading(true);

    const id = getValues(`${name}.id`);
    const excerpt = await getPassage(id);

    if (excerpt) {
      setValue(`${name}.excerpt`, excerpt, { shouldDirty: true });
    }

    setLoading(false);
  };

  return (
    <div>
      <Controller
        name={`${name}.id`}
        render={({
          field: { ref, onChange, value },
          fieldState: { error },
        }) => (
          <Autocomplete
            autoComplete
            autoHighlight
            disabled={disabled}
            freeSolo
            options={books.reduce<string[]>(
              (acc, book) =>
                book.alt
                  ? acc.concat(book.name).concat(book.alt)
                  : acc.concat(book.name),
              [],
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!error}
                helperText={error?.message}
                inputRef={ref}
                label="Référence biblique"
                margin="dense"
                onChange={onChange}
                variant="filled"
              />
            )}
            value={value}
          />
        )}
      />
      {withExcerpt && (
        <>
          <TextFieldControl
            disabled={disabled}
            label="Extrait"
            multiline
            name={`${name}.excerpt`}
          />
          <Box
            component="button"
            disabled={disabled}
            onClick={() => handleFillPassage()}
            sx={{
              background: "transparent",
              border: 0,
              padding: 0,
              color: theme.palette.text.secondary,
              cursor: "pointer",
              outline: 0,
            }}
            type="button"
          >
            {loading
              ? "Chargement..."
              : "Remplir automatiquement l'extrait à partir de la référence"}
          </Box>
        </>
      )}
    </div>
  );
}

export default BibleRefField;
