import chunk from 'lodash/chunk';

import { documentWidth, documentHeight } from '../../config/preview';
import type { AnnouncementsBlockData } from '../../types';
import type { PreviewGenerateFunction } from '../preview';

const defaultTitle = 'Lorem ipsum';
const defaultDetail =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

const generate: PreviewGenerateFunction<AnnouncementsBlockData> = (
  ctx,
  block,
  currentFieldPath = ['items', 0, 'title'],
) => {
  const itemIndex = currentFieldPath?.[1] || 0;
  const chunks = chunk(block.data.items, 6);
  const chunkIndex = Math.floor(itemIndex / 6);

  let items = chunks[Math.min(chunkIndex, chunks.length - 1)];
  items = items.map(({ title, detail }) => ({
    title: title || defaultTitle,
    detail: detail || defaultDetail,
  }));

  const contentWidth = documentWidth - 200;
  const contentHeight = documentHeight - 430;
  const contentPositionY = documentHeight - contentHeight - 100;
  const margin = 80;

  // Title
  ctx.setFont('title');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Annonces', documentWidth / 2, 90);

  if (chunks.length > 1) {
    const page = `(${chunkIndex + 1}/${chunks.length})`;

    ctx.setFont('announcementPage');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(page, documentWidth / 2, 190);
  }

  // Line
  const lineX = documentWidth / 2;
  const lineY = contentHeight / 2 + contentPositionY;
  ctx.fillSeparator(lineX, lineY);

  const itemWidth = (contentWidth - margin * 2) / 2;
  const leftPartX = (documentWidth - contentWidth) / 2;
  const rightPartX = leftPartX + itemWidth + margin * 2;

  // Items
  let currentY = contentPositionY;
  items.forEach((item, index) => {
    const x = index / 3 < 1 ? leftPartX : rightPartX;
    const y = currentY;

    ctx.setFont('announcementItemTitle');
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const titleHeight = ctx.fillMultilineText(item.title, x, y, itemWidth);

    ctx.setFont('announcementItemDetail');
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const detailHeight = ctx.fillMultilineText(
      item.detail,
      x,
      y + titleHeight,
      itemWidth,
    );

    if (index === 2) {
      currentY = contentPositionY;
    } else {
      currentY += titleHeight + detailHeight + 60;
    }
  });
};

export default generate;
