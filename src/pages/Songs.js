import React, { useEffect } from 'react';
import { Box, Container, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongs } from '../redux/actions/songs';

const Songs = () => {
  const songs = useSelector((state) => state.songs);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!songs.loaded) {
      dispatch(fetchSongs());
    }
  }, []);

  return (
    <Container maxWidth="md">
      <Box bgcolor="background.paper" borderRadius={16} py={2}>
        {songs.data.map((song, index) => (
          <Box
            key={song.id}
            height={72}
            px={4}
            display="flex"
            alignItems="center"
            borderBottom={
              index < songs.data.length - 1
                ? '1px solid rgb(255, 255, 255, 0.1)'
                : 'none'
            }
          >
            <div>
              <Typography>
                <b>{song.title}</b>
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {song.authors || <i>Aucun auteur</i>}
              </Typography>
            </div>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Songs;
