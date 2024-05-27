import { InfoTwoTone } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import find from 'lodash/find'
import get from 'lodash/get'
import { useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useSelector } from 'react-redux'

import { selectAllSongs } from '../../redux/slices/songs'
import type { FormFieldProps, SongsItem } from '../../types'
import ArraySortableControl from '../controls/ArraySortableControl'
import TextFieldControl from '../controls/TextFieldControl'
import SongDetailsDrawer from '../SongDetailsDrawer'

function Item({ name, disabled }: { name: string, disabled: boolean }) {
  const songs = useSelector(selectAllSongs)
  const [showDetails, setShowDetails] = useState(false)
  const id = useWatch({ name: `${name}.id` })
  const lyrics = useWatch({ name: `${name}.lyrics` })
  const theme = useTheme()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'))
  const { setValue } = useFormContext()
  const song = find(songs, ['id', id])

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
              autoComplete
              disabled={disabled}
              getOptionLabel={option => option.title}
              onBlur={onBlur}
              onChange={(event, option) => {
                onChange(get(option, 'id', null))
                setValue(`${name}.lyrics`, null)
              }}
              options={songs}
              renderInput={params => (
                <TextField
                  {...params}
                  error={!!error}
                  helperText={error?.message}
                  inputRef={ref}
                  label="Titre"
                  margin="dense"
                  variant="filled"
                />
              )}
              renderOption={(props, option) => (
                <Box
                  {...props}
                  component="li"
                  key={option.id}
                  sx={{
                    '&.MuiAutocomplete-option': {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    },
                  }}
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
              value={song || null}
            />
          )
        }}
      />

      {lyrics && (
        <Alert
          action={(
            <Button
              color="inherit"
              onClick={() => {
                setValue(`${name}.lyrics`, null)
              }}
              size="small"
            >
              Rétablir
            </Button>
          )}
          severity="warning"
          sx={{ mt: 1 }}
        >
          Les paroles de ce chant ont été modifiées.
        </Alert>
      )}

      <TextFieldControl
        disabled={disabled}
        label="Informations"
        multiline
        name={`${name}.infos`}
      />

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={(
            <Controller
              name={`${name}.repeat`}
              render={({
                field: { value, ref: inputRef, onChange, onBlur },
              }) => (
                <Checkbox
                  checked={value}
                  disabled={disabled}
                  onChange={e => onChange(e.target.checked)}
                  {...{ inputRef, onBlur }}
                />
              )}
            />
          )}
          label="Chanté deux fois ?"
        />
        {song && (
          <Box sx={{ marginLeft: 'auto' }}>
            <span>
              {upSmall
                ? (
                  <Button onClick={() => setShowDetails(true)} size="small">
                    Informations
                  </Button>
                  )
                : (
                  <IconButton onClick={() => setShowDetails(true)} size="small">
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
          editable
          onClose={() => setShowDetails(false)}
          onLyricsChanged={(data) => {
            setValue(`${name}.lyrics`, data, {
              shouldDirty: true,
            })
          }}
          open={showDetails}
          overridedLyrics={lyrics}
        />
      )}
    </div>
  )
}

function SongsField({ name, disabled = false }: FormFieldProps) {
  return (
    <ArraySortableControl<SongsItem>
      defaultItem={{ id: '', infos: '', repeat: false, lyrics: null }}
      disabled={disabled}
      gutters={3}
      name={`${name}.items`}
      renderItem={(item: SongsItem, index: number) => (
        <Item disabled={disabled} name={`${name}.items.${index}`} />
      )}
    />
  )
}

export default SongsField
