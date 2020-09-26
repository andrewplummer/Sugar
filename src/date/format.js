import { isString } from '../util/typeChecks';
import { assertValidDate } from '../util/assertions';
import { getTokenFormatter } from './util/tokenFormatter';
import { DATETIME_LONG } from './formats';
import * as FORMATS from './formats';

/**
 * Returns the date as a string in a variety of formats.
 *
 * @param {Date} date - The date.
 * @param {FormatParam} [options] - Options to determine the final result.
 *   A `string` may be passed here as a shortcut for `format`, or an instance
 *   of `Intl.DateTimeFormat` as a shortcut for `formatter`. Finally, a
 *   pre-defined format may also be passed here as a shortcut for
 *   `formatOptions`. Pre-defined formats are exported from the `formats`
 *   module and also exist on the `Sugar.Date` object, and are prefixed with
 *   `DATE`, `TIME`, or `DATETIME`. If no argument is passed, will use the
 *   default format of `DATETIME_LONG`.
 *
 * @typedef {string|Intl.DateTimeFormat|FormatOptions} FormatParam
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
 *   property will be ignored. Options may be passed with `formatOptions`,
 *   otherwise default options will be used. If both `locale` and `formatter`
 *   are not provided, will use the default locale.
 * @property {Object} [formatOptions] - [Options](https://mzl.la/2G20eFV) passed
 *   when creating the formatter. Pre-defined constants
 *   (ie. `Sugar.Date.DATETIME_LONG`) may also be passed here. If `formatter` is
 *   passed, this property will be ignored.
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
 *   new Date(2020, 0).format('d MM, yyyy') -> "1 January, 2020"
 *   new Date(2020, 0).format("h 'o''clock' a") -> "12 o'clock AM"
 *   new Date(2020, 0).format(
 *     locale: 'ja',
 *     format: 'EEEE'
 *   ) -> "水曜日"
 *
 **/
export default function format(date, opt) {
  assertValidDate(date);
  return resolveFormatter(opt).format(date);
}

function resolveFormatter(opt) {
  if (isString(opt)) {
    opt = { format: opt };
  } else if (opt instanceof Intl.DateTimeFormat) {
    opt = { formatter: opt };
  } else if (isInternalFormat(opt)) {
    opt = { formatOptions: opt };
  } else if (!opt) {
    opt = { formatOptions: DATETIME_LONG };
  }
  let { format, formatOptions, formatter } = opt;
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(opt.locale, formatOptions);
  }
  if (format) {
    formatter = getTokenFormatter(formatter, format);
  }
  return formatter;
}

const internalFormats = new Set(Object.values(FORMATS));

function isInternalFormat(obj) {
  return internalFormats.has(obj);
}
