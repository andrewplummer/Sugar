import { assertDate } from '../util/assertions';
import { advanceDate } from './util/helpers';

/**
 * Aliases for `advance` by a specific unit.
 *
 * @extra This method will modify the date! Note that when advancing the result
 *   may fall on a date that doesn't exist (i.e. February 30). In this case the
 *   date will be shifted to the last day of the month.
 *
 *
 * @param {Date} date - The date.
 * @param {number} num - The number of units to advance. May be a negative
 *   number.
 * @param {boolean} [reset] - If `true` all lower units will be reset.
 *
 * @returns {date}
 *
 * @example
 *
 *   new Date(2020, 0).addYears(1) -> new Date(2021, 0);
 *   new Date(2020, 0).addYears(-5) -> new Date(2015, 0);
 *   new Date(2020, 0).addMonths(1) -> new Date(2020, 1);
 *   new Date(2020, 2, 5).addYears(1, true) -> new Date(2020, 1);
 *
 * @method addYears
 * @method addMonths
 * @method addWeeks
 * @method addDays
 * @method addHours
 * @method addMinutes
 * @method addSeconds
 * @method addMilliseconds
 **/
export function addYears(date, num, reset) {
  return addUnit(date, 'year', num, reset);
}

export function addMonths(date, num, reset) {
  return addUnit(date, 'month', num, reset);
}

export function addWeeks(date, num, reset) {
  return addUnit(date, 'week', num, reset);
}

export function addDays(date, num, reset) {
  return addUnit(date, 'day', num, reset);
}

export function addHours(date, num, reset) {
  return addUnit(date, 'hours', num, reset);
}

export function addMinutes(date, num, reset) {
  return addUnit(date, 'minutes', num, reset);
}

export function addSeconds(date, num, reset) {
  return addUnit(date, 'seconds', num, reset);
}

export function addMilliseconds(date, num, reset) {
  return addUnit(date, 'milliseconds', num, reset);
}

function addUnit(date, unit, num, reset) {
  assertDate(date);
  advanceDate(date, { [unit]: num }, reset);
  return date;
}
