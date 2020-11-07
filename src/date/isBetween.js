import { assertDate } from '../util/assertions';
import { createDateFromRollup } from './util/creation';

/**
 * Returns `true` if the date is between the provided dates.
 *
 * @extra In addition to dates, all arguments accept alternate forms of input
 *   that will derive the date. Most notably this includes a string that will
 *   be parsed. For more see `Date.create.`
 *
 * @param {Date} date - The input date.
 * @param {Date|string|Object} d1 - A date that is either the start or end of
 *   the range to compare.
 * @param {Date|string|Object} d2 - A date that is either the start or end of
 *   the range to compare.
 * @param {number} [margin] - A number in ms representing a margin of error.
 *   Default is `0`.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date().isBetween(new Date(Date.now() - 1), new Date(Date.now() + 1) -> true
 *   new Date().isBetween('yesterday', 'tomorrow') -> true
 *   new Date().isBetween('Monday', 'Friday') -> true if M-F
 *   new Date().isBetween('1 hour ago', 'now', 60 * 1000)
 *     -> true if between now and an hour ago +- 1 minute margin of error
 *
 **/
export default function isBetween(date, d1, d2, margin = 0) {
  assertDate(date);
  d1 = createDateFromRollup(d1);
  d2 = createDateFromRollup(d2);
  const [start, end] = d1 > d2 ? [d2, d1] : [d1, d2];
  const ts = start.getTime() - margin;
  const te = end.getTime() + margin;
  return date >= ts && date <= te;
}
