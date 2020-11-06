import { assertOrCreateDate } from './util/creation';

/**
 * Returns `true` if the date is between the provided dates.
 *
 * @extra In addition to dates, all arguments accept alternate forms of input
 *   that will derive the date. Most notably this includes a string that will
 *   be parsed. For more see `Date.create.`
 *
 * @param {Date|string|Object} date - The input date.
 * @param {Date|string|Object} d1 - A date that is either the start or end of
 *   the range to compare.
 * @param {Date|string|Object} d2 - A date that is either the start or end of
 *   the range to compare.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date().isBetween(new Date(Date.now() - 1), new Date(Date.now() + 1) -> true
 *   new Date().isBetween('yesterday', 'tomorrow') -> true
 *   new Date().isBetween('Monday', 'Friday') -> true if M-F
 *
 **/
export default function isBetween(date, d1, d2) {
  date = assertOrCreateDate(date);
  d1 = assertOrCreateDate(d1);
  d2 = assertOrCreateDate(d2);
  const [start, end] = d1 > d2 ? [d2, d1] : [d1, d2];
  return date >= start && date <= end;
}
