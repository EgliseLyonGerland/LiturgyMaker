import React, { useState } from 'react';

import { InfoTwoTone } from '@mui/icons-material';
import {
  TextField,
  Box,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
  Alert,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import find from 'lodash/find';
import get from 'lodash/get';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { selectAllSongs } from '../../redux/slices/songs';
import type { FormFieldProps, SongsItem } from '../../types';
import ArraySortableControl from '../controls/ArraySortableControl';
import TextFieldControl from '../controls/TextFieldControl';
import SongDetailsDrawer from '../SongDetailsDrawer';

function Item({ name, disabled }: { name: string; disabled: boolean }) {
  const songs = useSelector(selectAllSongs);
  const [showDetails, setShowDetails] = useState(false);
  const id = useWatch({ name: `${name}.id` });
  const lyrics = useWatch({ name: `${name}.lyrics` });
  const theme = useTheme();
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const { setValue } = useFormContext();
  const song = find(songs, ['id', id]);

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
                setValue(`${name}.lyrics`, null);
              }}
              onBlur={onBlur}
              getOptionLabel={(option) => option.title}
              renderOption={(props, option) => (
                <Box
                  {...props}
                  component="li"
                  sx={{
                    '&.MuiAutocomplete-option': {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    },
                  }}
                  key={option.id}
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

      {lyrics && (
        <Alert
          severity="warning"
          sx={{ mt: 1 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setValue(`${name}.lyrics`, null);
              }}
            >
              Rétablir
            </Button>
          }
        >
          Les paroles de ce chant ont été modifiées.
        </Alert>
      )}

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
              {upSmall ? (
                <Button size="small" onClick={() => setShowDetails(true)}>
                  Informations
                </Button>
              ) : (
                <IconButton size="small" onClick={() => setShowDetails(true)}>
                  <InfoTwoTone />
                </IconButton>
              )}
            </span>
          </Box>
        )}
      </Box>

      {song && (
        <SongDetailsDrawer
          data={song}
          open={showDetails}
          overridedLyrics={lyrics}
          editable
          onClose={() => setShowDetails(false)}
          onLyricsChanged={(data) => {
            setValue(`${name}.lyrics`, data, {
              shouldDirty: true,
            });
          }}
        />
      )}
    </div>
  );
}

function SongsField({ name, disabled = false }: FormFieldProps) {
  return (
    <ArraySortableControl<SongsItem>
      name={`${name}.items`}
      defaultItem={{ id: '', infos: '', repeat: false, lyrics: null }}
      renderItem={(item: SongsItem, index: number) => (
        <Item name={`${name}.items.${index}`} disabled={disabled} />
      )}
      gutters={3}
      disabled={disabled}
    />
  );
}

export default SongsField;
