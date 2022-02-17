import React, { useEffect, useMemo, useState } from 'react';

import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  InputBase,
  Typography,
  useTheme,
} from '@mui/material';
import debounce from 'lodash/debounce';
import sortBy from 'lodash/sortBy';
import MiniSearch from 'minisearch';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';

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
  const theme = useTheme();
  const songsStatus = useAppSelector((state) => state.songs.status);
  const songs = useAppSelector(selectAllSongs);
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState<false | string>(false);
  const [results, setResults] = useState<SongDocument[]>([]);

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

  const renderSongDetails = (song: SongDocument) => {
    const details = [];

    if (song.copyright) {
      details.push(`© ${song.copyright}`);
    }
    if (song.collection) {
      details.push(song.collection);
    }
    if (song.translation) {
      details.push(`Traduit par ${song.translation}`);
    }

    if (details.length === 0) {
      return null;
    }

    return (
      <Typography component="span" color="textSecondary" variant="body2">
        {details.join(' – ')}
      </Typography>
    );
  };

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
      {renderToolbar()}

      <Box>
        {results.length === 0 && (
          <Typography fontStyle="italic">Aucun résultat</Typography>
        )}

        {results.map((song) => (
          <Accordion
            key={song.id}
            elevation={0}
            expanded={expanded === song.id}
            sx={{
              padding: theme.spacing(2, 4),

              '&:first-of-type': {
                borderTopLeftRadius: theme.spacing(0.5),
                borderTopRightRadius: theme.spacing(0.5),
                paddingTop: theme.spacing(3),
              },
              '&:last-child': {
                borderBottomLeftRadius: theme.spacing(0.5),
                borderBottomRightRadius: theme.spacing(0.5),
                paddingBottom: theme.spacing(3),
              },
              '& .MuiAccordion-expanded': {
                borderRadius: 16,
                padding: theme.spacing(4),
              },
            }}
            onChange={(event, isExpanded) => {
              setExpanded(isExpanded ? song.id : false);
            }}
          >
            <AccordionSummary
              sx={{
                padding: 0,

                '& .MuiAccordionSummary-content': {
                  margin: 0,
                },
                '& .MuiAccordionSummary-expanded': {
                  '&&': {
                    margin: 0,
                    minHeight: 'auto',
                  },
                },
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
                  component={Link}
                  to={`/songs/${song.id}/edit`}
                  size="small"
                >
                  Édtier
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0, display: 'block' }}>
              {renderSongDetails(song)}

              <Box mt={2} style={{ columnCount: 2, columnGap: 32 }}>
                {song.lyrics.length ? (
                  song.lyrics.map(({ text, type }, index) => (
                    <Box
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      whiteSpace="pre"
                      fontStyle={type === 'chorus' ? 'italic' : 'normal'}
                      mb={2}
                      style={{
                        breakInside: 'avoid',
                        pageBreakInside: 'avoid',
                      }}
                    >
                      <Typography>{text}</Typography>
                    </Box>
                  ))
                ) : (
                  <i>Aucune parole</i>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}

export default Songs;
