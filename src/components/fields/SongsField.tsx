import React, { useState } from 'react';

import {
  TextField,
  Box,
  Typography,
  Button,
  SwipeableDrawer,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import find from 'lodash/find';
import get from 'lodash/get';
import { Controller, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { selectAllSongs } from '../../redux/slices/songs';
import type { FormFieldProps, SongsItem } from '../../types';
import ArraySortableControl from '../controls/ArraySortableControl';
import TextFieldControl from '../controls/TextFieldControl';

function Item({ name, disabled }: { name: string; disabled: boolean }) {
  const songs = useSelector(selectAllSongs);
  const [showLyrics, setShowLyrics] = useState(false);
  const id = useWatch({ name: `${name}.id` });
  const song = find(songs, ['id', id]);

  const toggleLyrics =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setShowLyrics(open);
    };

  return (
    <div>
      <Controller
        name={`${name}.id`}
        render={({
          field: { ref, onChange, onBlur },
          fieldState: { error },
        }) => {
          return (
            <Autocomplete
              value={song || null}
              options={songs}
              disabled={disabled}
              onChange={(event, option) => {
                onChange(get(option, 'id', null));
              }}
              onBlur={onBlur}
              getOptionLabel={(option) => option.title}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  key={option.id}
                  sx={{
                    '&.MuiAutocomplete-option': {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    },
                  }}
                  {...props}
                >
                  <Box>
                    <Box component="span" fontWeight={500}>
                      {option.title}
                    </Box>
                    {option.aka && ` (${option.aka})`}
                  </Box>
                  <Box
                    fontSize="0.8em"
                    fontStyle="italic"
                    style={{ opacity: 0.7 }}
                  >
                    {option.authors || 'Aucun auteur'}
                    {option.number && ` (${option.number})`}
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Titre"
                  variant="filled"
                  margin="dense"
                  inputRef={ref}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
              autoComplete
            />
          );
        }}
      />
      <TextFieldControl
        name={`${name}.infos`}
        label="Informations"
        disabled={disabled}
        multiline
      />

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Controller
              name={`${name}.repeat`}
              render={({
                field: { value, ref: inputRef, onChange, onBlur },
              }) => (
                <Checkbox
                  disabled={disabled}
                  onChange={(e) => onChange(e.target.checked)}
                  checked={value}
                  {...{ inputRef, onBlur }}
                />
              )}
            />
          }
          label="Chanté deux fois ?"
        />
        {song && (
          <Box sx={{ marginLeft: 'auto' }}>
            <span>
              <Button size="small" onClick={toggleLyrics(true)}>
                Informations
              </Button>
            </span>
          </Box>
        )}
      </Box>

      <SwipeableDrawer
        anchor="right"
        open={showLyrics}
        onOpen={toggleLyrics(true)}
        onClose={toggleLyrics(false)}
      >
        {song && (
          <Box sx={{ maxWidth: 450, width: '95vw', p: 2 }}>
            <Box mb={4}>
              <Typography component="span" fontSize="1.2em">
                <b>{song.title}</b>
                {song.aka ? ` (${song.aka})` : ''}
              </Typography>
              <Typography color="textSecondary" component="span">
                {song.number ? ` (${song.number})` : ''}
              </Typography>
              <Typography color="textSecondary" variant="body2" mt={1}>
                {song.authors || <i>Aucun auteur</i>}
              </Typography>
            </Box>

            {song.lyrics.length ? (
              song.lyrics.map(({ text, type }, index) => (
                <Box
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  mb={2}
                >
                  <Typography
                    component="div"
                    sx={{
                      whiteSpace: 'pre',
                      ...(type === 'chorus'
                        ? {
                            fontStyle: 'italic',
                            fontFamily: 'Adobe Hebrew',
                          }
                        : {}),
                    }}
                  >
                    {text.split('\n').map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box sx={{ fontStyle: 'italic' }}>Aucune parole</Box>
            )}
          </Box>
        )}
      </SwipeableDrawer>
    </div>
  );
}

function SongsField({ name, disabled = false }: FormFieldProps) {
  return (
    <ArraySortableControl<SongsItem>
      name={`${name}.items`}
      defaultItem={{ id: '', infos: '', repeat: false }}
      renderItem={(item: SongsItem, index: number) => (
        <Item name={`${name}.items.${index}`} disabled={disabled} />
      )}
      gutters={3}
      disabled={disabled}
    />
  );
}

export default SongsField;
