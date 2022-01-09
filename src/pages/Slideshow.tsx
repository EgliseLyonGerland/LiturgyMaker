import React, { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import BeatLoader from 'react-spinners/BeatLoader';

import RevealContainer from '../components/RevealContainer';
import SectionSlides from '../components/slides/SectionSlides';
import SongsSlides from '../components/slides/SongsSlides';
import type { LiturgyBlock, LiturgyDocument, SongDocument } from '../types';

function Slideshow() {
  const [data, setData] = useState<LiturgyDocument | null>(null);
  const [songs, setSongs] = useState<SongDocument[] | null>(null);

  useEffect(() => {
    window.opener.postMessage({ namespace: 'reveal', method: 'ready' }, '*');
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // console.log(event.data);
      if (event.data.namespace !== 'reveal') {
        return;
      }

      switch (event.data.method) {
        case 'updateLiturgy':
          setData(event.data.args[0]);
          break;
        case 'updateSongs':
          setSongs(event.data.args[0]);
          break;
        default:
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (!data) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <BeatLoader color="#DDD" />
      </Box>
    );
  }

  const renderSlides = (block: LiturgyBlock) => {
    switch (block.type) {
      case 'section':
        return <SectionSlides data={block.data} />;
      case 'songs':
        return <SongsSlides data={block.data} songs={songs || []} />;
      default:
        return null;
    }
  };

  return (
    <RevealContainer>
      <>
        {data.blocks.reduce<JSX.Element[]>((acc, block) => {
          const slides = renderSlides(block);

          if (slides === null) {
            return acc;
          }

          const result = acc.concat(slides);
          return result;
        }, [])}
      </>
    </RevealContainer>
  );
}

export default Slideshow;
