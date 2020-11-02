import { assertDate } from '../util/assertions';
import { isValidDate } from '../util/date';
import { shiftDate } from'./util/shift';
import { compareDatesByUnit } from './util/comparison';

/**
 * Returns `true` if the date falls within the range implied by the method name.
 *
 * @extra For week methods, the start of the week is Sunday by convention. An
 *   extra argument may be passed here to override this. Although this is often
 *   locale dependent, there is currently no reliable way to retrieve this
 *   information given a locale code.
 *
 * @param {Date} date - The date to check.
 * @param {number} [dow = 0] - A number that denotes the weekday that begins the
 *   week. Use `1` for Monday or `6` for Saturday. Only applies to "week" methods.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date(2020, 0).isToday()
 *     -> true for any moment in 2020-01-01
 *
 *   new Date(2020, 1).isThisMonth()
 *     -> true for any moment in 2020-02
 *
 *   new Date(2021, 6).isNextYear()
 *     -> true for any moment in 2020
 *
 * @method isYesterday
 * @method isToday
 * @method isTomorrow
 * @method isLastWeek
 * @method isThisWeek
 * @method isNextWeek
 * @method isLastMonth
 * @method isThisMonth
 * @method isNextMonth
 * @method isLastYear
 * @method isThisYear
 * @method isNextYear
 **/
export function isYesterday(date) {
  return compareToNow(date, 'day', -1);
}

export function isToday(date) {
  return compareToNow(date, 'day', 0);
}

export function isTomorrow(date) {
  return compareToNow(date, 'day', 1);
}

export function isLastWeek(date, dow) {
  return compareToNow(date, 'week', -1, dow);
}

export function isThisWeek(date, dow) {
  return compareToNow(date, 'week', 0, dow);
}

export function isNextWeek(date, dow) {
  return compareToNow(date, 'week', 1, dow);
}

export function isLastMonth(date) {
  return compareToNow(date, 'month', -1);
}

export function isThisMonth(date) {
  return compareToNow(date, 'month', 0);
}

export function isNextMonth(date) {
  return compareToNow(date, 'month', 1);
}

export function isLastYear(date) {
  return compareToNow(date, 'year', -1);
}

export function isThisYear(date) {
  return compareToNow(date, 'year', 0);
}

export function isNextYear(date) {
  return compareToNow(date, 'year', 1);
}

function compareToNow(d1, unit, offset, dow) {
  assertDate(d1);
  if (!isValidDate(d1)) {
    return false;
  }
  const d2 = new Date();
  if (offset !== 0) {
    shiftDate(d2, unit, offset);
  }
  return compareDatesByUnit(d1, d2, unit, dow);
}
