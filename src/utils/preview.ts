import { typography } from '../config/preview';
import { LiturgyBlock, RecitationDocument, SongDocument } from '../types';

export type FieldPath = [string] | [string, number] | [string, number, string];

export type PreviewGenerateFunction<
  T,
  U = SongDocument | RecitationDocument,
> = (
  ctx: CanvasRenderingContext2D,
  block: LiturgyBlock<T>,
  currentFieldPath?: FieldPath,
  data?: U[] | undefined,
) => void;

const lineHeight = 1.3;

function getWords(text: string) {
  let words = text.split(' ');

  if (words.length < 3) {
    return words;
  }

  words = words.reduce<string[]>((acc, curr) => {
    if (acc.length && curr.length === 1) {
      acc[acc.length - 1] += ` ${curr}`;
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);

  return words;
}

function getLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
): string[] {
  const parts = text.split('\n');

  if (parts.length > 1) {
    return parts.reduce<string[]>(
      (acc, curr) => [...acc, ...getLines(ctx, curr.trim(), width)],
      [],
    );
  }

  const words = getWords(text);
  const { width: spaceWidth } = ctx.measureText(' ');

  const lines = [];

  let currentWidth = 0;
  let currentLine = [];
  let currentWord = words.shift();

  while (currentWord !== undefined) {
    const { width: wordWidth } = ctx.measureText(currentWord);

    if (currentLine.length && currentWidth + wordWidth >= width - 8) {
      lines.push(currentLine.join(' '));

      currentWidth = 0;
      currentLine = [];
    }

    currentLine.push(currentWord);
    currentWidth += wordWidth + spaceWidth;
    currentWord = words.shift();
  }

  lines.push(currentLine.join(' '));

  return lines;
}

CanvasRenderingContext2D.prototype.setFont = function setFont(
  typographyName,
  overrides = {},
) {
  if (!typography[typographyName]) {
    return;
  }

  const data = {
    ...typography[typographyName],
    ...overrides,
  };

  let font = '';
  if (data.fontStyle) {
    font += ` ${data.fontStyle}`;
  }
  if (data.fontWeight) {
    font += ` ${data.fontWeight}`;
  }
  if (data.fontSize) {
    font += ` ${data.fontSize}px`;
  }
  if (data.fontFamily) {
    font += ` ${data.fontFamily}`;
  }

  this.font = font.trim();
};

CanvasRenderingContext2D.prototype.getCurrentFontSize =
  function getCurrentFontSize() {
    const result = /([0-9]+)px/.exec(this.font);

    return result ? Number(result[0]) : 0;
  };

CanvasRenderingContext2D.prototype.getCurrentLineHeight =
  function getCurrentLineHeight() {
    const fontSize = this.getCurrentFontSize();

    return fontSize * lineHeight;
  };

CanvasRenderingContext2D.prototype.fillMultilineText =
  function fillMultilineText(text, x, y, width) {
    const lines = getLines(this, text, width);
    let height = 0;

    lines.forEach((line) => {
      this.fillText(line, x, y + height);
      height += this.getCurrentLineHeight();
    });

    return height;
  };

CanvasRenderingContext2D.prototype.measureMultiligneText =
  function measureMultiligneText(text, maxWidth) {
    const lines = getLines(this, text, maxWidth);
    const height = lines.length * this.getCurrentLineHeight();

    const width = lines.reduce(
      (acc, curr) => Math.max(acc, this.measureText(curr).width),
      0,
    );

    return { width, height };
  };

CanvasRenderingContext2D.prototype.fillSeparator = function fillSeparator(
  x,
  y,
  horizontal = false,
  align = 'center',
  size = horizontal ? 900 : 600,
) {
  this.save();

  const thickness = 4;
  const width = horizontal ? size : thickness;
  const height = horizontal ? thickness : size;

  let finalX = x - thickness / 2;
  if (horizontal) {
    if (align === 'center') finalX = x - size / 2;
    else if (align === 'right') finalX = x - size;
    else finalX = x;
  }

  let finalY = 0;
  if (horizontal) {
    finalY = y - thickness / 2;
  } else if (align === 'center') finalY = y - size / 2;
  else if (align === 'right') finalY = y - size;

  const gradient = this.createLinearGradient(
    finalX,
    finalY,
    horizontal ? finalX + size : finalX,
    horizontal ? finalY : finalY + size,
  );

  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(0.5, 'white');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  this.fillStyle = gradient;
  this.fillRect(finalX, finalY, width, height);
  this.restore();
};