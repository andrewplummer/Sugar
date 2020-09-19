import { assertDate } from '../util/assertions';
import { getISOWeek as _getISOWeek } from './util/isoWeekDate';

/**
 * Gets the date's week (of the year) as defined by the ISO8601 standard.
 *
 * @extra Note that this standard places Sunday at the end of the week (day 7).
 *
 * @param {Date} date - The date.
 *
 * @returns {number}
 *
 * @example
 *
 *   new Date(2020, 0).getISOWeek() -> 1
 *   new Date(2020, 11, 31).getISOWeek() -> 53
 *
 **/
export default function getISOWeek(date) {
  assertDate(date);
  return _getISOWeek(date);
}
