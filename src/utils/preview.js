import { typography } from '../config/preview';

export {
  default as generateAnnouncementsPreview,
} from './previews/announcements';
export { default as generateReadingPreview } from './previews/reading';
export { default as generateSectionPreview } from './previews/section';
export { default as generateSermonPreview } from './previews/sermon';
export { default as generateSongsPreview } from './previews/songs';

const lineHeight = 1.3;

function getWords(text) {
  const words = text.split(' ');

  if (words.length < 3) {
    return words;
  }

  const lastWord = words.pop();

  if (lastWord.length <= 3) {
    words[words.length - 1] += ` ${lastWord}`;
  } else {
    words.push(lastWord);
  }

  return words;
}

function getLines(ctx, text, width) {
  const parts = text.split('\n');

  if (parts.length > 1) {
    return parts.reduce(
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

    if (currentLine.length && currentWidth + wordWidth > width) {
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

CanvasRenderingContext2D.prototype.getCurrentFontSize = function getCurrentFontSize() {
  return /([0-9]+)px/.exec(this.font)[1];
};

CanvasRenderingContext2D.prototype.getCurrentLineHeight = function getCurrentLineHeight() {
  const fontSize = this.getCurrentFontSize();

  return fontSize * lineHeight;
};

CanvasRenderingContext2D.prototype.fillMultilineText = function fillMultilineText(
  text,
  x,
  y,
  width,
) {
  const lines = getLines(this, text, width);
  let height = 0;

  lines.forEach(line => {
    this.fillText(line, x, y + height);
    height += this.getCurrentLineHeight();
  });

  return height;
};

CanvasRenderingContext2D.prototype.measureMultiligneText = function measureMultiligneText(
  text,
  maxWidth,
) {
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

  let finalX;
  if (horizontal) {
    if (align === 'center') finalX = x - size / 2;
    else if (align === 'right') finalX = x - size;
    else finalX = x;
  } else {
    finalX = x - thickness / 2;
  }

  let finalY;
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
