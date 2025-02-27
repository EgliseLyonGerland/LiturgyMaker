import find from 'lodash/find'

import type {
  BlockType,
  LiturgyBlocks,
  LiturgyDocument,
  RecitationDocument,
  SongDocument,
  SongsItem,
} from '../types'
import { converToDate } from './liturgy'

const isEmpty: {
  [K in BlockType]?: (block: LiturgyBlocks[K]) => boolean;
} = {
  openDoors: (block) => {
    return block.data.title.trim() === ''
  },
}

function getSong(data: SongsItem, songs: SongDocument[]) {
  const song = find(songs, ['id', data.id])

  if (!song) {
    return null
  }

  return { ...song, lyrics: data.lyrics || song.lyrics }
}

export default function generateCode(
  doc: LiturgyDocument,
  {
    songs,
    recitations,
  }: { songs: SongDocument[], recitations: RecitationDocument[] },
) {
  const slides = doc.blocks.reduce<unknown[]>((acc, block) => {
    const { type } = block

    // @ts-expect-error This error sucks!
    if (type in isEmpty && isEmpty?.[type]?.(block)) {
      return acc
    }

    if (type === 'songs') {
      return acc.concat(
        block.data.items.map(data => ({
          type: 'song',
          data: { ...data, ...getSong(data, songs) },
        })),
      )
    }

    if (type === 'recitation') {
      return acc.concat({
        type: 'recitation',
        data: find(recitations, ['id', block.data.id]),
      })
    }

    if (type === 'reading') {
      return acc.concat(
        block.data.bibleRefs.map(data => ({
          type: 'verse',
          data,
        })),
      )
    }

    return acc.concat(block)
  }, [])

  return JSON.stringify({
    date: converToDate(doc.id),
    slides,
  }, null, '  ')
}
