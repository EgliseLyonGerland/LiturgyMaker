const lirturgies = require('./.firebase/backup/liturgies.json');

function parse(ref) {
  /**
   * Examples:
   *
   *  - 1 Pierre
   *  - 1 Pierre 15
   *  - 1 Pierre 15-16
   *  - 1 Pierre 15.3
   *  - 1 Pierre 15.3-8
   *  - 1 Pierre 15.3-16.8
   */
  const exprs = [
    // {
    //   regExp: /^(.+?)$/,
    //   fields: ["book"]
    // },
    /^(?<book>(\d )?\S+) *(?<chapterStart>\d+)$/,
    /^(?<book>(\d )?\S+) *(?<chapterStart>\d+)-(?<chapterEnd>\d+)$/,
    /^(?<book>(\d )?\S+) *(?<chapterStart>\d+)\.(?<verseStart>\d+[a-z]?)$/,
    /^(?<book>(\d )?\S+) *(?<chapterStart>\d+)\.(?<verseStart>\d+[a-z]?)-(?<verseEnd>\d+[a-z]?)$/,
    /^(?<book>(\d )?\S+) *(?<chapterStart>\d+)\.(?<verseStart>\d+[a-z]?)-(?<chapterEnd>\d+)\.(?<verseEnd>\d+[a-z]?)$/,
  ];
  return exprs.reverse().reduce(function (acc, regExp) {
    if (acc) {
      return acc;
    }
    const matches = regExp.exec(ref.trim());
    if (!matches || !matches.groups) {
      return null;
    }
    return {
      book: matches.groups.book,
      chapterStart: Number(matches.groups.chapterStart),
      verseStart: Number(matches.groups.verseStart) || null,
      chapterEnd: Number(matches.groups.chapterEnd) || null,
      verseEnd: Number(matches.groups.verseEnd) || null,
    };
  }, null);
}

let refs = [];

lirturgies.forEach((liturgy) => {
  liturgy.blocks.forEach((block) => {
    switch (block.type) {
      case 'reading':
        refs = refs.concat(block.data.bibleRefs.map((item) => item.ref));
        break;
      default:
    }
  });
});

refs.forEach((ref) => {
  if (!parse(ref)) {
    console.log(ref.trim());
  }
});
