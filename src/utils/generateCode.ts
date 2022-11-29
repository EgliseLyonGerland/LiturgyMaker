import find from 'lodash/find';

import type {
  LiturgyDocument,
  LiturgyBlock,
  RecitationDocument,
  SongDocument,
  BlockType,
  SongsItem,
} from '../types';

const isEmpty: {
  [K in BlockType]?: (block: LiturgyBlock<K>) => boolean;
} = {
  openDoors: (block) => {
    return block.data.title.trim() === '';
  },
};

function getSong(data: SongsItem, songs: SongDocument[]) {
  const song = find(songs, ['id', data.id])!;

  return { ...song, lyrics: data.lyrics || song.lyrics };
}

export default function generateCode(
  doc: LiturgyDocument,
  {
    songs,
    recitations,
  }: { songs: SongDocument[]; recitations: RecitationDocument[] },
) {
  const result = doc.blocks.reduce<{ type: string; data: any }[]>(
    (acc, block) => {
      if (block.type === 'openDoors' && isEmpty.openDoors?.(block)) {
        return acc;
      }

      if (block.type === 'songs') {
        return acc.concat(
          block.data.items.map((data) => ({
            type: 'song',
            data: { ...data, ...getSong(data, songs) },
          })),
        );
      }

      if (block.type === 'recitation') {
        return acc.concat([
          {
            type: 'recitation',
            data: find(recitations, ['id', block.data.id]),
          },
        ]);
      }

      if (block.type === 'reading') {
        return acc.concat(
          block.data.bibleRefs.map((data) => ({
            type: 'verse',
            data,
          })),
        );
      }

      return acc.concat([{ type: block.type, data: block.data }]);
    },
    [],
  );

  return JSON.stringify(result, null, '  ');
}
