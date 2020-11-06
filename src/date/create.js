import { isString, isNumber, isDate } from '../util/typeChecks';
import { createDate } from './util/creation';
import { cloneDate } from '../util/clone';

/**
 * Creates a new date from a variety of input including string formats.
 *
 * @param {string|DateProps|number|Date} input - The input used to create the
 *   date. Passing a number or Date will simply create a new date from a
 *   timestamp or clone the date accordingly. Passing a string will parse it
 *   from a variety of formats. A `DateProps` object may also be passed which
 *   will create the date from an object. Note tha only `from` and `timeZone`
 *   options will apply when passing `DateProps`.
 * @param {InputOptions|string} [options] - An options object that determines
 *   the output. A string may be passed here as a shortcut for `locale`.
 *
 * @returns {Date|ParseResult|null} - If a string is passed and the `explain`
 *   option is `true`, a `ParseResult` object will be returned with details of
 *   the properties derived from parsing, otherwise the parsed date or `null`
 *   will be returned.
 *
 * @typedef {Object} InputOptions
 *
 * @property {string} [locale] - A [language tag](https://bit.ly/33NA8hX) that
 *   will be used to create the parser. If not passed, the default locale will
 *   be used. Note that the resulting parser will be cached by default.
 * @property {boolean} [future] - When passed, ambiguous dates will prefer the
 *   future. For example if the current day is Friday, "Thursday" will be next
 *   week. If both `past` and `future` are `true` no preference will be applied.
 * @property {boolean} [past] - When passed, ambiguous dates will prefer the
 *   past. For example if the current day is Wednesday, "Thursday" will be last
 *   week. If both `past` and `future` are `true` no preference will be applied.
 * @property {Date} [from] - When passed, serves as a reference date from which
 *   the parsing will happen. This is useful when parsing relative formats, for
 *   example "next week" relative to a different point in time. If not passed,
 *   the current date will be used.
 * @property {boolean} [explain] - When passed a `ParseResults will be returned
 *   that allows inspection of properties that were derived from the parsing.
 *   Default is `false`.
 * @property {Array<DateTimeFormat>} [dateTimeFormats] - Additional datetime
 *   formats to be used when parsing. These will be added to the parser which is
 *   then cached by default.
 * @property {Array<RelativeFormat>} [relativeFormats] - Additional relative
 *   formats to be used when parsing. These will be added to the parser which is
 *   then cached by default.
 * @property {boolean} [cache] - Whether or not to cache the resulting parser
 *   for the provided locale. Default is `true`.
 *
 * @typedef {DateTimeShortcut|Intl.DateTimeFormat|Object} DateTimeFormat -
 *   Additional datetime formats are passed as either 1) instances of
 *   Intl.DateTimeFormat, 2) objects that have a `formatToParts` property wct
 *   accepts a single date argument and returns an array of `DateTimeExtendedPart`,
 *   or 3) a string short that will help create this object.
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
 *   based locales. Be careful to have enough required tokens in the format to
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
 *   string to conditionally match literals. `literal` will greedily match
 *   whitespace, periods, and commas. `time` serves as a shortcut for time
 *   related tokens. It will match either an hour and dayPeriod taken together,
 *   or an hour, minute, and optional fractional seconds separated by a colon.
 *   Note that it also greedily matches optional whitespace and throws
 *   away indeterminate boundaries, so will also match "at", "a las", etc.
 * @property {string} value - The value of the part. For parsing purposes, this
 *   will only apply to types `literal` and `source`.
 * @property {boolean} optional - When true, the part will be considered
 *   optional. This can be flagged with `?` in the shortcut string.
 * @property {boolean} relative - When true, the part will match relative
 *   phrases for the passed unit, which are derived from
 *   `Intl.RelativeTimeFormat`. For example, if the type is `year` and this flag
 *   is `true`, this part will match `last year`, `next year`, etc. In addition
 *   to basic units, `upper` and `lower` will match `year`, `month`, `week`, and
 *   `hour`, `minute`, `second`, respectively. An additional `any` token can be
 *   placed in front of `relative` to match numeric formats like `in 5 days` or
 *   `5 days ago`. Altenate relative formats passed into the parser will also be
 *   available here. Examples using the shortcut format:
 *
 *   - `<relative day>` - "today", "tomorrow", etc
 *   - `<relative year>` - "this year", "next year", etc.
 *   - `<relative upper>` - "this year", last week", etc.
 *   - `<relative lower>` - "in an hour", "this hour", etc.
 *   - `<any relative upper>`
 *   TODO: document this better
 *
 * @property {string} style - A formatting style in the same format as options
 *   passed to `Intl.DateTimeFormat`. This is generally only required for type
 *   `month` to help differentiate `numeric` vs. `long` months.
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
 * @property {Date} date - The parsed date.
 * @property {Object} absProps - The absolute props derived from parsing.
 * @property {Object} relProps - The relative props derived from parsing.
 * @property {Object} specificity - An object with `unit` and `index` properties
 *   denoting the specificity of the units derived from the parse. `index` may
 *   range from `0` for `year` to `7` for `millisecond`.
 * @property {Object} format - The format matched when parsing the date. Useful
 *   for debugging. Has `reg` and `groups` properties to describe the RegExp
 *   used and capturing group resolvers.
 * @property {Object} parser - The parser used to parse the date.
 *
 * @typedef {Object} DateProps
 *
 * @property {number} [year]        - The year to set. Also accepts `years`.
 * @property {number} [month]       - The month to set. Also accepts `months`.
 * @property {number} [date]        - The date of the month to set.
 * @property {number} [day]         - The day of the week to set. Also accepts `weekday`.
 * @property {number} [hour]        - The hour to set. Also accepts `hours`.
 * @property {number} [minute]      - The minute to set. Also accepts `minutes`.
 * @property {number} [second]      - The second to set. Also accepts `seconds`.
 * @property {number} [millisecond] - The millisecond to set. Also accepts `milliseconds` or `ms`.
 *
 * @example
 *
 *   Date.create('January 1, 2020')
 *   Date.create('January 1, 2020', 'ja')
 *   TODO: MORE
 *   ...
 *
 **/
export default function create(input, opt) {
  if (arguments.length === 0) {
    throw new TypeError('First argument is required.');
  } else if (input == null && !opt) {
    throw new TypeError('Null input requires a second argument.');
  } else if (isNumber(input)) {
    return new Date(input);
  } else if (isDate(input)) {
    return cloneDate(input);
  } else {
    return createDate(input, opt);
  }
}
