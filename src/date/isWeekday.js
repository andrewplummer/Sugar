import { assertDate } from '../util/assertions';

/**
 * Returns `true` if the date falls on a weekday.
 *
 * @param {Date} date - The date to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date(2020, 0, 1).isWeekday() -> true
 *   new Date(2020, 0, 4).isWeekday() -> false
 *
 **/
export default function isWeekday(date) {
  assertDate(date);
  const day = date.getDay();
  return day > 0 && day < 6;
}
