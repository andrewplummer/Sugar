import { assertDate } from '../util/assertions';
import { setWeekday as _setWeekday } from './util/weekdays';

/**
 * Sets the day of the week.
 *
 * @extra Uses `setDate` to set the date as an offset to `getDay`.
 *
 * @param {Date} date - The date.
 * @param {number} val - The weekday to set. May be any positive or negative
 *   integer. Values between 0 and 6 will result in a date that always falls
 *   within the same week (Sunday - Saturday).
 *
 * @returns {number} - The new date timestamp.
 *
 * @example
 *
 *   new Date(2020, 0).setWeekday(5) -> 2020-01-03
 *   new Date(2020, 0).setWeekday(1) -> 2019-12-30
 *   new Date(2020, 0).setWeekday(8) -> 2020-01-06
 *
 * @alias setDay
 **/
export default function setWeekday(date, val) {
  assertDate(date);
  _setWeekday(date, val);
  return date.getTime();
}
