import { documentWidth, documentHeight } from '../../config/preview';
import type { SermonBlockData } from '../../types';
import { parse } from '../bibleRef';
import type { PreviewGenerateFunction } from '../preview';
import generateSection from './section';

const documentHalfWidth = documentWidth / 2;

const generate: PreviewGenerateFunction<SermonBlockData> = (ctx, block) => {
  const {
    data: { title, author, bibleRefs },
  } = block;

  const [bibleRef] = bibleRefs || [];
  const ref = parse(bibleRef.ref);

  if (!ref) {
    generateSection(ctx, { ...block, data: { title: 'Prédication' } });
    return;
  }

  ctx.setFont('chapterTitle', { fontSize: 60 });
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Prédication', documentHalfWidth, 150);
  ctx.fillSeparator(
    documentHalfWidth,
    150 + ctx.getCurrentLineHeight() + 32,
    true,
    'center',
    500,
  );

  let finalTitle;
  if (title) finalTitle = title;
  else finalTitle = `${ref.book} ${ref.chapterStart}`;

  ctx.setFont('sermonTitle');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const { height: titleHeight } = ctx.measureMultiligneText(finalTitle, 700);
  ctx.fillMultilineText(
    `« ${finalTitle} »`,
    documentHalfWidth,
    (documentHeight - titleHeight) / 2,
    700,
  );

  ctx.setFont('sermonBibleRef');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(bibleRef.ref, documentHalfWidth, 800);
  const bibleRefHeight = ctx.getCurrentLineHeight();

  ctx.setFont('sermonAuthor');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(author, documentHalfWidth, 800 + bibleRefHeight);
};

export default generate;
