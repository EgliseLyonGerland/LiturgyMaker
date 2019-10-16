import { documentWidth, documentHeight } from '../../config/preview';
import { parse } from '../bibleRef';

function generateVerseVertical(ctx, ref, excerpt, direction, align) {
  const margin = 80;
  const maxContentWidth = documentWidth - 400;

  ctx.setFont('verseTitle');
  const titleHeight = ctx.getCurrentLineHeight();

  ctx.setFont('verseExcerpt');
  const { height: excerptHeight } = ctx.measureMultiligneText(
    excerpt,
    maxContentWidth,
  );

  const totalHeight = titleHeight + excerptHeight + margin * 2;
  const y = (documentHeight - totalHeight) / 2;

  ctx.save();

  if (align === 'left') {
    ctx.translate(-maxContentWidth / 2, 0);
  } else if (align === 'right') {
    ctx.translate(maxContentWidth / 2, 0);
  }

  // Display title
  ctx.setFont('verseTitle');
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';

  let titleY = y + titleHeight / 2;
  if (direction === 'bottomTop') {
    titleY += margin * 2 + excerptHeight;
  }

  ctx.fillText(ref, documentWidth / 2, titleY);

  // Display line
  let lineY = y + titleHeight + margin;
  if (direction === 'bottomTop') {
    lineY = y + excerptHeight + margin;
  }

  ctx.fillSeparator(documentWidth / 2, lineY, true, align);

  // Display exerpt
  ctx.setFont('verseExcerpt');
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';

  let excerptY = y + titleHeight / 2;
  if (direction === 'topBottom') {
    excerptY = y + titleHeight * 1.5 + margin * 2;
  }

  ctx.fillMultilineText(excerpt, documentWidth / 2, excerptY, maxContentWidth);

  ctx.restore();
}

function generateVerseHorizontal(ctx, ref, excerpt, direction, align) {
  const margin = 80;
  const padding = 200;
  const maxContentWidth = documentWidth - padding * 2;

  const parsedRef = parse(ref) || {};
  const {
    book = '',
    chapterStart = '',
    verseStart = '',
    verseEnd = '',
  } = parsedRef;
  const title = `${book} ${chapterStart}`;

  let subtitle = '';
  if (verseEnd) {
    subtitle = `• ${verseStart}–${verseEnd}`;
  } else if (verseStart) {
    subtitle = `v. ${verseStart}`;
  }

  ctx.setFont('verseTitle');
  const { width: titleWidth } = ctx.measureText(title);

  ctx.setFont('verseSubtitle');
  const { width: subtitleWidth } = ctx.measureText(subtitle);

  const headerWidth = Math.max(titleWidth, subtitleWidth);
  const maxExcerptWidth = maxContentWidth - headerWidth - margin * 2;

  ctx.setFont('verseExcerpt');
  const { height: excerptHeight } = ctx.measureMultiligneText(
    excerpt,
    maxExcerptWidth,
  );

  // Display title
  ctx.save();
  ctx.setFont('verseTitle');
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  if (subtitle) {
    ctx.translate(0, -ctx.getCurrentLineHeight() / 2);
  }

  let titleX = padding;
  if (direction === 'rightLeft') {
    titleX += margin * 2 + maxExcerptWidth;
  }

  ctx.fillText(title, titleX, documentHeight / 2);

  // Display subtitle
  ctx.setFont('verseSubtitle');
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    subtitle,
    titleX,
    documentHeight / 2 + ctx.getCurrentLineHeight(),
  );
  ctx.restore();

  // Display seperator
  let seperatorX = padding + headerWidth + margin;
  if (direction === 'rightLeft') {
    seperatorX = padding + maxExcerptWidth + margin;
  }

  ctx.fillSeparator(seperatorX, documentHeight / 2, false, align);

  // Display exerpt
  ctx.setFont('verseExcerpt');
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';

  const exerptY =
    (documentHeight - excerptHeight) / 2 + ctx.getCurrentLineHeight();
  let excerptX = padding;
  if (direction === 'leftRight') {
    excerptX += headerWidth + margin * 2;
  }

  ctx.fillMultilineText(excerpt, excerptX, exerptY, maxExcerptWidth);
}

function generateVerseTopBottomLeft(ctx, ref, excerpt) {
  generateVerseVertical(ctx, ref, excerpt, 'topBottom', 'left');
}

function generateVerseTopBottomCenter(ctx, ref, excerpt) {
  generateVerseVertical(ctx, ref, excerpt, 'topBottom', 'center');
}

function generateVerseTopBottomRight(ctx, ref, excerpt) {
  generateVerseVertical(ctx, ref, excerpt, 'topBottom', 'right');
}

function generateVerseBottomTopLeft(ctx, ref, excerpt) {
  generateVerseVertical(ctx, ref, excerpt, 'bottomTop', 'left');
}

function generateVerseBottomTopCenter(ctx, ref, excerpt) {
  generateVerseVertical(ctx, ref, excerpt, 'bottomTop', 'center');
}

function generateVerseBottomTopRight(ctx, ref, excerpt) {
  generateVerseVertical(ctx, ref, excerpt, 'bottomTop', 'right');
}

function generateVerseLeftRightCenter(ctx, ref, excerpt) {
  generateVerseHorizontal(ctx, ref, excerpt, 'leftRight', 'center');
}
function generateVerseRightLeftCenter(ctx, ref, excerpt) {
  generateVerseHorizontal(ctx, ref, excerpt, 'rightLeft', 'center');
}

const verseGenerators = {
  topBottomLeft: generateVerseTopBottomLeft,
  topBottomCenter: generateVerseTopBottomCenter,
  topBottomRight: generateVerseTopBottomRight,
  bottomTopLeft: generateVerseBottomTopLeft,
  bottomTopCenter: generateVerseBottomTopCenter,
  bottomTopRight: generateVerseBottomTopRight,
  leftRightCenter: generateVerseLeftRightCenter,
  rightLeftCenter: generateVerseRightLeftCenter,
};

export default function generate(
  ctx,
  block,
  currentFieldPath = ['bibleRefs', 0],
) {
  const {
    data: { bibleRefs = [] },
  } = block;

  if (!bibleRefs.length) {
    return;
  }

  const bibleRefIndex = Math.min(currentFieldPath[1], bibleRefs.length - 1);
  const { template = 'topBottomCenter' } = bibleRefs[bibleRefIndex];
  let { ref, excerpt } = bibleRefs[bibleRefIndex];

  ref = ref || 'Lorem ipsum 1.2-3';
  excerpt =
    excerpt ||
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id dictum lectus.';

  if (verseGenerators[template]) {
    verseGenerators[template](ctx, ref, `“ ${excerpt.trim()} ”`);
  }

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 10]);

  ctx.beginPath();
  ctx.moveTo(0, 150);
  ctx.lineTo(documentWidth, 150);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(0, documentHeight - 150);
  ctx.lineTo(documentWidth, documentHeight - 150);
  ctx.stroke();
  ctx.closePath();
}
