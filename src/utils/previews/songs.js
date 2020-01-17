import find from 'lodash/find';
import { documentWidth, documentHeight } from '../../config/preview';

export default function generate(
  ctx,
  block,
  currentFieldPath = [0, 'title'],
  songs,
) {
  const { data = [] } = block;
  const songIndex = Math.min(currentFieldPath[0], data.length - 1);
  const songData = data[songIndex];

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
}
