import React from 'react';

import { Drawer, Typography, Box, Portal } from '@mui/material';

import type { SongDocument } from '../types';

interface Props {
  data: SongDocument | null;
  open: boolean;
  onClose: () => void;
}

function SongDetails({ data, open, onClose }: Props) {
  return (
    <Portal>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ maxWidth: 450, width: '90vw', p: 2 }}>
          {data && (
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

              {data.lyrics.length ? (
                data.lyrics.map(({ text, type }, index) => (
                  <Box
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    mb={2}
                  >
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
                      {text.split('\n').map((line) => (
                        <div key={line}>{line}</div>
                      ))}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box sx={{ fontStyle: 'italic' }}>Aucune parole</Box>
              )}
            </>
          )}
        </Box>
      </Drawer>
    </Portal>
  );
}

export default SongDetails;
