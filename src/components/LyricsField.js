import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputBase,
} from '@material-ui/core';
import Sortable from './Sortable';

function LyricsField({ lyrics, onChange, onFocus, onBlur }) {
  const handleChange = (index, text, type) => {
    const splittedText = text.split('\n');

    if (splittedText.length > 6) {
      return;
    }

    const lastLine = splittedText.pop();
    const formattedText = splittedText
      .filter((line) => line.trim() !== '')
      .concat([lastLine])
      .join('\n');

    const newValue = [...lyrics];
    newValue[index] = { text: formattedText, type };

    onChange(newValue);
  };

  if (lyrics.length === 0) {
    lyrics.push({ text: '', type: 'verse' });
  }

  return (
    <Sortable
      items={lyrics}
      onChange={onChange}
      getDefaultItem={() => ({ text: '', type: 'verse' })}
      gutters={5}
      renderItem={({ text, type }, index) => (
        <>
          <Box
            bgcolor="rgba(255,255,255,0.09)"
            borderRadius={4}
            px={3}
            py={2}
            mb={1}
          >
            <InputBase
              value={text}
              fullWidth
              multiline
              rows={6}
              placeholder={'Lorem ipsum dolor sit amet...'}
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={({ target }) => {
                handleChange(index, target.value, type);
              }}
              style={{
                lineHeight: 1.5,
                fontSize: 18,
              }}
            />
          </Box>

          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={type === 'chorus'} />}
              label="Refrain"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={({ target: { checked } }) => {
                handleChange(index, text, checked ? 'chorus' : 'verse');
              }}
            />
          </FormGroup>
        </>
      )}
    />
  );
}

export default LyricsField;
