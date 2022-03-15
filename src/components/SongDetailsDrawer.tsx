import React, { useState } from 'react';

import { Drawer, Typography, Box, Button, Paper, Alert } from '@mui/material';

import type { SongDocument } from '../types';
import LyricsEditDrawer from './LyricsEditDrawer';
import SongPreview from './SongPreview';

interface Props {
  data: SongDocument | null;
  open: boolean;
  editable?: boolean;
  overridedLyrics?: SongDocument['lyrics'] | null;
  onClose: () => void;
  onLyricsChanged?: (lyrics: SongDocument['lyrics'] | null) => void;
}

const widthProps = {
  maxWidth: 600,
  width: '90vw',
};

const actionAreaHeight = 11;

function SongDetailsDrawer({
  data,
  open,
  editable = false,
  overridedLyrics = null,
  onClose,
  onLyricsChanged = () => {},
}: Props) {
  const [editing, setEditing] = useState(false);

  const lyrics: SongDocument['lyrics'] = overridedLyrics || data?.lyrics || [];

  const renderLyrics = () => {
    if (!lyrics.length) {
      return <Box sx={{ fontStyle: 'italic' }}>Aucune parole</Box>;
    }

    return (
      <>
        {overridedLyrics && (
          <Alert
            severity="warning"
            variant="outlined"
            sx={{ my: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  onLyricsChanged(null);
                }}
              >
                Rétablir
              </Button>
            }
          >
            Les paroles qui s‘affichent ci-dessous correspondent à la version
            modifiée.
          </Alert>
        )}

        {lyrics.map(({ text, type }, index) => (
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
            <SongPreview title={data.title} url={data.previewUrl} />
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
          lyrics={lyrics}
          onChange={(newLyrics) => {
            onLyricsChanged(newLyrics);
            setEditing(false);
          }}
          onClose={() => setEditing(false)}
        />
      )}
    </Drawer>
  );
}

export default SongDetailsDrawer;
