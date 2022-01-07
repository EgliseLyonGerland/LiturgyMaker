import React, { useEffect, useState } from 'react';

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
  makeStyles,
  Typography,
} from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import debounce from 'lodash/debounce';
import deburr from 'lodash/deburr';
import sortBy from 'lodash/sortBy';
import MiniSearch from 'minisearch';
import { Link } from 'react-router-dom';

import { fetchSongs, selectAllSongs } from '../redux/slices/songs';
import { useAppDispatch, useAppSelector } from '../redux/store';
import type { SongDocument } from '../types';

type SongSearchDocument = Pick<SongDocument, 'id' | 'title' | 'authors'> & {
  lyrics: string;
};

const useStyles = makeStyles((theme) => ({
  accordionRoot: {
    padding: theme.spacing(2, 4),

    '&:first-child': {
      borderTopLeftRadius: theme.spacing(2),
      borderTopRightRadius: theme.spacing(2),
      paddingTop: theme.spacing(3),
    },

    '&:last-child': {
      borderBottomLeftRadius: theme.spacing(2),
      borderBottomRightRadius: theme.spacing(2),
      paddingBottom: theme.spacing(3),
    },
  },
  accordionExpanded: {
    borderRadius: 16,
    padding: theme.spacing(4),
  },
  accordionSummaryRoot: {
    padding: 0,
  },
  accordionSummaryContent: {
    margin: 0,
  },
  accordionSummaryExpanded: {
    '&&': {
      margin: 0,
      minHeight: 'auto',
    },
  },
  accordionDetailsRoot: {
    padding: 0,
    display: 'block',
  },
}));

function escape(str: string) {
  return deburr(str).toLocaleLowerCase();
}

function createSearch(songs: SongDocument[]) {
  const search = new MiniSearch<SongSearchDocument>({
    fields: ['title', 'authors', 'lyrics'],
    processTerm: escape,
    searchOptions: {
      processTerm: escape,
    },
  });

  search.addAll(
    songs.map(({ id, title, authors, lyrics }) => ({
      id,
      title,
      authors,
      lyrics: lyrics.map((part) => part.text).join(' '),
    })),
  );

  return search;
}

function Songs() {
  const songsStatus = useAppSelector((state) => state.songs.status);
  const songs = useAppSelector(selectAllSongs);
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState<false | string>(false);
  const [query, setQuery] = useState('');
  const [searchInLyrics, setSearchInLyrics] = useState(true);
  const [search, setSearch] = useState(createSearch(songs));
  const classes = useStyles();

  const handleSearchChange = debounce((event) => {
    setQuery(event.target.value);
  }, 200);

  useEffect(() => {
    if (songsStatus === 'idle') {
      dispatch(fetchSongs());
    }
  }, [dispatch, songsStatus]);

  useEffect(() => {
    if (songsStatus === 'success') {
      setSearch(createSearch(songs));
    }
  }, [searchInLyrics, songs, songsStatus]);

  let filteredSongs = songs;

  if (query) {
    const results = search
      .search(query, {
        prefix: true,
        fields: ['title', 'authors'].concat(searchInLyrics ? ['lyrics'] : []),
      })
      .map(({ id }) => id);

    filteredSongs = filteredSongs.filter((song) => results.includes(song.id));
  }

  filteredSongs = sortBy(filteredSongs, 'title');

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
    <Box mb={3} display="flex">
      <Box
        bgcolor="tertiary.dark"
        border="sold 1px rgba(255,255,255,0.1)"
        borderRadius={4}
        width={200}
        mr={2}
        px={2}
        py={0.5}
      >
        <InputBase
          placeholder="Recherche"
          fullWidth
          onChange={handleSearchChange}
        />
      </Box>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={searchInLyrics}
              icon={<CheckBoxOutlineBlank fontSize="small" />}
              checkedIcon={<CheckBox fontSize="small" />}
              onChange={() => setSearchInLyrics(!searchInLyrics)}
            />
          }
          label="Rechercher dans les paroles"
        />
      </FormGroup>
    </Box>
  );

  return (
    <Container maxWidth="md">
      {renderToolbar()}

      <div>
        {filteredSongs.map((song) => (
          <Accordion
            key={song.id}
            elevation={0}
            expanded={expanded === song.id}
            classes={{
              root: classes.accordionRoot,
              expanded: classes.accordionExpanded,
            }}
            onChange={(event, isExpanded) => {
              setExpanded(isExpanded ? song.id : false);
            }}
          >
            <AccordionSummary
              classes={{
                root: classes.accordionSummaryRoot,
                content: classes.accordionSummaryContent,
                expanded: classes.accordionSummaryExpanded,
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
            <AccordionDetails
              classes={{
                root: classes.accordionDetailsRoot,
              }}
            >
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
      </div>
    </Container>
  );
}

export default Songs;
