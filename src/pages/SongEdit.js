import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isString from 'lodash/isString';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { useParams } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import { Box, Container, TextField, Typography } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import SaveButton from '../components/SaveButton';
import LyricsField from '../components/fields/LyricsField';
import { fetchSongs, persistSong, selectSongById } from '../redux/slices/songs';

function isNumberRule(value) {
  if (value && !/^[0-9]+$/.test(value)) {
    return 'Doit-être un numérique';
  }

  return true;
}

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
  const [disabled, setDisabled] = useState(false);
  const [persisting, setPersisting] = useState(false);
  const [persisted, setPersisted] = useState(false);

  const {
    control,
    handleSubmit: submitForm,
    reset: resetForm,
    formState: { isDirty, errors },
  } = useForm({
    reValidateMode: 'all',
  });

  const handleSubmit = async (data) => {
    setDisabled(true);
    setPersisting(true);

    await dispatch(persistSong({ id: song.id, ...data }));

    setPersisted(true);
    setPersisting(false);
    setDisabled(false);
  };

  useEffect(() => {
    if (song) {
      resetForm(cloneDeep(song));
    }
  }, [song, resetForm]);

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
    <Container maxWidth="md">
      <Block header="Informations générales">
        <Controller
          name="title"
          control={control}
          defaultValue={song.title || ''}
          rules={{ required: 'Requis' }}
          render={({ value, ref: inputRef, onChange, onBlur }, { invalid }) => (
            <TextField
              label="Titre"
              variant="filled"
              margin="dense"
              disabled={disabled}
              error={invalid}
              helperText={get(errors, 'title.message', '')}
              fullWidth
              {...{ value, inputRef, onChange, onBlur }}
            />
          )}
        />
        <Controller
          name="authors"
          control={control}
          defaultValue={song.authors || ''}
          render={({ value, ref: inputRef, onChange, onBlur }) => (
            <TextField
              label="Auteurs"
              variant="filled"
              margin="dense"
              disabled={disabled}
              helperText="Séparés par une virgule (ex. Paul Baloche, Matt Redman)"
              fullWidth
              {...{ value, inputRef, onChange, onBlur }}
            />
          )}
        />
        <Controller
          name="number"
          control={control}
          defaultValue={song.number || ''}
          rules={{ validate: { isNumberRule } }}
          render={({ value, ref: inputRef, onChange, onBlur }, { invalid }) => (
            <TextField
              label="Position dans le recueil"
              variant="filled"
              margin="dense"
              disabled={disabled}
              error={invalid}
              helperText={get(errors, 'number.message', '')}
              fullWidth
              value={value || ''}
              {...{ inputRef, onChange, onBlur }}
            />
          )}
        />
        <Controller
          name="copyright"
          control={control}
          defaultValue={song.copyright || ''}
          render={({ value, ref: inputRef, onChange, onBlur }) => (
            <TextField
              label="Copyright"
              variant="filled"
              margin="dense"
              disabled={disabled}
              fullWidth
              {...{ value, inputRef, onChange, onBlur }}
            />
          )}
        />
        <Controller
          name="translation"
          control={control}
          defaultValue={song.translation || ''}
          render={({ value, ref: inputRef, onChange, onBlur }) => (
            <TextField
              label="Traduction"
              variant="filled"
              margin="dense"
              disabled={disabled}
              fullWidth
              {...{ value, inputRef, onChange, onBlur }}
            />
          )}
        />
        <Controller
          name="collection"
          control={control}
          defaultValue={song.collection || ''}
          render={({ value, ref: inputRef, onChange, onBlur }) => (
            <TextField
              label="Collections"
              variant="filled"
              margin="dense"
              disabled={disabled}
              helperText="Séparés par une virgule (ex. ARC 123, JEM 456)"
              fullWidth
              {...{ value, inputRef, onChange, onBlur }}
            />
          )}
        />
      </Block>
      <Block header="Paroles" mt={5}>
        <LyricsField
          name="lyrics"
          control={control}
          defaultValue={song.lyrics}
          disabled={disabled}
        />
      </Block>

      <SaveButton
        persisting={persisting}
        persisted={persisted}
        dirty={isDirty}
        onClick={submitForm(handleSubmit)}
        onHide={() => setPersisted(false)}
      />
    </Container>
  );
};

export default SongEdit;
