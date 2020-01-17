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

  if (!songData || songData.id === null || !songs[songData.id]) {
    return;
  }

  const { title } = songs[songData.id];

  ctx.setFont('songTitle');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, documentWidth / 2, documentHeight / 2);
}
