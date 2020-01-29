function isBlankLine(text) {
  return text.trim() === '';
}

function isTypeLine(text) {
  const trimedText = text.trim();

  return trimedText === '[verse]' || trimedText === '[chorus]';
}

function resolveType(text) {
  return text.substr(1, text.length - 2);
}

module.exports.parse = function parse(content) {
  let currentType = 'verse';

  if (!content.trim()) {
    return [];
  }

  /**
   * [verse]
   *
   * [chorus]
   *
   * [foobar]
   */

  return content
    .trim()
    .split('\n')
    .reduce((acc, curr) => {
      if (isBlankLine(curr)) {
        if (acc.length === 0) {
          return acc;
        }

        if (acc[acc.length - 1].text.length > 0) {
          return [...acc, { type: currentType, text: '' }];
        }

        return acc;
      }

      if (isTypeLine(curr)) {
        currentType = resolveType(curr);

        if (acc.length === 0) {
          return [...acc, { type: currentType, text: '' }];
        }

        if (acc[acc.length - 1].text.length > 0) {
          return [...acc, { type: currentType, text: '' }];
        }

        acc[acc.length - 1].type = currentType;

        return acc;
      }

      if (acc.length === 0) {
        return [...acc, { type: currentType, text: curr }];
      }

      const { text } = acc[acc.length - 1];
      acc[acc.length - 1].text = `${text}\n${curr}`.trim();

      return acc;
    }, []);
};

module.exports.stringify = function stringify(lyrics) {
  return lyrics.map(part => `[${part.type}]\n${part.text}`).join('\n\n');
};
