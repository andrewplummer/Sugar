import { assertDate } from '../util/assertions';
import { createDateFromRollup } from './util/creation';

/**
 * Returns `true` if the date is before the specified date.
 *
 * @extra In addition to dates, both arguments accept alternate forms of input
 *   that will derive the date. Most notably this includes a string that will
 *   be parsed. For more see `Date.create.`
 *
 * @param {Date} d1 - The input date.
 * @param {Date|string|Object} d2 - The date to compare against. Can be any
 *   input accepted by `Date.create`.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date().isBefore(new Date()) -> false
 *   new Date().isBefore(new Date(Date.now() + 1)) -> true
 *   new Date().isBefore('today') -> false
 *   new Date().isBefore('tomorrow') -> true
 *
 **/
export default function isBefore(date, d2) {
  assertDate(date);
  d2 = createDateFromRollup(d2);
  return date < d2;
}
