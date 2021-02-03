const { convertToId, converToDate, getNextLiturgyId } = require('../liturgy');

test('converToDate()', () => {
  expect(converToDate('19830717').toISOString()).toBe(
    '1983-07-16T22:00:00.000Z',
  );
});

test('convertToId()', () => {
  expect(convertToId(new Date('2019-01-01'))).toBe('20190101');
});

test('getCurrentLiturgy() without argument', () => {
  Date.now = jest.fn(() => 426808800000);
  expect(getNextLiturgyId()).toBe('19830717');

  Date.now = jest.fn(() => 427240800000);
  expect(getNextLiturgyId()).toBe('19830717');
});

test('getCurrentLiturgy() with argument', () => {
  expect(getNextLiturgyId(new Date('2019-01-01'))).toBe('20190106');
  expect(getNextLiturgyId('20190101')).toBe('20190106');
});
