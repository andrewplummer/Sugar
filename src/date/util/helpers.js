import { assertInteger } from '../../util/assertions';
import { setWeekday } from './weekdays';

// Date method helpers

const METHOD_NAMES = {
  year: 'FullYear',
  month: 'Month',
  date: 'Date',
  day: 'Day',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
  milliseconds: 'Milliseconds',
};

export function callDateGet(date, unit) {
  return date[`get${getMethodUnit(unit)}`]();
}

export function callDateSet(date, unit, val, safe) {
  assertInteger(val);

  // "Safe" denotes not setting the date if the value is the same as what is
  // currently set. In theory this should be a noop, however it will cause
  // timezone shifts when in the middle of a DST fallback. This is unavoidable
  // as the notation itself is ambiguous (ie. there are two "1:00ams" on
  // November 1st, 2015 in northern hemisphere timezones that follow DST),
  // however when advancing or rewinding dates this can throw off calculations
  // so avoiding this unintentional shifting on an opt-in basis.
  if (safe && val === callDateGet(date, unit, val)) {
    return;
  }
  if (unit === 'month') {
    // If intentionally setting the date to a specific month, prevent traversing
    // into a new month when not enough days are available. Do this by setting
    // the minimum value between the current date and the number of days in the
    // target month.
    preventMonthTraversal(date, val);
  }
  const methodUnit = getMethodUnit(unit);
  if (methodUnit === 'Day') {
    setWeekday(date, val);
  } else {
    date[`set${methodUnit}`](val);
  }
}

export function getDaysInMonth(date, month) {
  const year = callDateGet(date, 'year');
  if (month == null) {
    month = callDateGet(date, 'month');
  }
  return 32 - callDateGet(new Date(year, month, 32), 'date');
}

function getMethodUnit(unit) {
  const methodUnit = METHOD_NAMES[unit];
  if (!methodUnit) {
    throw new TypeError(`Unit "${unit}" is invalid`);
  }
  return methodUnit;
}

function preventMonthTraversal(date, targetMonth) {
  const dateVal = callDateGet(date, 'date');
  if (dateVal > 28) {
    const daysInTargetMonth = getDaysInMonth(date, targetMonth);
    if (daysInTargetMonth < dateVal) {
      callDateSet(date, 'date', daysInTargetMonth);
    }
  }
}
