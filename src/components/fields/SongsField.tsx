import React, { useState } from 'react';

import {
  TextField,
  Box,
  Typography,
  alpha,
  Button,
  Tooltip,
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
  const hasLyrics = song && song.lyrics.length > 0;

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
              <Button
                size="small"
                disabled={!hasLyrics}
                onClick={() => {
                  setShowLyrics(!showLyrics);
                }}
              >
                {(() => {
                  if (!hasLyrics) {
                    return 'Aucune parole';
                  }

                  return showLyrics
                    ? 'Masquer les paroles'
                    : 'Afficher les paroles';
                })()}
              </Button>
            </span>
          </Box>
        )}
      </Box>

      {hasLyrics && showLyrics && (
        <Box
          sx={{
            my: 1,
            mx: -3,
            p: 3,
            columnCount: 2,
            columnGap: 2,
            background: alpha('#000', 0.2),
          }}
        >
          {song.lyrics.map(({ text, type }, index) => (
            <Box
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              sx={{
                mb: 2,
                breakInside: 'avoid',
                pageBreakInside: 'avoid',
                overflowX: 'hidden',
                maskImage:
                  'linear-gradient(to left, transparent 0%, black 10%)',

                '&:last-of-type': { m: 0 },
              }}
            >
              <Typography
                component="div"
                sx={{
                  whiteSpace: 'pre',
                  ...(type === 'chorus'
                    ? {
                        fontStyle: 'italic',
                        fontFamily: 'Adobe Hebrew',
                        opacity: 0.8,
                      }
                    : {}),
                }}
              >
                {text.split('\n').map((line) => (
                  <Tooltip
                    key={line}
                    title={line}
                    followCursor
                    enterDelay={1000}
                    sx={{
                      maxWidth: 'none',
                      background: 'ocean',
                    }}
                  >
                    <div>{line}</div>
                  </Tooltip>
                ))}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
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
