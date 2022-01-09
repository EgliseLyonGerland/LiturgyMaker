import React, { useState } from 'react';

import { Box, Pagination } from '@mui/material';
import { useSelector } from 'react-redux';

import { selectAllSongs } from '../redux/slices/songs';
import type { LiturgyBlock } from '../types';
import RevealContainer from './RevealContainer';
import SectionSlides from './slides/SectionSlides';
import SongsSlides from './slides/SongsSlides';

interface Props {
  block: LiturgyBlock;
}

function Preview({ block }: Props) {
  const [count, setCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const songs = useSelector(selectAllSongs);

  const renderSlides = () => {
    switch (block.type) {
      case 'section':
        return <SectionSlides data={block.data} />;
      case 'songs':
        return <SongsSlides data={block.data} songs={songs} />;
      default:
        return null;
    }
  };

  const slides = renderSlides();

  if (slides === null) {
    return null;
  }

  return (
    <Box sx={{ position: 'sticky', top: 92 }}>
      <RevealContainer
        currentSlide={currentSlide}
        onCountChanged={setCount}
        embedded
      >
        {slides}
      </RevealContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        {count && (
          <Pagination
            count={count}
            page={currentSlide}
            siblingCount={0}
            onChange={(event, value) => {
              setCurrentSlide(value);
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default Preview;
