import { assertValidDate } from '../util/assertions';
import { resetByUnit } from './util/reset';
import { setWeekday } from './util/weekdays';

/**
 * Resets the date to the start of the unit. Lower units will also be reset.
 *
 * @extra For week methods, the start of the week is Sunday by convention. An
 *   extra argument may be passed here to override this. Although this is often
 *   locale dependent, there is currently no reliable way to retrieve this
 *   information given a locale code. This method modifies the date!
 *
 * @param {Date} date - The date.
 * @param {number} [dow = 0] - A number that denotes the weekday that begins the
 *   week. Use `1` for Monday or `6` for Saturday. Only applies to "week" methods.
 *
 * @returns {Date}
 *
 * @example
 *
 *   new Date(2020, 0, 1, 12).startOfDay() -> 2020-01-01
 *   new Date(2020, 0).startOfWeek() -> 2019-12-29
 *   new Date(2020, 0).startOfISOWeek() -> 2019-12-30
 *
 * @method startOfYear
 * @method startOfMonth
 * @method startOfWeek
 * @method startOfISOWeek
 * @method startOfDay
 * @method startOfHour
 * @method startOfMinute
 * @method startOfSecond
 **/
export function startOfYear(date) {
  return startOf(date, 'year');
}

export function startOfMonth(date) {
  return startOf(date, 'month');
}

export function startOfWeek(date, dow) {
  return startOf(date, 'week', dow);
}

export function startOfISOWeek(date) {
  assertValidDate(date);
  setWeekday(date, date.getDay() === 0 ? -6 : 1);
  startOfDay(date);
  return date;
}

export function startOfDay(date) {
  return startOf(date, 'day');
}

export function startOfHour(date) {
  return startOf(date, 'hour');
}

export function startOfMinute(date) {
  return startOf(date, 'minute');
}

export function startOfSecond(date) {
  return startOf(date, 'second');
}

function startOf(date, unit, dow) {
  assertValidDate(date);
  resetByUnit(date, unit, {
    dow,
  });
  return date;
}
