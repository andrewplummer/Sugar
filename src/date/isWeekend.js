import { assertDate } from '../util/assertions';

/**
 * Returns `true` if the date falls on a weekend.
 *
 * @param {Date} date - The date to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date(2020, 0, 1).isWeekend() -> false
 *   new Date(2020, 0, 4).isWeekend() -> true
 *
 **/
export default function isWeekend(date) {
  assertDate(date);
  const day = date.getDay();
  return day === 0 || day === 6;
}
