import { isString } from '../util/typeChecks';
import { assertValidDate } from '../util/assertions';
import { getTokenFormatter } from './util/tokenFormatter';

/**
 * Returns the date as a string in a variety of formats.
 *
 * @param {Date} date - The date to format.
 * @param {FormatParam} [options] - Options to determine the output.
 *   A `string` may be passed here as a shortcut for `format`, or an instance
 *   of `Intl.DateTimeFormat` as a shortcut for `formatter`. Finally, a
 *   pre-defined format may also be passed. These are constants exported from
 *   the `formats` module prefixed with `DATE`, `TIME`, or `DATETIME`. They also
 *   are defined as static properties on `Sugar.Date`. If no arguments are
 *   passed the native default format will be used.
 * @param {string} [locale] - When a string or pre-defined format is passed as
 *   the first argument, a string may be passed here as a shortcut for `locale`.
 *
 * @typedef {string|Object|Intl.DateTimeFormat|FormatOptions} FormatParam
 *
 * @typedef {Object} FormatOptions
 *
 * @property {string} [format] - A string containing
 *   [LDML tokens](https://bit.ly/3cpPmxt) or literals. Literals can also be
 *   escaped by wrapping with the apostrophe `'` character. Note that
 *   formatting with custom tokens should be a solution for special use cases,
 *   and is inherently problematic for localization purposes. See
 *   [formatting details](https://sugarjs.com/dates/#/Formatting) for more.
 * @property {string} [locale] - A [language tag](https://bit.ly/33NA8hX) that
 *   will be used to create the formatter. If `formatter` is passed, this
 *   property will be ignored. If both `locale` and `formatter` are not
 *   provided, the default locale will be used.
 * @property {Intl.DateTimeFormat} [formatter] - A
 *   [formatter](https://mzl.la/35WcGBD) object to localize the final result.
 *   When used together with `format`, contextual options like `calendar` and
 *   `numberingSystem` will be taken into account to produce the final result.
 *
 * @returns {string}
 *
 * @example
 *
 *   new Date(2020, 0).format() -> "January 1, 2020, 12:00 AM"
 *   new Date(2020, 0).format(Sugar.Date.DATE_SHORT) -> "1/1/2020"
 *   new Date(2020, 0).format(Sugar.Date.TIME_SHORT) -> "12:00 AM"
 *   new Date(2020, 0).format(Sugar.Date.DATE_SHORT, 'ja') -> "1/1/2020"
 *   new Date(2020, 0).format('d MM, yyyy') -> "1 January, 2020"
 *   new Date(2020, 0).format("h 'o''clock' a") -> "12 o'clock AM"
 *   new Date(2020, 0).format('EEEE', 'ja') -> "水曜日"
 *
 **/
export default function format(date, options, locale) {
  assertValidDate(date);
  return resolveFormatter(options, locale).format(date);
}

function resolveFormatter(opt, loc) {

  let options;
  if (isString(opt)) {
    options = { format: opt };
  } else if (opt instanceof Intl.DateTimeFormat) {
    options = { formatter: opt };
  } else {
    options = opt || {};
  }

  let { format, formatter, locale = loc, ...rest } = options;

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, rest);
  }

  if (format) {
    formatter = getTokenFormatter(formatter, format);
  }

  return formatter;
}
