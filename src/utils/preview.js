import chunk from "lodash/chunk";
import { documentWidth, documentHeight, typography } from "../config/preview";

const lineHeight = 1.35;

function getWords(text) {
  const words = text.split(" ");

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
  const parts = text.split("\n");

  if (parts.length > 1) {
    return parts.reduce(
      (acc, curr) => [...acc, ...getLines(ctx, curr.trim(), width)],
      []
    );
  }

  const words = getWords(text);
  const { width: spaceWidth } = ctx.measureText(" ");

  const lines = [];

  let currentWidth = 0;
  let currentLine = [];
  let currentWord = words.shift();

  while (currentWord !== undefined) {
    const { width: wordWidth } = ctx.measureText(currentWord);

    if (currentLine.length && currentWidth + wordWidth > width) {
      lines.push(currentLine.join(" "));

      currentWidth = 0;
      currentLine = [];
    }

    currentLine.push(currentWord);
    currentWidth += wordWidth + spaceWidth;
    currentWord = words.shift();
  }

  lines.push(currentLine.join(" "));

  return lines;
}

export function getFont(typographyName) {
  if (!typography[typographyName]) {
    return "";
  }

  const data = typography[typographyName];

  let font = "";
  if (data.fontSize) {
    font += `${data.fontSize}px`;
  }
  if (data.fontFamily) {
    font += ` ${data.fontFamily}`;
  }

  return font;
}

CanvasRenderingContext2D.prototype.getCurrentFontSize = function() {
  const [fontSize] = this.font.split(" ");

  return parseInt(fontSize, 10);
};

CanvasRenderingContext2D.prototype.getCurrentLineHeight = function() {
  const fontSize = this.getCurrentFontSize();

  return fontSize * lineHeight;
};

CanvasRenderingContext2D.prototype.fillMultilineText = function(
  text,
  x,
  y,
  width
) {
  const lines = getLines(this, text, width);
  let height = 0;

  lines.forEach((line, index) => {
    this.fillText(line, x, y + height);
    height += this.getCurrentLineHeight();
  });

  return height;
};

CanvasRenderingContext2D.prototype.measureMultiligneText = function(
  text,
  x,
  y,
  width
) {
  const lines = getLines(this, text, width);

  return lines.length * this.getCurrentLineHeight();
};

CanvasRenderingContext2D.prototype.fillSeparator = function(
  x,
  y,
  horizontal = false,
  align = "center"
) {
  this.save();

  const size = horizontal ? 800 : 600;
  const thickness = 4;
  const width = horizontal ? size : thickness;
  const height = horizontal ? thickness : size;

  let finalX;
  if (horizontal) {
    if (align === "center") finalX = x - size / 2;
    else if (align === "right") finalX = x - size;
  } else {
    finalX = x - thickness / 2;
  }

  let finalY;
  if (horizontal) {
    finalY = y - thickness / 2;
  } else {
    if (align === "center") finalY = y - size / 2;
    else if (align === "right") finalY = y - size;
  }

  const gradient = this.createLinearGradient(
    finalX,
    finalY,
    horizontal ? finalX + size : finalX,
    horizontal ? finalY : finalY + size
  );

  gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
  gradient.addColorStop(0.5, "white");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  this.fillStyle = gradient;
  this.fillRect(finalX, finalY, width, height);
  this.restore();
};

export function generateAnnouncementsPreview(
  ctx,
  block,
  currentFieldPath = [0, "title"]
) {
  const chunks = chunk(block.data, 6);
  const items = chunks[Math.floor(currentFieldPath[0] / 6)];

  const contentWidth = documentWidth - 200;
  const contentHeight = documentHeight - 430;
  const contentPositionY = documentHeight - contentHeight - 100;
  const margin = 80;

  ctx.fillStyle = "white";

  // Title
  ctx.font = getFont("title");
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("Annonces", documentWidth / 2, 90);

  // Line
  const lineX = documentWidth / 2;
  const lineY = contentHeight / 2 + contentPositionY;
  ctx.fillSeparator(lineX, lineY);

  const itemHeight = contentHeight / 3;
  const itemWidth = (contentWidth - margin * 2) / 2;
  const leftPartX = (documentWidth - contentWidth) / 2;
  const rightPartX = leftPartX + itemWidth + margin * 2;

  // Items
  items.forEach((item, index) => {
    const x = index % 2 === 0 ? leftPartX : rightPartX;
    const y = itemHeight * Math.floor(index / 2) + contentPositionY;

    ctx.font = getFont("announcementItemTitle");
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const itemTitleHeight = ctx.fillMultilineText(item.title, x, y, itemWidth);

    ctx.font = getFont("announcementItemDetail");
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillMultilineText(item.detail, x, y + itemTitleHeight, itemWidth);
  });
}

export function generateReadingPreview(
  ctx,
  block,
  currentFieldPath = ["bibleRefs", 0]
) {
  const {
    data: { bibleRefs = [] }
  } = block;

  if (!bibleRefs.length) {
    return;
  }

  const index = currentFieldPath[1];
  const { ref, excerpt } = bibleRefs[index];

  const margin = 80;
  const maxContentWidth = documentWidth - 400;

  ctx.font = getFont("verseTitle");
  const titleHeight = ctx.getCurrentLineHeight();

  ctx.font = getFont("verseExcerpt");
  const excerptHeight = ctx.measureMultiligneText(
    excerpt,
    0,
    0,
    maxContentWidth
  );

  const totalHeight = titleHeight + excerptHeight + margin * 2;
  const y = (documentHeight - totalHeight) / 2;

  ctx.fillStyle = "white";

  ctx.font = getFont("verseTitle");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(ref, documentWidth / 2, y + titleHeight / 2);

  const lineX = documentWidth / 2;
  const lineY = y + titleHeight + margin;
  ctx.fillSeparator(lineX, lineY, true);

  ctx.font = getFont("verseExcerpt");
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillMultilineText(
    excerpt,
    documentWidth / 2,
    y + titleHeight + margin * 2,
    maxContentWidth
  );
}
