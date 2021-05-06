import find from 'lodash/find';
import { documentWidth, documentHeight } from '../../config/preview';
import { SongDocument, SongsBlockData } from '../../types';
import { PreviewGenerateFunction } from '../preview';

const generate: PreviewGenerateFunction<SongsBlockData, SongDocument> = (
  ctx,
  block,
  currentFieldPath = ['items', 0, 'title'],
  songs,
) => {
  const { data } = block;
  const songIndex = Math.min(currentFieldPath?.[1] || 0, data.items.length - 1);
  const songData = data.items[songIndex];

  if (!songData || songData.id === null) {
    return;
  }

  const song = find(songs, ['id', songData.id]);

  if (!song) {
    return;
  }

  ctx.setFont('songTitle');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(song.title, documentWidth / 2, documentHeight / 2);
};

export default generate;
