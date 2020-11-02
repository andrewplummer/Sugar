import { assertValidDate } from '../util/assertions';
import { resetByUnit } from './util/reset';
import { setWeekday } from './util/weekdays';

/**
 * Resets the date to the end of the unit. Lower units will also be set.
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
 *   new Date(2020, 0).endOfDay() -> 2020-01-01T23:59:59.999
 *   new Date(2020, 0).endOfWeek() -> 2020-01-04T23:59:59.999
 *   new Date(2020, 0).endOfISOWeek() -> 2020-01-05T23:59:59.999
 *
 * @method endOfYear
 * @method endOfMonth
 * @method endOfWeek
 * @method endOfISOWeek
 * @method endOfDay
 * @method endOfHour
 * @method endOfMinute
 * @method endOfSecond
 **/
export function endOfYear(date) {
  return endOf(date, 'year');
}

export function endOfMonth(date) {
  return endOf(date, 'month');
}

export function endOfWeek(date, dow) {
  return endOf(date, 'week', dow);
}

export function endOfISOWeek(date) {
  assertValidDate(date);
  if (date.getDay() !== 0) {
    setWeekday(date, 7);
  }
  endOfDay(date);
  return date;
}

export function endOfDay(date) {
  return endOf(date, 'day');
}

export function endOfHour(date) {
  return endOf(date, 'hour');
}

export function endOfMinute(date) {
  return endOf(date, 'minute');
}

export function endOfSecond(date) {
  return endOf(date, 'second');
}

function endOf(date, unit, dow) {
  assertValidDate(date);
  resetByUnit(date, unit, {
    dow,
    end: true,
  });
  return date;
}
