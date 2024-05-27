import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import find from 'lodash/find'
import get from 'lodash/get'
import { Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'

import { selectAllRecitations } from '../../redux/slices/recitations'
import type { FormFieldProps } from '../../types'
import TextFieldControl from '../controls/TextFieldControl'

function RecitationField({ name, disabled = false }: FormFieldProps) {
  const recitations = useSelector(selectAllRecitations)

  return (
    <div>
      <Controller
        name={`${name}.id`}
        render={({
          field: { value, ref: inputRef, onChange, onBlur },
          fieldState: { error },
        }) => (
          <Autocomplete
            autoComplete
            disabled={disabled}
            getOptionLabel={option => option.title}
            onBlur={onBlur}
            onChange={(event, option) => {
              onChange(get(option, 'id', null))
            }}
            options={recitations}
            renderInput={params => (
              <TextField
                {...params}
                error={!!error}
                helperText={error?.message}
                inputRef={inputRef}
                label="Titre"
                margin="dense"
                variant="filled"
              />
            )}
            value={find(recitations, ['id', value]) || null}
          />
        )}
      />
      <TextFieldControl
        disabled={disabled}
        label="Informations"
        multiline
        name={`${name}.infos`}
      />
    </div>
  )
}

export default RecitationField
