import { assertValidDate } from '../util/assertions';
import { setISOWeek as _setISOWeek } from './util/iso';

/**
 * Sets the date's week (of the year) as defined by the ISO8601 standard.
 *
 * @extra This will update the date, however the weekday will remain the same.
 *   Note that this standard places Sunday at the end of the week (day 7).
 *
 * @param {Date} date - The date.
 * @param {number} week - The week to set.
 *
 * @returns {number} - The new date timestamp.
 *
 * @example
 *
 *   new Date(2020, 0).setISOWeek(1) -> 2020-01-01
 *   new Date(2020, 0).setISOWeek(53) -> 2020-12-30
 *
 **/
export default function setISOWeek(date, week) {
  assertValidDate(date);
  _setISOWeek(date, week);
  return date.getTime();
}
