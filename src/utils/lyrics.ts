import type { LyricPart, LyricType } from "../types";

function isBlankLine(text: string) {
  return text.trim() === "";
}

function isTypeLine(text: string) {
  const trimedText = text.trim();

  return trimedText === "[verse]" || trimedText === "[chorus]";
}

function resolveType(text: string): LyricType {
  return text.substr(1, text.length - 2) === "verse" ? "verse" : "chorus";
}

export const format = function format(lyrics: LyricPart[]) {
  const result: LyricPart[] = [];

  lyrics.forEach(({ text, type }) => {
    let currentIndex = 0;

    text.split("\n").forEach((line) => {
      const trimedLine = line.trim();

      if (trimedLine === "") {
        return;
      }
      if (currentIndex % 6 === 0) {
        result.push({ text: "", type });
        result[result.length - 1].text += trimedLine;
      } else {
        result[result.length - 1].text += `\n${trimedLine}`;
      }

      currentIndex += 1;
    });
  });

  return result;
};

export const parse = function parse(content: string): LyricPart[] {
  let currentType: LyricType = "verse";

  if (!content.trim()) {
    return [];
  }

  return content
    .trim()
    .split("\n")
    .reduce<LyricPart[]>((acc, curr) => {
      if (isBlankLine(curr)) {
        if (acc.length === 0) {
          return acc;
        }

        if (acc[acc.length - 1].text.length > 0) {
          return [...acc, { type: currentType, text: "" }];
        }

        return acc;
      }

      const result = acc;

      if (isTypeLine(curr)) {
        currentType = resolveType(curr);

        if (acc.length === 0) {
          return [...acc, { type: currentType, text: "" }];
        }

        if (acc[acc.length - 1].text.length > 0) {
          return [...acc, { type: currentType, text: "" }];
        }

        result[acc.length - 1].type = currentType;

        return acc;
      }

      if (acc.length === 0) {
        return [...acc, { type: currentType, text: curr }];
      }

      const { text } = result[result.length - 1];
      result[result.length - 1].text = `${text}\n${curr}`.trim();

      return result;
    }, []);
};

export const stringify = function stringify(lyrics: LyricPart[]) {
  return lyrics.map((part) => `[${part.type}]\n${part.text}`).join("\n\n");
};
