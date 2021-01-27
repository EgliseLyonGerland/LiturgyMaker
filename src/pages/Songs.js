import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongs } from '../redux/actions/songs';

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

const Songs = () => {
  const songs = useSelector((state) => state.songs);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (!songs.loaded) {
      dispatch(fetchSongs());
    }
  }, []);

  const renderSongDetails = (song) => {
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

  return (
    <Container maxWidth="md">
      {songs.data.map((song) => (
        <Accordion
          key={song.id}
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
            expandIcon={<ExpandMore />}
            classes={{
              root: classes.accordionSummaryRoot,
              content: classes.accordionSummaryContent,
              expanded: classes.accordionSummaryExpanded,
            }}
          >
            <div>
              <b>{song.title}</b>
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
            </div>
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
    </Container>
  );
};

export default Songs;
