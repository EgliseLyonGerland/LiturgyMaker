import React, { useState } from 'react';

import { Drawer, Typography, Box, Button, Paper } from '@mui/material';

import type { SongDocument } from '../types';
import LyricsEditDrawer from './LyricsEditDrawer';

interface Props {
  data: SongDocument | null;
  open: boolean;
  editable?: boolean;
  onClose: () => void;
  onLyricsChanged?: (lyrics: SongDocument['lyrics']) => void;
}

const widthProps = {
  maxWidth: 450,
  width: '90vw',
};

const actionAreaHeight = 11;

function SongDetailsDrawer({
  data,
  open,
  editable = false,
  onClose,
  onLyricsChanged = () => {},
}: Props) {
  const [editing, setEditing] = useState(false);

  const renderLyrics = () => {
    if (!data?.lyrics.length) {
      return <Box sx={{ fontStyle: 'italic' }}>Aucune parole</Box>;
    }

    return (
      <>
        {data.lyrics.map(({ text, type }, index) => (
          <Box key={index} mb={2}>
            <Typography
              component="div"
              sx={{
                whiteSpace: 'pre',
                ...(type === 'chorus'
                  ? {
                      fontStyle: 'italic',
                      fontFamily: 'Adobe Hebrew',
                    }
                  : {}),
              }}
            >
              {text.split('\n').map((line, lineIndex) => (
                <div key={lineIndex}>{line}</div>
              ))}
            </Typography>
          </Box>
        ))}
      </>
    );
  };

  const renderContent = () => {
    if (!data) {
      return null;
    }

    return (
      <>
        <Box mb={4}>
          <Typography component="span" fontSize="1.2em">
            <b>{data.title}</b>
            {data.aka ? ` (${data.aka})` : ''}
          </Typography>
          <Typography color="textSecondary" component="span">
            {data.number ? ` (${data.number})` : ''}
          </Typography>
          <Typography color="textSecondary" variant="body2" mt={1}>
            {data.authors || <i>Aucun auteur</i>}
          </Typography>
        </Box>

        {data.previewUrl && (
          <Box mb={4}>
            <iframe
              title={`${data.title} preview`}
              frameBorder="0"
              width="100%"
              height="140"
              src={data.previewUrl.replace('/view', '/preview')}
            />
          </Box>
        )}

        {renderLyrics()}
      </>
    );
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ ...widthProps, p: 2, pb: actionAreaHeight + 2 }}>
        {renderContent()}
      </Box>

      {editable && (
        <Paper
          elevation={8}
          square
          sx={{
            ...widthProps,
            position: 'fixed',
            right: 0,
            bottom: 0,
            height: actionAreaHeight * 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            color="info"
            onClick={() => setEditing(true)}
          >
            Modifier les paroles pour ce culte
          </Button>
        </Paper>
      )}

      {data && editable && (
        <LyricsEditDrawer
          open={editing}
          lyrics={data?.lyrics}
          onChange={(lyrics) => {
            onLyricsChanged(lyrics);
            setEditing(false);
          }}
          onClose={() => setEditing(false)}
        />
      )}
    </Drawer>
  );
}

export default SongDetailsDrawer;
