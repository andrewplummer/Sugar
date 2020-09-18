import { isNumber, isString } from '../util/typeChecks';
import { assertDate } from '../util/assertions';
import { advanceDate } from './util/shift';
import { normalizeProps, getPropsFromString } from './util/props';

/**
 * Shifts the date forward by specific units or a timestamp.
 *
 * @extra This method will modify the date! Note that when advancing the result
 *   may fall on a date that doesn't exist (i.e. February 30). In this case the
 *   date will be shifted to the last day of the month.
 *
 * @param {Date} date - The date.
 * @param {AdvanceProps|number|string} props - The units to advance. May be a
 *   number in which case the date will be shifted using `setTime`. A string
 *   shortcut may also be passed in the format `"5 years"`, etc. Fractional
 *   values are allowed in the shortcut for `days`, `hours`, `minutes`, and
 *   `seconds`.
 * @param {boolean} [reset] - If `true` any units more specific than those
 *   passed will be reset. Does not apply when number is passed.
 *
 * @typedef {Object} AdvanceProps
 * @property {number} [years]        - Number of years to advance.
 * @property {number} [months]       - Number of months to advance.
 * @property {number} [weeks]        - Number of weeks to advance.
 * @property {number} [days]         - Number of days to advance.
 * @property {number} [hours]        - Number of hours to advance.
 * @property {number} [minutes]      - Number of minutes to advance.
 * @property {number} [seconds]      - Number of seconds to advance.
 * @property {number} [milliseconds] - Number of milliseconds to advance.
 * @property {number} [year]         - Alias for `years`.
 * @property {number} [month]        - Alias for `months`.
 * @property {number} [date]         - Alias for `days`.
 * @property {number} [day]          - Alias for `days`.
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
 *   new Date().advance({ year: 1, month: 2 }) -> advances the date 1 year and 2 months
 *   new Date().advance({ hours: 12, minutes: 30 }) -> advances the date 12 hours and 30 minutes
 *   new Date().advance(5000) -> advances the date by 5 seconds
 *
 **/
export default function advance(date, props = {}, reset = false) {
  assertDate(date);
  if (isNumber(props)) {
    date.setTime(date.getTime() + props);
  } else {
    if (isString(props)) {
      props = getPropsFromString(props);
    }
    props = normalizeProps(props);
    advanceDate(date, props, reset);
  }
  return date;
}
