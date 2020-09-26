import { isString, isFunction, isDate } from '../util/typeChecks';
import { assertValidDate } from '../util/assertions';
import { convertTimeToUnit, getAdjacentUnit, formatForUnit } from './util/units';
import { getUnitDistance } from './util/distance';

/**
 * Returns the distance between two dates as a localized string. By default will
 *   use the current date for comparison.
 *
 * @param {Date} date - The date.
 * @param {RelativeParam} [options] - Options to determine the final result.
 *   Shortcuts may be passed here of type `string` for `locale`, `Date` for
 *   `compare`, `Intl.RelativeTimeFormat` for `formatter`, or `Function` for
 *   `resolve`.
 *
 * @typedef {RelativeOptions|string|Date|Function|Intl.RelativeTimeFormat} RelativeParam
 *
 * @typedef {Object} RelativeOptions
 *
 * @property {string} [locale] - A [language tag](https://bit.ly/33NA8hX) that
 *   will be used to create a formatter. If `formatter` is passed, this property
 *   will be ignored. Default options will be used when creating the formatter.
 *   If both `locale` and `formatter` are not provided, will use the default
 *   locale.
 * @property {Intl.RelativeTimeFormat} [formatter] - A
 *   [formatter](https://mzl.la/3mMK5ou) object to localize the final result. A
 *   custom formatter may be passed here that must implement a `format` method
 *   that accepts a number `value` as the first argument, and a string `unit` as
 *   the second. Will override `locale`. Note that `millisecond` is not a valid
 *   unit for a formatter. The resolution will always be `second` or higher.
 * @property {Date} [compare] - The date to be used for comparison. If not
 *   passed, this will be the current date. Note that when passing a `Date` as
 *   a shortcut for this option, the `type` option will also be flipped to
 *   "numeric" when not set.
 * @property {string} [type] - Either "relative" or "numeric". Determines the
 *   formatter to use internally, either `Intl.RelativeTimeFormat` (ie. "5 days
 *   ago") or `Intl.NumberFormat` (ie. "5 days"). Default is "relative" unless a
 *   `Date` is passed as a shortcut, in which case will be "numeric". If
 *   `formatter` is passed this option will be ignored. Note that numeric
 *   formatting will always use the absolute value, ie. "5 days" regardless of
 *   which date is ahead.
 * @property {relativeResolveFn} [resolve] - A function to provide more
 *   granularity about how the result is formatted. Any non-null value returned
 *   by this function will override the result. An example use is to show
 *   relative times only for lower units like "seconds" and "minutes".
 *
 * @callback relativeResolveFn
 *
 * @param {number} value - The value in the given unit.
 * @param {string} unit - The unit in singular form.
 * @param {Date} date - The date passed.
 * @param {RelativeOptions} options - The resolved options that were passed.
 *
 * @returns {string}
 *
 * @example
 *
 *   new Date(Date.now() - 1000).relative() -> "1 second ago"
 *   new Date(Date.now() + 1000).relative() -> "1 second from now"
 *   new Date(Date.now() + 1000).relative('ja') -> "1 秒前"
 *   new Date(Date.now() - 24 * 60 * 60 * 1000).relative(
 *     new Intl.RelativeTimeFormat('en', {
 *       numeric: 'auto',
 *     })
 *   ) -> "yesterday"
 *   date.relative((value, unit) => {
 *     if (unit !== 'second' && unit !== 'minute') {
 *       return date.toISOString();
 *     }
 *   }) -> relative or absolute format depending on the date
 *
 **/
export default function relative(date, opt) {
  assertValidDate(date);
  const options = resolveOptions(opt);
  const { compare, formatter, resolve } = options;

  // First get the unit numerically as a starting point.
  let { unit } = convertTimeToUnit(date.getTime() - compare.getTime(), true);

  // Then use that unit to traverse the date using getter methods.
  let value = getUnitDistance(date, compare, unit);

  // If we have overshot the correct unit (ie. "0 days ago"), then shift down
  // one unit. "millisecond" is not a valid unit for an instance of
  // Intl.RelativeTimeFormat, so shift up one unit in this case instead.
  let shift;
  if (unit === 'millisecond') {
    shift = -1;
  } else if (Math.abs(value) < 1) {
    shift = 1;
  }
  if (shift) {
    unit = getAdjacentUnit(unit, shift);
    value = getUnitDistance(date, compare, unit);
  }

  // If a resolve function was passed, call it and return the resulting value
  // if it exists.
  if (resolve) {
    const resolved = resolve(value, unit, date, options);
    if (resolved != null) {
      return resolved;
    }
  }
  return formatter.format(value, unit);
}

function resolveOptions(opt = {}) {
  if (isString(opt)) {
    opt = { locale: opt };
  } else if (isDate(opt)) {
    opt = { compare: opt };
  } else if (isFunction(opt)) {
    opt = { resolve: opt };
  } else if (opt instanceof Intl.RelativeTimeFormat) {
    opt = { formatter: opt };
  } else {
    opt = { ...opt };
  }
  if (!opt.type) {
    opt.type = opt.compare ? 'numeric' : 'relative';
  }
  if (opt.compare) {
    assertValidDate(opt.compare);
  } else {
    opt.compare = new Date();
  }
  if (!opt.formatter) {
    opt.formatter = getFormatter(opt);
  }
  return opt;
}

function getFormatter(opt) {
  const { type, locale } = opt;
  if (type === 'numeric') {
    // Return a custom formatter that will call formatForUnit
    // as we don't know the unit yet.
    return {
      format: (value, unit) => {
        return formatForUnit(Math.abs(value), unit, locale);
      }
    };
  } else {
    return new Intl.RelativeTimeFormat(locale);
  }
}
