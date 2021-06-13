import { endOfWeek, format } from 'date-fns';

function isLiturgyId(value) {
  return /^[0-9]{8}$/.test(value);
}

function getClosestAboveSundayDate(date = Date.now()) {
  return endOfWeek(date, { weekStartsOn: 1 });
}

export function getNextLiturgyId(idOrDate = Date.now()) {
  let date = idOrDate;

  if (isLiturgyId(date)) {
    date = converToDate(date);
  }

  return convertToId(getClosestAboveSundayDate(date));
}

export function convertToId(date) {
  return format(date, 'yMMdd');
}

export function converToDate(id) {
  const year = id.slice(0, 4);
  const month = id.slice(4, 6);
  const day = id.slice(6, 8);

  return new Date(`${year}-${month}-${day}T10:00:00`);
}
