import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isString from 'lodash/isString';
import cloneDeep from 'lodash/cloneDeep';
import { useParams } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import { Box, Container, Typography } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SaveButton from '../components/SaveButton';
import LyricsField from '../components/fields/LyricsField';
import { fetchSongs, persistSong, selectSongById } from '../redux/slices/songs';
import TextFieldControl from '../components/controls/TextFieldControl';
import { songSchema } from '../config/schemas';

const Block = ({ header, children, ...props }) => {
  return (
    <Box bgcolor="tertiary.light" borderRadius={16} {...props}>
      {header && (
        <Box
          height={72}
          px={5}
          display="flex"
          alignItems="center"
          bgcolor="tertiary.dark"
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
  const [persisting, setPersisting] = useState(false);
  const [persisted, setPersisted] = useState(false);

  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(songSchema),
  });
  const {
    reset,
    handleSubmit: submitForm,
    formState: { isDirty, isSubmitting },
  } = form;

  const handleSubmit = async (data) => {
    setPersisting(true);

    await dispatch(persistSong(data));

    setPersisted(true);
    setPersisting(false);
  };

  useEffect(() => {
    if (song) {
      reset(cloneDeep(song));
    }
  }, [song, reset]);

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
      <FormProvider {...form}>
        <Block header="Informations générales">
          <TextFieldControl
            name="title"
            label="Titre"
            disabled={isSubmitting}
          />
          <TextFieldControl name="aka" label="AKA" disabled={isSubmitting} />
          <TextFieldControl
            name="authors"
            label="Auteurs"
            helperText="Séparés par une virgule (ex. Paul Baloche, Matt Redman)"
            disabled={isSubmitting}
          />
          <TextFieldControl
            name="number"
            label="Position dans le recueil"
            disabled={isSubmitting}
            transform={(value) => (value === '' ? null : value)}
          />
          <TextFieldControl
            name="copyright"
            label="Copyright"
            disabled={isSubmitting}
          />
          <TextFieldControl
            name="translation"
            label="Traduction"
            disabled={isSubmitting}
          />
          <TextFieldControl
            name="collection"
            label="Collections"
            helperText="Séparés par une virgule (ex. Paul Baloche, Matt Redman)"
            disabled={isSubmitting}
          />
        </Block>
        <Block header="Paroles" mt={5}>
          <LyricsField name="lyrics" disabled={isSubmitting} />
        </Block>

        <SaveButton
          persisting={persisting}
          persisted={persisted}
          dirty={isDirty}
          onClick={submitForm(handleSubmit)}
          onHide={() => setPersisted(false)}
        />
      </FormProvider>
    </Container>
  );
};

export default SongEdit;
