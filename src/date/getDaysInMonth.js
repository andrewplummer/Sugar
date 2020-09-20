import { getDaysInMonth as _getDaysInMonth } from './util/helpers';
import { assertValidDate } from '../util/assertions';

/**
 * Returns the number of days in the date's month.
 *
 * @param {Date} date - The date.
 *
 * @returns {number}
 *
 * @example
 *
 *   new Date(2020, 0).getDaysInMonth() -> 31
 *
 **/
export default function getDaysInMonth(date) {
  assertValidDate(date);
  return _getDaysInMonth(date);
}
