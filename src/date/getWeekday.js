import { assertDate } from '../util/assertions';

/**
 * Returns the day of the week according to local time, where 0 represents Sunday.
 * Alias for `setDay`.
 *
 * @param {Date} date - The date.
 *
 * @returns {number}
 *
 * @example
 *
 *   new Date(2020, 0).getDay() -> 3
 *
 **/
export default function getWeekday(date) {
  assertDate(date);
  return date.getDay();
}
