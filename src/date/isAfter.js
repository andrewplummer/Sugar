import { assertOrCreateDate } from './util/creation';

/**
 * Returns `true` if the date is after the specified date.
 *
 * @extra In addition to dates, both arguments accept alternate forms of input
 *   that will derive the date. Most notably this includes a string that will
 *   be parsed. For more see `Date.create.`
 *
 * @param {Date|string|Object} d1 - The input date.
 * @param {Date|string|Object} d2 - The date to compare against.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date().isAfter(new Date()) -> false
 *   new Date().isAfter(new Date(Date.now() - 1)) -> true
 *   new Date().isAfter('today') -> false
 *   new Date().isAfter('yesterday') -> true
 *
 **/
export default function isAfter(d1, d2) {
  d1 = assertOrCreateDate(d1);
  d2 = assertOrCreateDate(d2);
  return d1 > d2;
}
