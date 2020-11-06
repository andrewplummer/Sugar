import { assertDate } from '../util/assertions';
import { isDate } from '../util/typeChecks';
import { createDate } from './util/creation';

/**
 * Returns `true` if the date is before the specified date.
 *
 * @param {Date} d1 - The input date.
 * @param {Date|string} d2 - The date to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date().isBefore(Date.now()) -> false
 *   new Date().isBefore(Date.now() + 1) -> true
 *   new Date().isBefore('today') -> false
 *   new Date().isBefore('tomorrow') -> true
 *
 **/
export default function isBefore(d1, d2) {
  assertDate(d1);
  if (!isDate(d2)) {
    d2 = createDate(d2)
  }
  assertDate(d2);
  return d1 < d2;
}
