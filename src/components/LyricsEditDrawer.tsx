import React, { useEffect } from 'react';

import { Box, Button, Drawer, Paper } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';

import type { SongDocument } from '../types';
import LyricsField from './fields/LyricsField';

interface Props {
  open: boolean;
  lyrics: SongDocument['lyrics'];
  onChange: (lyrics: SongDocument['lyrics']) => void;
  onClose: () => void;
}

const widthProps = {
  maxWidth: 600,
  width: '90vw',
};

const actionAreaHeight = 11;

function LyricsEditDrawer({ open, lyrics, onChange, onClose }: Props) {
  const form = useForm<{ lyrics: SongDocument['lyrics'] }>({
    defaultValues: { lyrics },
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    reset({ lyrics });
  }, [lyrics, reset]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ ...widthProps, pb: actionAreaHeight + 2 }}>
        <FormProvider {...form}>
          <Box p={5} px={8}>
            <LyricsField name="lyrics" disabled={false} />
          </Box>
        </FormProvider>
      </Box>

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
        <Button variant="outlined" onClick={() => onClose()} sx={{ mr: 1 }}>
          Annuler
        </Button>
        <Button
          variant="contained"
          color="info"
          disabled={!isDirty}
          onClick={handleSubmit((data) => {
            onChange(data.lyrics);
          })}
        >
          Enregistrer
        </Button>
      </Paper>
    </Drawer>
  );
}

export default LyricsEditDrawer;
