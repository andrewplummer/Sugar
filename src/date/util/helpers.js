import { assertInteger } from '../../util/assertions';
import { setWeekday } from './weekdays';

// Date method helpers

const METHOD_NAMES = {
  year: 'FullYear',
  month: 'Month',
  date: 'Date',
  day: 'Day',
  hour: 'Hours',
  minute: 'Minutes',
  second: 'Seconds',
  millisecond: 'Milliseconds',
};

export function callDateGet(date, unit) {
  return date[`get${getMethodUnit(unit)}`]();
}

export function callDateSet(date, unit, val) {
  assertInteger(val);

  // Do not proceed if the value is the same as what will be set. In theory
  // this should be a noop, however it will cause timezone shifts when in the
  // middle of a DST fallback. This is unavoidable as the notation itself is
  // ambiguous (ie. "1:00am" happens twice on November 1st, 2015 in northern
  // hemisphere timezones that follow DST), however when advancing or rewinding
  // dates this can throw off calculations so avoid this unintentional shift.
  if (val === callDateGet(date, unit)) {
    return;
  }

  if (unit === 'day') {
    // "setDay" does not exist, so set by date offset and return.
    setWeekday(date, val);
    return;
  } else if (unit === 'month') {
    // If intentionally setting the date to a specific month, prevent traversing
    // into a new month when not enough days are available. Do this by setting
    // the minimum value between the current date and the number of days in the
    // target month.
    preventMonthTraversal(date, val);
  }
  date[`set${getMethodUnit(unit)}`](val);
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
