import trim from "lodash/trim";
import deburr from "lodash/deburr";

import books from "../config/bibleBooks.json";

const bookNames = books.reduce((acc, curr) => [...acc, deburr(curr.name)], [
  "Psaume"
]);

function merge(fields, values) {
  return fields.reduce(
    (acc, key, index) => ({
      ...acc,
      [key]: values[index]
    }),
    {}
  );
}

export function parse(ref) {
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
    {
      regExp: /^(.+?) *(\d+)$/,
      fields: ["book", "chapterStart"]
    },
    {
      regExp: /^(.+?) *(\d+)-(\d+)$/,
      fields: ["book", "chapterStart", "chapterEnd"]
    },
    {
      regExp: /^(.+?) *(\d+).(\d+[a-z]?)$/,
      fields: ["book", "chapterStart", "verseStart"]
    },
    {
      regExp: /^(.+?) *(\d+).(\d+[a-z]?)-(\d+[a-z]?)$/,
      fields: ["book", "chapterStart", "verseStart", "verseEnd"]
    },
    {
      regExp: /^(.+?) *(\d+).(\d+[a-z]?)-(\d+).(\d+[a-z]?)$/,
      fields: ["book", "chapterStart", "verseStart", "chapterEnd", "verseEnd"]
    }
  ];

  const ref$ = trim(ref);

  return exprs.reverse().reduce((acc, { regExp, fields }) => {
    const matches = regExp.exec(ref$);

    if (acc) {
      return acc;
    }

    if (matches) {
      return merge(fields, matches.slice(1));
    }

    return null;
  }, null);
}

export function validate(ref) {
  const data = parse(ref);

  if (!data) {
    return "Format incorrect";
  }

  if (!bookNames.includes(deburr(data.book))) {
    return "Livre non-reconnu";
  }

  return "";
}

export default null;
