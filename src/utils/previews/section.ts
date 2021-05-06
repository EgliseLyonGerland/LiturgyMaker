import { documentWidth, documentHeight } from '../../config/preview';
import { SectionBlockData } from '../../types';
import { PreviewGenerateFunction } from '../preview';

const generate: PreviewGenerateFunction<SectionBlockData> = (ctx, block) => {
  const {
    data: { title = 'Lorem Ipsum' },
  } = block;

  const margin = 60;

  ctx.setFont('chapterTitle');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const titleHeight = ctx.getCurrentLineHeight();
  const titleX = documentWidth / 2;
  const titleY = (documentHeight - titleHeight - margin) / 2;
  ctx.fillText(title, titleX, titleY);

  const lineX = documentWidth / 2;
  const lineY = titleY + titleHeight + margin;
  ctx.fillSeparator(lineX, lineY, true);
};

export default generate;
