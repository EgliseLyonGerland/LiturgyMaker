const { parse } = require('../lyrics');

test('parse()', () => {
  const text = `
[verse]
Foobar
`;

  expect(parse(text)).toEqual([
    {
      text: `Foobar`,
      type: 'verse',
    },
  ]);
});
