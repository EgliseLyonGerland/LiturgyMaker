import { cloneDeep } from 'lodash';
import find from 'lodash/find';

import type {
  LiturgyDocument,
  RecitationDocument,
  SongDocument,
} from '../types';

export default function generateCode(
  doc: LiturgyDocument,
  {
    songs,
    recitations,
  }: { songs: SongDocument[]; recitations: RecitationDocument[] },
) {
  const result = doc.blocks.map((block) => {
    const data: any = cloneDeep(block.data);

    if (block.type === 'songs') {
      const items = block.data.items.map((item) => {
        const song = find(songs, ['id', item.id]);

        return { ...item, song };
      });

      data.items = items;
    }

    if (block.type === 'recitation') {
      const recitation = find(recitations, ['id', block.data.id]);

      data.recitation = recitation;
    }

    return { type: block.type, data };
  });

  return JSON.stringify(result, null, '  ');
}
