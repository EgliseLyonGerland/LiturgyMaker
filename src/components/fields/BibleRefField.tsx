import { useState } from 'react';

import { Autocomplete, Box, TextField, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import books from '../../config/bibleBooks.json';
import type { FormFieldProps } from '../../types';
import { getPassage } from '../../utils/bibleRef';
import TextFieldControl from '../controls/TextFieldControl';

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
            options={books.map((book) => book.name)}
            disabled={disabled}
            freeSolo
            autoComplete
            autoHighlight
            value={value}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={ref}
                label="Référence biblique"
                variant="filled"
                margin="dense"
                error={!!error}
                helperText={error?.message}
                onChange={onChange}
              />
            )}
          />
        )}
      />
      {withExcerpt && (
        <>
          <TextFieldControl
            name={`${name}.excerpt`}
            label="Extrait"
            disabled={disabled}
            multiline
          />
          <Box
            component="button"
            type="button"
            disabled={disabled}
            onClick={() => handleFillPassage()}
            sx={{
              background: 'transparent',
              border: 0,
              padding: 0,
              color: theme.palette.text.secondary,
              cursor: 'pointer',
              outline: 0,
            }}
          >
            {loading
              ? 'Chargement...'
              : "Remplir automatiquement l'extrait à partir de la référence"}
          </Box>
        </>
      )}
    </div>
  );
}

export default BibleRefField;
