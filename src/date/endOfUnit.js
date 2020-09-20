import { assertValidDate } from '../util/assertions';
import { resetByUnit } from './util/reset';
import { setWeekday } from './util/weekdays';

/**
 * Resets the date to the end of the unit. All lower units will also be set.
 *
 * @extra This method modifies the date! Note that `endOfWeek` will set to
 *   Saturday, and `endOfISOWeek` will set to Sunday. Locales are not
 *   considered in `endOfWeek` as this cannot be reliably determined with
 *   current native APIs.
 *
 * @param {Date} date - The date.
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

export function endOfWeek(date) {
  assertValidDate(date);
  setWeekday(date, 6);
  endOfDay(date);
  return date;
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

function endOf(date, unit) {
  assertValidDate(date);
  resetByUnit(date, unit, true);
  return date;
}
