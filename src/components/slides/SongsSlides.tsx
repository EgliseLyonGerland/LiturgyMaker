import { find } from 'lodash'
import type { CSSProperties } from 'react'

import type { SongDocument, SongsBlockData } from '../../types'

interface Props {
  data: SongsBlockData
  songs: SongDocument[]
}

function generateKey(...items: (string | number)[]) {
  return items.join('.')
}

function renderLyricsPart(
  song: SongDocument,
  partIndex: number,
  baseKey: string,
  position: 'first' | 'prev' | 'current' | 'next' | 'nextnext',
): JSX.Element {
  const style: Record<typeof position, CSSProperties> = {
    first: { top: partIndex ? '150%' : '50%', opacity: 0 },
    prev: { marginTop: '-50vh', opacity: 0 },
    current: { marginTop: 50, opacity: 1 },
    next: { top: '100%', marginTop: -250, opacity: 0.2 },
    nextnext: { top: '150%', opacity: 0 },
  }

  const text = song.lyrics[partIndex]?.text || ''

  return (
    <p
      data-hey={generateKey(baseKey, 'lyrics', partIndex, position)}
      key={generateKey(baseKey, 'lyrics', partIndex, position)}
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
      {`${text}\n${' '.repeat(Math.max(0, partIndex))}`}
    </p>
  )
}

function SongsSlides({ data, songs }: Props) {
  return (
    <>
      {data.items.reduce<JSX.Element[]>((acc, item, songIndex) => {
        const song = find(songs, ['id', item.id])

        if (!song) {
          return acc
        }

        const baseKey = generateKey(songIndex)

        acc.push(
          <section data-auto-animate key={generateKey(songIndex, 'title')}>
            <p>{song.title}</p>
            <p>{song.authors}</p>

            {renderLyricsPart(song, 0, baseKey, 'first')}
            {renderLyricsPart(song, 1, baseKey, 'first')}
          </section>,
        )

        acc.push(
          ...song.lyrics.map((part, partIndex) => {
            return (
              <section
                data-auto-animate
                key={generateKey(baseKey, 'lyrics', partIndex)}
              >
                {renderLyricsPart(song, partIndex - 1, baseKey, 'prev')}
                {renderLyricsPart(song, partIndex, baseKey, 'current')}
                {renderLyricsPart(song, partIndex + 1, baseKey, 'next')}
                {renderLyricsPart(song, partIndex + 2, baseKey, 'nextnext')}
              </section>
            )
          }),
        )

        return acc
      }, [])}
    </>
  )
}

export default SongsSlides
