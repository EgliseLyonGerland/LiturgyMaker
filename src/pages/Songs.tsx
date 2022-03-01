import React, { useEffect, useMemo, useState } from 'react';

import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonBase,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  InputBase,
  Typography,
} from '@mui/material';
import debounce from 'lodash/debounce';
import sortBy from 'lodash/sortBy';
import MiniSearch from 'minisearch';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';

import SongDetailsDrawer from '../components/SongDetailsDrawer';
import { fetchSongs, selectAllSongs } from '../redux/slices/songs';
import { useAppDispatch, useAppSelector } from '../redux/store';
import type { SongDocument } from '../types';

type SongSearchDocument = Pick<SongDocument, 'id' | 'title' | 'authors'> & {
  lyrics: string;
};

function createSearch() {
  const search = new MiniSearch<SongSearchDocument>({
    fields: ['title', 'authors', 'lyrics'],
    searchOptions: {
      boost: { title: 2 },
    },
  });

  return search;
}

function Songs() {
  const songsStatus = useAppSelector((state) => state.songs.status);
  const songs = useAppSelector(selectAllSongs);
  const dispatch = useAppDispatch();
  const [results, setResults] = useState<SongDocument[]>([]);
  const [songDetails, setSongDetails] = useState<SongDocument | null>(null);
  const navigate = useNavigate();

  const search = useMemo(() => createSearch(), []);

  const { control, getValues, watch } = useForm<{
    query: string;
    includeLyrics: boolean;
  }>({
    mode: 'onChange',
    defaultValues: {
      includeLyrics: true,
    },
  });

  const handleFilter = useMemo(
    () =>
      debounce(() => {
        if (!getValues('query')) {
          setResults(sortBy(songs, 'title'));
          return;
        }

        const hits = search.search(getValues('query'), {
          prefix: true,
          fields: ['title', 'authors'].concat(
            getValues('includeLyrics') ? ['lyrics'] : [],
          ),
        });

        setResults(
          hits.reduce<SongDocument[]>((acc, hit) => {
            const song = songs.find((item) => item.id === hit.id);
            return song ? acc.concat(song) : acc;
          }, []),
        );
      }, 500),
    [getValues, search, songs],
  );

  useEffect(() => {
    if (songsStatus === 'idle') {
      dispatch(fetchSongs());
    }
  }, [dispatch, songsStatus]);

  useEffect(() => {
    if (songsStatus === 'success') {
      search.addAll(
        songs.map(({ id, title, authors, lyrics }) => ({
          id,
          title,
          authors,
          lyrics: lyrics.map((part) => part.text).join(' '),
        })),
      );

      handleFilter();
    }
  }, [handleFilter, search, songs, songsStatus]);

  useEffect(() => {
    const subscription = watch(() => {
      handleFilter();
    });
    return () => subscription.unsubscribe();
  }, [getValues, handleFilter, search, songs, watch]);

  const renderToolbar = () => (
    <Box display="flex" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Box
        bgcolor="paper.background.main"
        border="solid 1px"
        borderColor="paper.border"
        borderRadius="4px"
        width={200}
        mr={2}
        px={2}
        py={0.5}
      >
        <Controller
          control={control}
          name="query"
          defaultValue=""
          render={({ field }) => (
            <InputBase placeholder="Recherche" fullWidth {...field} />
          )}
        />
      </Box>
      <FormGroup row>
        <Controller
          control={control}
          name="includeLyrics"
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              label="Rechercher dans les paroles"
              control={
                <Checkbox
                  checked={value}
                  icon={<CheckBoxOutlineBlank fontSize="small" />}
                  checkedIcon={<CheckBox fontSize="small" />}
                  onChange={onChange}
                />
              }
            />
          )}
        />
      </FormGroup>
      <Box sx={{ ml: 'auto' }}>
        <Button
          component={Link}
          to="/songs/new"
          variant="contained"
          size="small"
        >
          Nouveau
        </Button>
      </Box>
    </Box>
  );

  if (songsStatus !== 'success' || search.documentCount === 0) {
    return (
      <Box display="flex" justifyContent="center" m={5}>
        <BeatLoader color="#DDD" />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <SongDetailsDrawer
        data={songDetails}
        open={Boolean(songDetails)}
        onClose={() => setSongDetails(null)}
      />

      {renderToolbar()}

      <Box>
        {results.length === 0 && (
          <Typography fontStyle="italic">Aucun résultat</Typography>
        )}

        <Box
          bgcolor="paper.background.main"
          border="solid 1px"
          borderRadius="4px"
          borderColor="paper.border"
          boxShadow="4px 4px 10px rgba(0,0,0,0.05)"
        >
          {results.map((song) => (
            <ButtonBase
              key={song.id}
              component="div"
              onClick={() => setSongDetails(song)}
              sx={{
                display: 'flex',
                p: 2,
                borderBottom: 'solid 1px',
                borderColor: 'paper.border',
              }}
            >
              <Box>
                <Typography component="span">
                  <b>{song.title}</b>
                  {song.aka ? ` (${song.aka})` : ''}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  {song.number ? ` (${song.number})` : ''}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  {song.authors || <i>Aucun auteur</i>}
                </Typography>
              </Box>
              <Box ml="auto" alignSelf="center">
                <Button
                  size="small"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => navigate(`/songs/${song.id}/edit`)}
                >
                  Édtier
                </Button>
              </Box>
            </ButtonBase>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default Songs;
