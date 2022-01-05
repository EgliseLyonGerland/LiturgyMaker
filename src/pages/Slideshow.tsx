import React, { useEffect, useRef, useState } from 'react';

import { Box } from '@material-ui/core';
import { find } from 'lodash';
import BeatLoader from 'react-spinners/BeatLoader';
import Reveal from 'reveal.js';

import 'reveal.js/dist/reset.css';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import type { LiturgyDocument, SongDocument } from '../types';

function generateKey(...items: (string | number)[]) {
  return items.join('.');
}

function renderLyricsPart(
  song: SongDocument,
  partIndex: number,
  baseKey: string,
  position: 'first' | 'prev' | 'current' | 'next' | 'nextnext',
): JSX.Element {
  const style: Record<typeof position, {}> = {
    first: { top: partIndex ? '150%' : '50%', opacity: 0 },
    prev: { marginTop: '-50vh', opacity: 0 },
    current: { marginTop: 50, opacity: 1 },
    next: { top: '100%', marginTop: -250, opacity: 0.2 },
    nextnext: { top: '150%', opacity: 0 },
  };

  const text = song.lyrics[partIndex]?.text || '';

  return (
    <p
      key={generateKey(baseKey, 'lyrics', partIndex, position)}
      data-hey={generateKey(baseKey, 'lyrics', partIndex, position)}
      style={{
        position: 'absolute',
        top: 0,
        width: '100%',
        textAlign: 'center',
        fontSize: 70,
        whiteSpace: 'pre',
        ...style[position],
      }}
    >
      {text + '\n' + ' '.repeat(Math.max(0, partIndex))}
    </p>
  );
}

function Slideshow() {
  const [data, setData] = useState<LiturgyDocument | null>(null);
  const [songs, setSongs] = useState<SongDocument[] | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const deckRef = useRef<any>(null);

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

  useEffect(() => {
    if (wrapperRef.current === null || deckRef.current !== null) {
      return;
    }

    deckRef.current = new Reveal(wrapperRef.current, {
      width: 1920,
      height: 1080,
      // embedded: true,
      controls: true,
      progress: false,
      // center: false,
      transition: 'none',
      margin: 0,
    });
    deckRef.current.initialize();
  }, [wrapperRef, data, songs]);

  useEffect(() => {
    if (deckRef.current) {
      deckRef.current.layout();
    }
  }, [deckRef, data, songs]);

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

  return (
    <div ref={wrapperRef} className="reveal">
      <div className="slides">
        {data.blocks.reduce<JSX.Element[]>((acc, block, blockIndex) => {
          switch (block.type) {
            case 'reading':
              acc = acc.concat(
                block.data.bibleRefs.map((item, itemIndex) => (
                  <section key={`${blockIndex}.${itemIndex}`}>
                    {item.ref}
                  </section>
                )) || [],
              );
              break;

            case 'songs':
              block.data.items.forEach((item, songIndex) => {
                const song = find(songs, ['id', item.id]);
                // console.log(song);

                if (!song) {
                  return;
                }

                const baseKey = generateKey(blockIndex, songIndex);

                acc.push(
                  <section
                    key={generateKey(blockIndex, songIndex, 'title')}
                    data-auto-animate
                  >
                    <p>{song.title}</p>
                    <p>{song.authors}</p>

                    {renderLyricsPart(song, 0, baseKey, 'first')}
                    {renderLyricsPart(song, 1, baseKey, 'first')}
                  </section>,
                );

                acc.push(
                  ...song.lyrics.map((part, partIndex) => {
                    return (
                      <section
                        key={generateKey(baseKey, 'lyrics', partIndex)}
                        data-auto-animate
                      >
                        {renderLyricsPart(song, partIndex - 1, baseKey, 'prev')}
                        {renderLyricsPart(song, partIndex, baseKey, 'current')}
                        {renderLyricsPart(song, partIndex + 1, baseKey, 'next')}
                        {renderLyricsPart(
                          song,
                          partIndex + 2,
                          baseKey,
                          'nextnext',
                        )}
                      </section>
                    );
                  }),
                );
              });
              break;

            default:
          }

          return acc;
        }, [])}
      </div>
    </div>
  );
}

export default Slideshow;
