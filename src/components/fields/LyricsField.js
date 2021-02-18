import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputBase,
} from '@material-ui/core';
import { Controller } from 'react-hook-form';
import FieldArraySortable from '../FieldArraySortable';

function LyricsField({ name, control, disabled = false }) {
  return (
    <FieldArraySortable
      name={name}
      control={control}
      gutters={5}
      defaultItem={{ text: '', type: 'verse' }}
      disabled={disabled}
      renderItem={(item, index) => (
        <>
          <Controller
            name={`${name}[${index}].text`}
            control={control}
            defaultValue={item.text || ''}
            render={({ value, ref: inputRef, onChange, onBlur }) => (
              <Box
                bgcolor="rgba(255,255,255,0.09)"
                borderRadius={4}
                px={3}
                py={2}
                mb={1}
              >
                <InputBase
                  fullWidth
                  multiline
                  rows={6}
                  placeholder={'Lorem ipsum dolor sit amet...'}
                  disabled={disabled}
                  style={{
                    lineHeight: 1.5,
                    fontSize: 18,
                  }}
                  {...{ value, inputRef, onChange, onBlur }}
                />
              </Box>
            )}
          />

          <Controller
            name={`${name}[${index}].type`}
            control={control}
            defaultValue={item.type || false}
            render={({ value, ref: inputRef, onChange, onBlur }) => (
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
