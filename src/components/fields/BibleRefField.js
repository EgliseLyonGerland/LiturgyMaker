import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Controller, useController } from 'react-hook-form';
import TextFieldSuggest from '../TextFieldSuggest';
import { validate, getPassage } from '../../utils/bibleRef';
import books from '../../config/bibleBooks.json';

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

const BibleRefField = ({ name, control, defaultValue, withExcerpt = true }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const refController = useController({
    name: `${name}.ref`,
    control,
    defaultValue: defaultValue.ref,
  });

  const currentRef = refController.field.value;

  let error = '';
  if (currentRef) {
    error = validate(currentRef);
  }

  const handleFillPassage = async (onChange) => {
    setLoading(true);

    const excerpt = await getPassage(currentRef);

    if (excerpt) {
      onChange(excerpt);
    }

    setLoading(false);
  };

  return (
    <div>
      <TextFieldSuggest
        label="Référence biblique"
        value={currentRef || ''}
        variant="filled"
        margin="dense"
        error={!!error}
        helperText={error}
        fullWidth
        items={books}
        field="name"
        inputRef={refController.field.ref}
        onChange={refController.field.onChange}
        onBlur={refController.field.onBlur}
      />
      {withExcerpt && (
        <Controller
          name={`${name}.excerpt`}
          control={control}
          defaultValue={defaultValue.excerpt || ''}
          render={({ value, ref: inputRef, onChange, onBlur }) => (
            <>
              <TextField
                label="Extrait"
                variant="filled"
                margin="dense"
                fullWidth
                multiline
                {...{ value, inputRef, onChange, onBlur }}
              />
              <button
                type="button"
                className={classes.excerptButton}
                onClick={() => handleFillPassage(onChange)}
              >
                {loading
                  ? 'Chargement...'
                  : "Remplir automatiquement l'extrait à partir de la référence"}
              </button>
            </>
          )}
        />
      )}
    </div>
  );
};

BibleRefField.propTypes = {
  data: PropTypes.object,
  withExcerpt: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default BibleRefField;
