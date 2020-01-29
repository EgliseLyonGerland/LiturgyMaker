const { parse } = require('../lyrics');

test('parse() starts by a verse', () => {
  const text = `
[verse]
Foobar
`;

  expect(parse(text)).toEqual([
    {
      text: 'Foobar',
      type: 'verse',
    },
  ]);
});

test('parse() starts by a chorus', () => {
  const text = `
[chorus]
Foobar
`;

  expect(parse(text)).toEqual([
    {
      text: 'Foobar',
      type: 'chorus',
    },
  ]);
});

test('parse() without tag', () => {
  const text = `
Foobar

Barfoo
`;

  expect(parse(text)).toEqual([
    {
      text: 'Foobar',
      type: 'verse',
    },
    {
      text: 'Barfoo',
      type: 'verse',
    },
  ]);
});

test('parse() empty', () => {
  const text = `

`;

  expect(parse(text)).toEqual([]);
});
