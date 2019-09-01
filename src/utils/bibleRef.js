import superagent from "superagent";
import trim from "lodash/trim";
import deburr from "lodash/deburr";
import find from "lodash/find";

import books from "../config/bibleBooks.json";

const bookNames = books.reduce((acc, curr) => [...acc, deburr(curr.name)], [
  "Psaume"
]);

const bibleId = "2ef4ad5622cfd98b-01";
const apiKey = "428439708c0b8225b46fa975a8b6318f";

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
      regExp: /^(.+?) *(\d+)\.(\d+[a-z]?)$/,
      fields: ["book", "chapterStart", "verseStart"]
    },
    {
      regExp: /^(.+?) *(\d+)\.(\d+[a-z]?)-(\d+[a-z]?)$/,
      fields: ["book", "chapterStart", "verseStart", "verseEnd"]
    },
    {
      regExp: /^(.+?) *(\d+)\.(\d+[a-z]?)-(\d+)\.(\d+[a-z]?)$/,
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

export function getPassage(ref) {
  const data = parse(ref);

  if (!data || !data.chapterStart) return;

  const book = find(books, ["name", data.book]);

  if (!book) return;

  const { id: bookId } = book;
  const { chapterStart, chapterEnd, verseStart, verseEnd } = data;

  let passageId = `${bookId}.${chapterStart}`;
  if (verseStart) {
    passageId += `.${parseInt(verseStart, 10)}`;
  }
  if (chapterEnd || verseEnd) {
    passageId += `-${bookId}.${chapterEnd || chapterStart}`;
    if (verseEnd) {
      passageId += `.${parseInt(verseEnd, 10)}`;
    }
  }

  // ("https://api.scripture.api.bible/v1/bibles/2ef4ad5622cfd98b-01/passages/ISA.55.1-ISA.55.3?);

  const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${passageId}`;

  return new Promise(resolve => {
    superagent
      .get(url)
      .query({
        "content-type": "text",
        "include-notes": false,
        "include-titles": false,
        "include-chapter-numbers": false,
        "include-verse-numbers": false,
        "include-verse-spans": false
      })
      .set("api-key", apiKey)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .then(res => {
        resolve(res.body.data.content);
      })
      .catch(() => {
        resolve("");
      });
  });
}

export default null;
