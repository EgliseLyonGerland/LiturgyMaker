import chunk from "lodash/chunk";
import { documentWidth, documentHeight, typography } from "../config/preview";
import { parse } from "../utils/bibleRef";

const lineHeight = 1.3;

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

  return font.trim();
}

CanvasRenderingContext2D.prototype.getCurrentFontSize = function() {
  return /([0-9]+)px/.exec(this.font)[1];
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
  maxWidth
) {
  const lines = getLines(this, text, maxWidth);
  const height = lines.length * this.getCurrentLineHeight();

  const width = lines.reduce(
    (acc, curr) => Math.max(acc, this.measureText(curr).width),
    0
  );

  return { width, height };
};

CanvasRenderingContext2D.prototype.fillSeparator = function(
  x,
  y,
  horizontal = false,
  align = "center"
) {
  this.save();

  const size = horizontal ? 900 : 600;
  const thickness = 4;
  const width = horizontal ? size : thickness;
  const height = horizontal ? thickness : size;

  let finalX;
  if (horizontal) {
    if (align === "center") finalX = x - size / 2;
    else if (align === "right") finalX = x - size;
    else finalX = x;
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
  const chunkIndex = Math.floor(currentFieldPath[0] / 6);
  const items = chunks[Math.min(chunkIndex, chunks.length - 1)];

  const contentWidth = documentWidth - 200;
  const contentHeight = documentHeight - 430;
  const contentPositionY = documentHeight - contentHeight - 100;
  const margin = 80;

  // Title
  ctx.font = getFont("title");
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("Annonces", documentWidth / 2, 90);

  if (chunks.length > 1) {
    const page = `(${chunkIndex + 1}/${chunks.length})`;

    ctx.font = getFont("announcementPage");
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(page, documentWidth / 2, 190);
  }

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

function generateVerseVertical(ctx, ref, excerpt, direction, align) {
  const margin = 80;
  const maxContentWidth = documentWidth - 400;

  ctx.font = getFont("verseTitle");
  const titleHeight = ctx.getCurrentLineHeight();

  ctx.font = getFont("verseExcerpt");
  const { height: excerptHeight } = ctx.measureMultiligneText(
    excerpt,
    maxContentWidth
  );

  const totalHeight = titleHeight + excerptHeight + margin * 2;
  const y = (documentHeight - totalHeight) / 2;

  ctx.save();

  if (align === "left") {
    ctx.translate(-maxContentWidth / 2, 0);
  } else if (align === "right") {
    ctx.translate(maxContentWidth / 2, 0);
  }

  // Display title
  ctx.font = getFont("verseTitle");
  ctx.textAlign = align;
  ctx.textBaseline = "middle";

  let titleY = y + titleHeight / 2;
  if (direction === "bottomTop") {
    titleY += margin * 2 + excerptHeight;
  }

  ctx.fillText(ref, documentWidth / 2, titleY);

  // Display line
  let lineY = y + titleHeight + margin;
  if (direction === "bottomTop") {
    lineY = y + excerptHeight + margin;
  }

  ctx.fillSeparator(documentWidth / 2, lineY, true, align);

  // Display exerpt
  ctx.font = getFont("verseExcerpt");
  ctx.textAlign = align;
  ctx.textBaseline = "middle";

  let excerptY = y + titleHeight / 2;
  if (direction === "topBottom") {
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
    book = "",
    chapterStart = "",
    verseStart = "",
    verseEnd = ""
  } = parsedRef;
  const title = `${book} ${chapterStart}`;

  let subtitle = "";
  if (verseEnd) {
    subtitle = `• ${verseStart}–${verseEnd}`;
  } else if (verseStart) {
    subtitle = `v. ${verseStart}`;
  }

  ctx.font = getFont("verseTitle");
  const { width: titleWidth } = ctx.measureText(title);

  ctx.font = getFont("verseSubtitle");
  const { width: subtitleWidth } = ctx.measureText(subtitle);

  const headerWidth = Math.max(titleWidth, subtitleWidth);
  const maxExcerptWidth = maxContentWidth - headerWidth - margin * 2;

  ctx.font = getFont("verseExcerpt");
  const {
    height: excerptHeight,
    width: excerptWidth
  } = ctx.measureMultiligneText(excerpt, maxExcerptWidth);

  // Display title
  ctx.save();
  ctx.font = getFont("verseTitle");
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  if (subtitle) {
    ctx.translate(0, -ctx.getCurrentLineHeight() / 2);
  }

  let titleX = padding;
  if (direction === "rightLeft") {
    titleX += margin * 2 + excerptWidth;
  }

  ctx.fillText(title, titleX, documentHeight / 2);

  // Display subtitle
  ctx.font = getFont("verseSubtitle");
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(
    subtitle,
    titleX,
    documentHeight / 2 + ctx.getCurrentLineHeight()
  );
  ctx.restore();

  // Display seperator
  let seperatorX = padding + headerWidth + margin;
  if (direction === "rightLeft") {
    seperatorX = padding + excerptWidth + margin;
  }

  ctx.fillSeparator(seperatorX, documentHeight / 2, false, align);

  // Display exerpt
  ctx.font = getFont("verseExcerpt");
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  let exerptY = (documentHeight - excerptHeight) / 2;
  let excerptX = padding;
  if (direction === "leftRight") {
    excerptX += headerWidth + margin * 2;
  }

  ctx.fillMultilineText(excerpt, excerptX, exerptY, maxExcerptWidth);
}

function generateVerseTopBottomLeft(ctx, ref, excerpt) {
  generateVerseVertical(ctx, ref, excerpt, "topBottom", "left");
}

function generateVerseTopBottomCenter(ctx, ref, excerpt) {
  generateVerseVertical(ctx, ref, excerpt, "topBottom", "center");
}

function generateVerseTopBottomRight(ctx, ref, excerpt) {
  generateVerseVertical(ctx, ref, excerpt, "topBottom", "right");
}

function generateVerseBottomTopLeft(ctx, ref, excerpt) {
  generateVerseVertical(ctx, ref, excerpt, "bottomTop", "left");
}

function generateVerseBottomTopCenter(ctx, ref, excerpt) {
  generateVerseVertical(ctx, ref, excerpt, "bottomTop", "center");
}

function generateVerseBottomTopRight(ctx, ref, excerpt) {
  generateVerseVertical(ctx, ref, excerpt, "bottomTop", "right");
}

function generateVerseLeftRightCenter(ctx, ref, excerpt) {
  generateVerseHorizontal(ctx, ref, excerpt, "leftRight", "center");
}
function generateVerseRightLeftCenter(ctx, ref, excerpt) {
  generateVerseHorizontal(ctx, ref, excerpt, "rightLeft", "center");
}

const verseGenerators = {
  topBottomLeft: generateVerseTopBottomLeft,
  topBottomCenter: generateVerseTopBottomCenter,
  topBottomRight: generateVerseTopBottomRight,
  bottomTopLeft: generateVerseBottomTopLeft,
  bottomTopCenter: generateVerseBottomTopCenter,
  bottomTopRight: generateVerseBottomTopRight,
  leftRightCenter: generateVerseLeftRightCenter,
  rightLeftCenter: generateVerseRightLeftCenter
};

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

  const bibleRefIndex = Math.min(currentFieldPath[1], bibleRefs.length - 1);
  const { ref, excerpt, template = "topBottomCenter" } = bibleRefs[
    bibleRefIndex
  ];

  if (verseGenerators[template]) {
    verseGenerators[template](ctx, ref, excerpt);
  }
}

export function generateSongsPreview(
  ctx,
  block,
  currentFieldPath = [0, "title"]
) {
  const { data = [] } = block;
  const songIndex = Math.min(currentFieldPath[0], data.length - 1);
  const song = data[songIndex];

  if (!song) return;

  const title = song.title.split("(")[0].trim();

  ctx.font = getFont("songTitle");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(title, documentWidth / 2, documentHeight / 2);
}

export function generateSectionPreview(ctx, block) {
  const {
    data: { title = "" }
  } = block;

  const margin = 80;

  ctx.font = getFont("chapterTitle");
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const titleHeight = ctx.getCurrentLineHeight();
  const titleX = documentWidth / 2;
  const titleY = (documentHeight - titleHeight - margin) / 2;
  ctx.fillText(title, titleX, titleY);

  const lineX = documentWidth / 2;
  const lineY = titleY + titleHeight + margin;
  ctx.fillSeparator(lineX, lineY, true);
}

export function generateSermonPreview(ctx, block, currentFieldPath = []) {
  this.generateSectionPreview(ctx, { data: { title: "Prédication" } });
}
