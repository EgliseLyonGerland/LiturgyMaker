import find from 'lodash/find';
import { documentWidth, documentHeight } from '../../config/preview';
import { RecitationBlockData, RecitationDocument } from '../../types';
import { PreviewGenerateFunction } from '../preview';

const generate: PreviewGenerateFunction<
  RecitationBlockData,
  RecitationDocument
> = (ctx, block, currentFieldPath, recitations) => {
  const { data } = block;

  if (!data || !data.id) {
    return;
  }

  const recitation = find(recitations, ['id', data.id]);

  if (!recitation) {
    return;
  }

  ctx.setFont('songTitle');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(recitation.title, documentWidth / 2, documentHeight / 2);
};

export default generate;
