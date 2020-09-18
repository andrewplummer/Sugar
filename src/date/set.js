import { isNumber } from '../util/typeChecks';
import { assertDate } from '../util/assertions';
import { updateDate } from './util/update';
import { normalizeProps } from './util/props';

/**
 * Sets the date object by specific units or a timestamp.
 *
 * @extra This method will modify the date!
 *
 * @param {Date} date - The date.
 * @param {DateProps|number} props - The units to set. May be a number in which
 *   case `setTime` will be called.
 * @param {boolean} [reset] - If `true` any units more specific than those
 *   passed will be reset. Does not apply when number is passed.
 *
 * @typedef {Object} DateProps
 * @property {number} [year]         - The year to set.
 * @property {number} [month]        - The month to set (0 indexed).
 * @property {number} [date]         - The date to set.
 * @property {number} [day]          - The day of the week to set.
 * @property {number} [hours]        - The hours to set.
 * @property {number} [minutes]      - The minutes to set.
 * @property {number} [seconds]      - The seconds to set.
 * @property {number} [milliseconds] - The milliseconds to set.
 * @property {number} [weekday]      - Alias for `day`.
 * @property {number} [hour]         - Alias for `hours`.
 * @property {number} [minute]       - Alias for `minutes`.
 * @property {number} [second]       - Alias for `seconds`.
 * @property {number} [millisecond]  - Alias for `milliseconds`.
 * @property {number} [ms]           - Alias for `milliseconds`.
 *
 * @returns {Date}
 *
 * @example
 *
 *   new Date().set({ year: 2010, month: 2 }) -> sets the year and month
 *   new Date().set({ hours: 12, minutes: 30 }) -> sets the time to 12:30pm
 *   new Date().set(Date.now()) -> sets the time by a timestamp
 *
 **/
export default function set(date, props = {}, reset = false) {
  assertDate(date);
  if (isNumber(props)) {
    date.setTime(props);
  } else {
    props = normalizeProps(props);
    updateDate(date, props, reset);
  }
  return date;
}
