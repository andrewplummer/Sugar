import { getUnitDistance } from './distance';

// As defined here:
// https://en.wikipedia.org/wiki/ISO_week_date

export function getISOWeek(date) {
  const year = date.getFullYear();
  const doy = getDayOfYear(date, year);
  const dow = getISOWeekday(date);
  const week = Math.trunc((doy - dow + 10) / 7);
  if (week < 1) {
    return getYearWeeks(year - 1);
  } else if (week > 52) {
    return week > getYearWeeks(year) ? 1 : week;
  } else {
    return week;
  }
}

export function getISOWeekYear(date) {
  let year = date.getFullYear();
  const month = date.getMonth();
  const week = getISOWeek(date);
  if (month === 0 && week > 51) {
    year -= 1;
  } else if (month === 11 && week === 1) {
    year += 1;
  }
  return year;
}

export function setISOWeek(date, week) {
  const year = date.getFullYear();
  const dow = getISOWeekday(date);
  const c = getISOWeekday(new Date(year, 0, 4)) + 3;
  const doy = week * 7 + dow - c;
  const offset = doy - getDayOfYear(date, year);
  if (offset) {
    date.setDate(date.getDate() + offset);
  }
}

export function getDayOfYear(date, year) {
  if (!year) {
    year = date.getFullYear();
  }
  const jan1 = new Date(year, 0);
  return getUnitDistance(date, jan1, 'day') + 1;
}

function getISOWeekday(date) {
  return date.getDay() || 7;
}

function getYearWeeks(year) {
  return isLongYear(year) ? 53 : 52;
}

function isLongYear(year) {
  return py(year) === 4 || py(year - 1) === 3;
}

function py(y) {
  return (
    (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400)) % 7
  );
}
