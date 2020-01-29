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
    return '';
  }

  return content
    .trim()
    .split('\n')
    .reduce((acc, curr) => {
      if (acc.length === 0 || isBlankLine(curr)) {
        return [...acc, { type: currentType, text: '' }];
      }

      if (isTypeLine(curr)) {
        currentType = resolveType(curr);

        if (acc[acc.length - 1].text.length) {
          return [...acc, { type: currentType, text: '' }];
        }

        acc[acc.length - 1].type = currentType;

        return acc;
      }

      const { text } = acc[acc.length - 1];
      acc[acc.length - 1].text = `${text}\n${curr}`.trim();

      return acc;
    }, []);
};

module.exports.stringify = function stringify(lyrics) {
  return lyrics.map(part => `[${part.type}]\n${part.text}`).join('\n\n');
};
