import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isString } from 'lodash';
import { useParams } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import { Box, Container, TextField, Typography } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import LyricsField from '../components/LyricsField';
import { fetchSongs, persistSong, selectSongById } from '../redux/slices/songs';

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

const SongEdit = () => {
  const params = useParams();
  const songsStatus = useSelector((state) => state.songs.status);
  const song = useSelector((state) => selectSongById(state, params.songId));
  const dispatch = useDispatch();

  useEffect(() => {
    if (songsStatus === 'idle') {
      dispatch(fetchSongs());
    }
  }, [dispatch, songsStatus]);

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
                {({ input }) => (
                  <LyricsField {...input} lyrics={[...input.value]} />
                )}
              </Field>
            </Block>
          </Container>
        </form>
      )}
    />
  );
};

export default SongEdit;
