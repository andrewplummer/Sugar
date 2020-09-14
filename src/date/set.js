import { isNumber } from '../util/typeChecks';
import { assertDate } from '../util/assertions';
import { callDateSet } from './util/helpers';
import { getUnitSpecificity } from './util/units';
import { resetBySpecificity } from './util/reset';

/**
 * Sets individual properties on the date.
 *
 * @extra This method will modify the date!
 *
 * @param {Date} date - The date.
 * @param {DateSetProps|number} props - The properties to set. May be a number
 *   in which case `setTime` will be called.
 * @param {boolean} [reset] - If `true` any units more specific than those
 *   passed will be reset. Does not apply when number is passed.
 *
 * @typedef {Object} DateSetProps
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
    if (props.date && props.day) {
      props = { ...props };
      delete props.day;
    }
    const entries = Object.entries(props);
    if (reset) {
      // Reset first to prevent accidentally traversing into a new month as
      // described below.
      let specificity = 0;
      for (let [unit] of entries) {
        specificity = Math.max(specificity, getUnitSpecificity(unit));
      }
      resetBySpecificity(date, specificity);
    }

    // There are two cases in which unintentional shifts may occur depending
    // on how date methods are applied. The first is when there are not enough
    // days in a month, shifting the date into the next month. The second is
    // DST shifts where an hour may not technically exist, for example 2am on
    // March 8th in many North American timezones where the hour will shift to
    // 3am. If a specific date or hour is intended then we need to prevent
    // these shifts.
    if ('date' in props || 'hour' in props || 'hours' in props) {

      if ('date' in props) {
        // Resetting the date will help prevent traversal into a different
        // month, for example when setting { month: 1, date: 15 } on January 31.
        // Note that DST shifts will not cause traversal into a new day, so we
        // do not need to reset the hour here.
        callDateSet(date, 'date', 1);
      }

      // The order of operations is important as setting { month: 0: date: 31 }
      // on February 1 will produce different results depending on whether the
      // month or date is set first. Likewise setting { date: 7, hour: 2 } on
      // March 8 in a DST timezone will produce different results if hour or
      // date is set first. To prevent this, order the operations from least
      // specific -> most specific to arrive where intended.
      entries.sort((a, b) => {
        return getUnitSpecificity(a[0]) - getUnitSpecificity(b[0]);
      });
    }

    for (let [unit, val] of entries) {
      callDateSet(date, unit, val);
    }
  }
  return date;
}
