import React, { useState } from 'react';

import { TextField, Autocomplete } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useController, useFormContext } from 'react-hook-form';

import books from '../../config/bibleBooks.json';
import type { FormFieldProps } from '../../types';
import { validate, getPassage } from '../../utils/bibleRef';
import TextFieldControl from '../controls/TextFieldControl';

interface Props
  extends FormFieldProps<{
    ref: string;
    excerpt?: string;
  }> {
  withExcerpt?: boolean;
}

const useStyles = makeStyles(
  (theme) => ({
    excerptButton: {
      background: 'transparent',
      border: 0,
      padding: 0,
      color: theme.palette.text.secondary,
      cursor: 'pointer',
      outline: 0,
    },
  }),
  { name: 'BibleRefField' },
);

function BibleRefField({
  name,
  defaultValue,
  withExcerpt = true,
  disabled = false,
}: Props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const { control, setValue } = useFormContext();
  const refController = useController({
    name: `${name}.ref`,
    control,
    defaultValue: defaultValue?.ref,
  });

  const currentRef = refController.field.value;

  let error: string = '';
  if (currentRef) {
    error = validate(currentRef);
  }
  if (!error) {
    error = refController.fieldState.error?.message || '';
  }

  const handleFillPassage = async () => {
    setLoading(true);
    const excerpt = await getPassage(refController.field.value);

    if (excerpt) {
      setValue(name, { ref: refController.field.value, excerpt });
    }
    setLoading(false);
  };

  return (
    <div>
      <Autocomplete
        options={books.map((book) => book.name)}
        disabled={disabled}
        defaultValue={defaultValue?.ref}
        freeSolo
        autoComplete
        autoHighlight
        renderInput={(params) => (
          <TextField
            name={`${name}.ref`}
            label="Référence biblique"
            variant="filled"
            margin="dense"
            error={!!error}
            helperText={error}
            onChange={refController.field.onChange}
            onBlur={refController.field.onBlur}
            {...params}
          />
        )}
      />
      {withExcerpt && (
        <>
          <TextFieldControl
            name={`${name}.excerpt`}
            label="Extrait"
            defaultValue={defaultValue?.excerpt}
            disabled={disabled}
            multiline
          />
          <button
            type="button"
            className={classes.excerptButton}
            disabled={disabled}
            onClick={() => handleFillPassage()}
          >
            {loading
              ? 'Chargement...'
              : "Remplir automatiquement l'extrait à partir de la référence"}
          </button>
        </>
      )}
    </div>
  );
}

export default BibleRefField;
