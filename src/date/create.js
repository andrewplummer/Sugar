import { isString, isNumber, isDate } from '../util/typeChecks';
import { setIANATimeZone } from './util/timeZone';
import { normalizeProps } from './util/props';
import { updateDate } from './util/update';
import { parseDate } from './util/parsing';
import { cloneDate } from '../util/clone';

/**
 * Creates a new date from a variety of input including string formats.
 *
 * @param {string|number|Date|DateProps|ParseOptions} input - The input used to
 *   create the date. Passing a number or Date will simply create a new date
 *   from a timestamp or clone the date accordingly. When a string is passed it
 *   serves as a shortcut for `input` on the `ParseOptions` object, which will
 *   parse the date from a variety of formats. Objects passed with an `input`
 *   property it will be taken as `ParseOptions`, otherwise as `DateProps`.
 * @param {string} [locale] - When a string is passed as the first argument,
 *   a second string may be passed here as a shortcut for the `locale` option.
 *
 * @returns {Date|ParseResult} - If the `explain` option is enabled, an object
 *   will be returned with details of the properties derived from parsing,
 *   otherwise the parsed date will be returned.
 *
 * @typedef {Object} ParseOptions
 *
 * @property {string} input - The string to parse. An error will be thrown if
 *   not passed.
 * @property {string} [locale] - A [language tag](https://bit.ly/33NA8hX) that
 *   will be used to create the parser. If not passed, the default locale will
 *   be used. Note that the resulting parser will be cached.
 * @property {boolean} [future] - When passed, ambiguous dates will prefer the
 *   future. For example if the current day is Friday, "Thursday" will be next
 *   week. If both `past` and `future` are `true` no preference will be applied.
 * @property {boolean} [past] - When passed, ambiguous dates will prefer the
 *   past. For example if the current day is Wednesday, "Thursday" will be last
 *   week. If both `past` and `future` are `true` no preference will be applied.
 * @property {boolean} [explain] - When passed, the return value will be of type
 *   `ParseResult`. This allows inspection of useful properties that were
 *   derived from the parsing. Default is false.
 * @property {Array<DateTimeFormat>} [dateTimeFormats] - Additional datetime
 *   formats to be used when parsing. These will be added to the parser which is
 *   then cached by default.
 * @property {Array<RelativeFormat>} [relativeFormats] - Additional relative
 *   formats to be used when parsing. These will be added to the parser which is
 *   then cached by default.
 * @property {boolean} [cache] - Whether or not to cache the resulting parser
 *   for the provided locale. Building the parse can be expensive, so typically
 *   this should be left on. Default is true.
 *
 * @typedef {DateTimeShortcut|Object} DateTimeFormat - Additional datetime
 *   formats are passed as objects that mirror `Intl.DateTimeFormat`. They must
 *   implement a `formatToParts` method that accepts a single date argument and
 *   return an array of `DateTimeExtendedPart`. A string shortcut of
 *   `DateTimeShortcut` may also be passed here to help create this object.
 *
 * @typedef {string} DateTimeShortcut - A string shortcut to help construct a
 *   `DateTimeFormat` in the format `<relative day>, <Month>\\s*<time?>`. Tokens
 *   wrapped with brackets may be any of the `DateTimeExtendedPart` types.
 *   Adding `relative` before the type will set `relative` flag. Adding a
 *   question mark to the end will make the part optional. Where applicable,
 *   types may also be capitalized, which will set the `style` to `long`.
 *   Note that relative types imply a `long` style  Tokens not wrapped in
 *   brackets will be taken as type `source` with a `value` of the token, and
 *   allow a RegExp source to conditionally match literal strings. As these
 *   parts will be compiled into the parsing regex, as a general rule do not
 *   pass user input here as this has security implications.
 *
 *   Note that although any format can be created, it is important to make them
 *   unique enough to not conflict with existing formats for that locale. For
 *   example `<minute>/<hour>` would parse two digits separated by a slash,
 *   which would conflict with `<month>/<day>` as an internal format for English
 *   based locales. Make sure to have enough required tokens in the format to
 *   avoid conflicts. If optional tokens result in collisions it is often
 *   simpler to add alternates as separate formats. When debugging collisions
 *   you can use the `explain` option to determine the format that is causing
 *   the collision.
 *
 * @typedef {Object} DateTimeExtendedPart - The `formatToParts` method of
 *   `Intl.DateTimeFormat` drives creation of parsers. This object is an
 *   extension of part objects (https://mzl.la/3j66Pg0) that determine the
 *   parsable format.
 *
 * @property {string} type - The type may be any of the native part types:
 *   year, month, day, weekday, hour, minute, second, fractionalSecond,
 *   dayPeriod, timeZoneName, era, and literal. Note that relatedYear and
 *   yearName are not supported. In addition, two other types are supported
 *   for the purposes of parsing. The `source` type will allow a RegExp source
 *   string to conditionally match literals. Note that `literal` will also
 *   greedily match whitespace, periods, and commas. The `time` type serves as a
 *   shortcut for time related tokens. It will match either an hour and
 *   dayPeriod taken together, or an hour and minute with optional fractional
 *   seconds. Note that it also greedily matches optional whitespace and throws
 *   away indeterminate boundaries, so will also match "at", "a las", etc.
 * @property {string} value - The value of the part. For parsing purposes, this
 *   will only apply to types `literal` and `source`.
 * @property {boolean} optional - When true, the part will be considered
 *   optional.
 * @property {boolean} relative - When true, the part will match relative
 *   phrases for the passed unit, which are derived from
 *   `Intl.RelativeTimeFormat`. For example, if the type is `year` and this flag
 *   is true, this part will match `last year`, `next year`, `5 years ago`, etc.
 *   Alternate relative formats may also be passed in the `ParseOptions` object.
 *   Note that this flag only applies to basic unit types: year, month, week,
 *   day, hour, minute, second.
 * @property {string} style - A formatting style in the same format as options
 *   passed to `Intl.DateTimeFormat`. This is generally only required for type
 *   `month` to help differentiate numeric vs. long months.
 *
 * @typedef {Object} RelativeTimeFormat - Additional relative formats are passed
 *   as objects that mirror `Intl.RelativeTimeFormat`. They must implement a
 *   `format` method that accepts two arguments `value` and `unit` and return a
 *   string or `undefined`. These formatters will be called with each basic unit
 *   year, month, week, day, hour, minute, and second with values from -5 to 5
 *   to allow derivation of inflections based on the number (ie. "month" vs
 *   "months", etc).
 *
 * @typedef {Object} ParseResult - An object explaining properties derived from
 *   parsing.
 *
 * @property {Date} date - The parsed date. May be undefined if no date could
 *   be parsed.
 * @property {string} unit - The most specific unit derived from parsing. One of
 *   `year`, `month`, `week`, `date`, `day`, `hour`, `minute`, `second`, or
 *   `millisecond`. Note that `date` implies a day of the month and `day`
 *   implies a weekday. If both were parsed the result will be `date`. May be
 *   undefined if no date could be parsed.
 * @property {string} index - The index of the most specific unit derived from
 *   parsing. Values are in range `0`-`8` equivalent to `year`-`millisecond`.
 *   May be undefined if no date could be parsed.
 * @property {Object} absUnits - The absolute units derived from parsing.
 *   May be undefined if no date could be parsed.
 * @property {Object} relUnits - The relative units derived from parsing.
 *   May be undefined if no date could be parsed.
 * @property {Object} format - The format matched when parsing the date. Useful
 *   for debugging. Has `reg` and `groups` properties to describe the RegExp
 *   used and capturing group resolvers. May be undefined if no date could be
 *   parsed.
 * @property {Object} parser - The parser used to parse the date. Useful for
 *   debugging.
 *
 * @typedef {Object} DateProps
 *
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
 * @example
 *
 *   Date.create('January 1, 2020')
 *   Date.create('January 1, 2020', 'ja')
 *   ...
 *
 **/
export default function create(arg1, arg2) {
  if (arguments.length === 0) {
    throw new TypeError('First argument must be either a string or object');
  } else if (isNumber(arg1)) {
    return new Date(arg1);
  } else if (isDate(arg1)) {
    return cloneDate(arg1);
  } else {
    let options;
    if (isString(arg1)) {
      options = {
        input: arg1,
        locale: arg2,
      };
    } else {
      options = arg1;
    }
    if ('input' in options) {
      return parseDate(options);
    } else {
      let { timeZone, ...props } = options;
      const date = new Date();
      props = normalizeProps(props);
      updateDate(date, props, true);
      if (timeZone) {
        setIANATimeZone(date, timeZone);
      }
      return date;
    }
  }
}
