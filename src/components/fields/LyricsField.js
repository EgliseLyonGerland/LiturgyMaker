import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputBase,
} from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';

import ArraySortableControl from '../controls/ArraySortableControl';

function LyricsField({ name, disabled = false }) {
  const { control } = useFormContext();

  return (
    <ArraySortableControl
      name={name}
      gutters={5}
      defaultItem={{ text: '', type: 'verse' }}
      disabled={disabled}
      renderItem={(item, index) => (
        <>
          <Controller
            name={`${name}.${index}.text`}
            control={control}
            defaultValue={item.text}
            render={({ field, fieldState: { error } }) => (
              <>
                <Box
                  bgcolor="rgba(255,255,255,0.09)"
                  borderRadius={4}
                  px={3}
                  py={2}
                  mb={1}
                >
                  <InputBase
                    rows={6}
                    placeholder={'Lorem ipsum dolor sit amet...'}
                    disabled={disabled}
                    style={{
                      lineHeight: 1.5,
                      fontSize: 18,
                    }}
                    fullWidth
                    multiline
                    {...field}
                  />
                </Box>

                {error && (
                  <FormHelperText error>{error.message}</FormHelperText>
                )}
              </>
            )}
          />

          <Controller
            name={`${name}.${index}.type`}
            control={control}
            defaultValue={item.type}
            render={({ field: { value, onChange, onBlur } }) => (
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox checked={value === 'chorus'} />}
                  label="Refrain"
                  disabled={disabled}
                  onBlur={onBlur}
                  onChange={(event, checked) =>
                    onChange(checked ? 'chorus' : 'verse')
                  }
                />
              </FormGroup>
            )}
          />
        </>
      )}
    />
  );
}

export default LyricsField;
