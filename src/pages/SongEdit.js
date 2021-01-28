import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongs } from '../redux/actions/songs';
import { find, isString } from 'lodash';
import { useParams } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  InputBase,
  TextField,
  Typography,
} from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import Sortable from '../components/Sortable';

const Block = ({ header, children, ...props }) => {
  return (
    <Box bgcolor="background.light" borderRadius={16} {...props}>
      {header && (
        <Box
          height={72}
          px={5}
          display="flex"
          alignItems="center"
          bgcolor="background.dark"
          borderRadius="16px 16px 0 0"
        >
          {isString(header) ? (
            <Typography variant="h6">{header}</Typography>
          ) : (
            header
          )}
        </Box>
      )}
      <Box p={5} px={8}>
        {children}
      </Box>
    </Box>
  );
};

const LyricsField = ({ value: defaultValue, onChange, onFocus, onBlur }) => {
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

    const newValue = [...defaultValue];
    newValue[index] = { text: formattedText, type };

    onChange(newValue);
  };

  if (defaultValue.length === 0) {
    defaultValue.push({ text: '', type: 'verse' });
  }

  return (
    <Sortable
      items={defaultValue}
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
              onChange={({ target: { value } }) => {
                handleChange(index, value, type);
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
};

const SongEdit = () => {
  const songsState = useSelector((state) => state.songs);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    if (!songsState.loaded) {
      dispatch(fetchSongs());
    }
  }, [dispatch, songsState.loaded]);

  const song = find(songsState.data, ['id', params.songId]);

  if (!song) {
    return (
      <Box display="flex" justifyContent="center" m={5}>
        <BeatLoader color="#DDD" />
      </Box>
    );
  }

  return (
    <Form
      onSubmit={console.log}
      initialValues={song}
      validate={(values) => {
        const errors = {};

        if (!values.title) {
          errors.title = 'Requis';
        }
        if (!Number.isInteger(parseInt(values.number, 10))) {
          errors.number = 'Doit être un nombre';
        }

        return errors;
      }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Container maxWidth="md">
            <Block header="Informations générales">
              <Field name="title">
                {({ input, meta }) => (
                  <TextField
                    label="Titre"
                    variant="filled"
                    margin="dense"
                    fullWidth
                    error={meta.error && meta.touched}
                    helperText={meta.touched && meta.error}
                    {...input}
                  />
                )}
              </Field>
              <Field name="authors">
                {({ input, meta }) => (
                  <TextField
                    label="Auteurs"
                    variant="filled"
                    margin="dense"
                    helperText="Séparés par une virgule (ex. Paul Baloche, Matt Redman)"
                    fullWidth
                    {...input}
                  />
                )}
              </Field>
              <Field name="number">
                {({ input, meta }) => (
                  <TextField
                    label="Position dans le recueil"
                    variant="filled"
                    margin="dense"
                    error={meta.error && meta.touched}
                    helperText={meta.touched && meta.error}
                    fullWidth
                    {...input}
                  />
                )}
              </Field>
              <Field name="copyright">
                {({ input, meta }) => (
                  <TextField
                    label="Copyright"
                    variant="filled"
                    margin="dense"
                    fullWidth
                    {...input}
                  />
                )}
              </Field>
              <Field name="translation">
                {({ input, meta }) => (
                  <TextField
                    label="Traduction"
                    variant="filled"
                    margin="dense"
                    fullWidth
                    {...input}
                  />
                )}
              </Field>
              <Field name="collection">
                {({ input, meta }) => (
                  <TextField
                    label="Collections"
                    variant="filled"
                    margin="dense"
                    helperText="Séparés par une virgule (ex. ARC 123, JEM 456)"
                    fullWidth
                    {...input}
                  />
                )}
              </Field>
            </Block>

            <Block header="Paroles" mt={5}>
              <Field name="lyrics">
                {({ input }) => <LyricsField {...input} />}
              </Field>
            </Block>
          </Container>
        </form>
      )}
    />
  );
};

export default SongEdit;
