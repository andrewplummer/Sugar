import { updateDate } from './update';
import { advanceDate } from './shift';
import { setWeekday } from './weekdays';
import { setTimeZoneOffset, setIANATimeZone } from './timeZone';
import { resetByIndex, resetByUnit } from './reset';
import { isNaN, isString } from '../../util/typeChecks';
import { cloneDate } from '../../util/clone';
import { UNITS, getPropsSpecificity, getAdjacentUnit, formatPartsForUnit, getUnitMultiplier } from './units';
import { replaceLocaleNumerals } from './numerals';
import { REG_ORDINALS, replaceOrdinals } from './ordinals';
import { compileRegExpAlternates } from './regex';
import { getWeekdaysInMonth } from './helpers';

// TODO: move methods back into class

const NUM_TOKEN = 'NUM';
const ENGLISH = 'en';

// Parses positive or negative 4 digit years. Note that years
// with greater digits are only parseable in ISO-8601 format.
const REG_YEAR = '[+-]?\\d{4}';

// Hour 0-29 parseable to support some
// locales that allow hours to overshoot.
const REG_HOUR = '[012]?[0-9]';

// Minutes 0-59 parseable.
const REG_MIN = '[0-5]\\d';

// Parses decimal fractions with period or comma separator.
const REG_DEC = '(?:[.,]\\d+)?';

// Seconds 0-60 parseable to allow
// for leap seconds in ISO-8601 spec.
const REG_SEC_NUMERIC = `${REG_MIN}|60`;

// Milliseconds are not part of Intl spec,
// so most seconds are parsed as fractional.
const REG_SEC = `(?:${REG_SEC_NUMERIC})${REG_DEC}`;

// Timezone suffix like "Z" in ISO-8601, "GMT+09:00", or just "GMT"
const REG_ZONE = `Z|GMT|(?:GMT)?[+−-]\\d{1,2}(?::?${REG_MIN})?(?:\\s\\(.+\\))?`;

// Matches time separators like whitespace, a comma, or unknown
// token that Intl does not provide access to like "at", "on" etc.
// Note that only a single token as a separator is possible as greedily
// accepting any number of tokens will interfere with other formats.
// Negate character class here to match anything that isn't a space or
// numeral, including accented characters like "à".
// TODO: how to handle spanish?
const REG_TIME_SEP = '(?:,?\\s|\\s[^\\d\\s]+\\s)?';

// Matches any floating point number, negative or positive.
const REG_FLOAT = '[+-]?(?:\\d*\\.)?\\d+';

const TIME_TYPES = ['hour', 'minute', 'second', 'dayPeriod'];

const UNIT_SHORTCUTS = {
  upper: ['year', 'month', 'week'],
  lower: ['hour', 'minute', 'second'],
};

const REF_DATE = new Date(2020, 0);

const MATCH_INTEGER = /[+-]?\d+/;
const MATCH_FLOAT = RegExp(REG_FLOAT);

const PHRASE_TYPE_FIXED = 'fixed';
const PHRASE_TYPE_NUMERIC = 'numeric';

// Numeric components apply to all locales
const NUMERIC_COMPONENT = buildNumericComponent();

export default class LocaleParser {

  constructor(locale, options) {
    this.locale = ensureLocale(locale);
    this.language = getLanguage(locale);
    this.options = options;
    this.formats = [];

    this.setup();
    this.buildFormats();
  }

  // --- Build

  setup() {
    this.buildEras();
    this.buildUnits();
    this.buildMonths();
    this.buildWeekdays();
    this.buildDayPeriods();
    this.buildTimeComponent();
    this.buildRelativePhrases();
    this.buildAlternatePhrases();
  }

  buildFormats() {
    this.buildTimeFormat();
    this.buildNumericFormat();
    this.buildIntlFormats();
    this.buildAlternateFormats();
  }

  buildMonths() {
    this.months = this.buildIntlTokens('month', 11, (date, val) => {
      date.setMonth(val);
    });
  }

  buildWeekdays() {
    this.weekdays = this.buildIntlTokens('weekday', 6, (date, val) => {
      date.setDate(val + 5);
    });
  }

  buildDayPeriods() {
    // Spec for dayPeriod is still in flux but seems to be landing on output
    // of localized tokens for "in the morning", "at night", etc. when explicit
    // and "am/pm" when not. However most modern implemenations still return
    // "am/pm" when explicit. According to CLDR rules (https://bit.ly/3e5g0wn)
    // the "am/pm" tokens should be parsed regardless of locale, so normalize
    // by building up sets of both explicit and implied tokens, then override
    // "am/pm" as fixed tokens. Manually ensure newer tokens for English as a
    // special case.
    //
    // TRACK: https://github.com/tc39/ecma402/pull/346
    //
    // Examples:
    //
    // English (current):
    //
    // - Explicit -> {am,pm} (type "long")
    // - Implied -> {am,pm} (type "implied")
    // - Fixed -> {am,pm} (type "fixed")
    // - Patch -> {at night,...} (type "long")
    // - Merged -> {
    //     am: "fixed",
    //     pm: "fixed",
    //     at night: "long",
    //     ...
    //   }
    //
    // English (updated):
    //
    // - Explicit -> {at night,...} (type "long")
    // - Implied -> {am,pm} (type "implied")
    // - Fixed -> {am,pm} (type "fixed")
    // - Merged -> {
    //     am: "fixed",
    //     pm: "fixed",
    //     at night: "long",
    //     ...
    //   }
    //
    // Japanese (current):
    //
    // - Explicit -> {午前,午後} (type "long")
    // - Implied -> {午前,午後} (type "implied")
    // - Fixed -> {am,pm} (type "fixed")
    // - Merged -> {
    //     am: "fixed",
    //     pm: "fixed",
    //     午前: "implied",
    //     午後: "implied",
    //   }
    //
    // Japanese (updated):
    //
    // - Explicit -> {夜中,...} (type "long")
    // - Implied -> {午前,午後} (type "implied")
    // - Fixed -> {am,pm} (type "fixed")
    // - Merged -> {
    //     am: "fixed",
    //     pm: "fixed",
    //     午前: "implied",
    //     午後: "implied",
    //     夜中: "long",
    //     ...
    //   }
    //
    // The new Intl implemenations have 5 possible explicit dayPeriod variants:
    // "Midnight" is notably still absent here as an ambiguous format.
    //
    // - "in the morning" (06:00 - 11:59)
    // - "noon" (12:00 - 12:59)
    // - "in the afternoon" (13:00 - 17:59)
    // - "in the evening" (18:00 - 20:59)
    // - "at night" (20:00 - 05:59)
    //
    const explicitHours = [6, 12, 13, 18, 20];
    const explicit = this.buildIntlTokens('dayPeriod', 4, (date, val) => {
      const hour = explicitHours[val];
      date.setHours(hour);
      return hour;
    });
    const implied = this.buildIntlTokens('impliedDayPeriod', 1, (date, val) => {
      const hour =  val ? 12 : 0;
      date.setHours(hour);
      return hour;
    });
    this.dayPeriods = {
      ...explicit,
      ...implied,
      ...DAY_PERIODS['default'],
      ...DAY_PERIODS[this.language] || {},
    };
  }

  buildEras() {
    this.eras = this.buildIntlTokens('era', 1, (date, val) => {
      date.setFullYear(val ? 1 : -1);
    });
  }

  // Tokens

  getTokenSource(set, type, map) {
    let tokens = this.getTokens(set, type);
    if (map) {
      tokens = tokens.map(map);
    }
    return tokens.join('|');
  }

  getTokens(set, types = 'short|long') {
    let tokens = Object.keys(set);
    if (types) {
      types = types.split('|');
      tokens = tokens.filter((token) => {
        return types.includes(set[token].type);
      });
    }
    return tokens;
  }

  // Intl Tokens

  buildIntlTokens(type, max, fn) {
    const set = {};

    let styles;
    if (type === 'impliedDayPeriod') {
      // An "implied day period" does not pass an explicit dayPeriod option,
      // but returns "am/pm" tokens for the dayPeriod when hourCycle is h12.
      // Current implementations will return this for an explicit day period
      // as well, but going forward this will change (see below). For most
      // Western locales this is redundant as "am/pm" will be added for all
      // locales according to CLDR rules (https://bit.ly/3e5g0wn), however
      // CJK languages may differ ("午後/午前") so this needs to be checked.
      type = 'dayPeriod';
      styles = ['implied'];
    } else if (type === 'era') {
      // Only take "BC, AD", not "Anno Domini, Before Christ".
      styles = ['short'];
    } else if (type === 'dayPeriod') {
      // When formatting an explicit dayPeriod, only use the long format.
      // Current implementations return "am/pm" tokens for both "short" and
      // "long". Going forward this will become "in the morning/at night/etc".
      // Most locales are the same for both "short" and "long" here, but some
      // use abbreviations for "short", which we want to avoid, so take "long".
      styles = ['long'];
    } else {
      // Otherwise take both, for "Wednesday/Wed" and "January/Jan".
      styles = ['short', 'long'];
    }

    const variants = styles.map((style) => {
      const formatter = new Intl.DateTimeFormat(this.locale, {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h12',
        ...(style !== 'implied' && {
          [type]: style
        }),
      });
      return {
        style,
        formatter,
      };
    });

    const date = cloneDate(REF_DATE);
    for (let i = 0; i <= max; i++) {
      const ret = fn(date, i);
      const value = ret != null ? ret : i;
      for (let { style, formatter } of variants) {
        const parts = formatter.formatToParts(date);
        let token = findPart(parts, type).value;

        // Normalize the token by downcasing and removing periods.
        token = token.toLowerCase();
        token = token.replace(/\./g, '');

        set[token] = {
          type: style,
          value,
        };
      }
    }

    return set;
  }

  // Formats

  buildIntlFormats() {
    // - 2020
    // - 2020 BC
    // - 2020年
    this.buildIntlFormat({
      year: 'numeric',
    });

    // - October 2020
    // - October 2020 BC
    // - 2020年10月
    this.buildIntlFormat({
      year: 'numeric',
      month: 'long',
    });

    // - October 8, 2020
    // - October 8, 2020 BC
    // - 8 October, 2020
    // - 8 October, 2020
    // - 2020年10月8日
    this.buildIntlFormat({
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // - October 8
    // - 8 October
    // - 10月8日
    this.buildIntlFormat({
      month: 'long',
      day: 'numeric',
    });

    // Note that even though this is a fully numeric format, the order of tokens
    // is locale dependent, and can vary:
    //
    // 1. mm/dd/yyyy (en-US)
    // 2. dd/mm/yyyy (en-GB)
    // 3. yyyy/mm/dd (other)
    //
    // The last will be ensured as a numeric format regardless of locale, however
    // the first two cannot be assumed, so building them with Intl here and not
    // as a separate numeric format.
    this.buildIntlFormat({
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });

    // - 10/2020
    // - 10-2020
    // - 2020-10
    this.buildIntlFormat({
      year: 'numeric',
      month: 'numeric',
    });

    // - 8/10 (en-US)
    // - 10/8 (en-GB)
    // - ???? (en-CA)
    //
    // Both forms of the day/month variants are used in Canada so
    // they should not be parseable here (https://bit.ly/3kMZ14j)
    if (!this.dayMonthIsAmbiguous()) {
      this.buildIntlFormat({
        month: 'numeric',
        day: 'numeric',
      });
    }

    // - Thursday October 8th 2020 (GMT+05:00)
    // - Thursday October 8th 2020
    // - Thu October 8, 2020
    // - Thu Oct 8, 2020
    // - 2020年10月8日日曜日 日本標準時
    //
    // Note that the timeZoneName part becomes optional.
    this.buildIntlFormat({
      day: 'numeric',
      year: 'numeric',
      month: 'long',
      weekday: 'long',
      timeZoneName: 'long',
    });

    // - October
    // - Oct
    // - 10月
    this.buildIntlFormat({
      month: 'long',
    });

    // - Thursday
    // - Thu
    // - 木曜日
    this.buildIntlFormat({
      weekday: 'long',
    });
  }

  buildIntlFormat(options) {
    this.buildFormat(this.getIntlComponent(this.locale, options));
  }

  buildTimeFormat() {
    this.buildFormat(this.timeComponent);
  }

  buildNumericFormat() {
    this.buildFormat(NUMERIC_COMPONENT);
  }

  buildFormat(format) {
    const { src, groups } = format;
    const reg = RegExp(`^${src}$`, 'i');
    const exists = this.formats.some((f) => {
      return f.reg.source === reg.source;
    });

    // Only push the format if an identical one does not exist. This may occur
    // with alternate formats that ensure both versions of locale variants can
    // be correctly parsed, for example "October 12" vs "12 October".
    if (!exists) {
      this.formats.push({
        reg,
        groups,
      });
    }
  }

  getIntlComponent(locale, options) {
    return this.getComponentFromParts(this.getIntlParts(locale, options), true);
  }

  getIntlParts(locale, options) {
    // If a day is specified in the format then add "hour" which will be
    // collapsed into an optional time format in the resulting component.
    if ('day' in options || 'weekday' in options) {
      options = {
        ...options,
        hour: 'numeric',
        minute: 'numeric',
      };
    }
    // Add era component ("bc/ad") when there is no month (ie. 2000 BC) or
    // if the month is long. Numeric formats should not allow this.
    if ('year' in options && options.month !== 'numeric') {
      options = {
        ...options,
        era: 'long',
      };
    }
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.formatToParts().map((part) => {
      const { type, value } = part;
      const style = options[type];

      // The era can be optional only if a month exists. It must be required
      // in the standalone year format as it can interfere with numeric formats
      // like ISO-8601 short format where numbers can run together (202001).
      let optional = type === 'era';

      return {
        type,
        style,
        value,
        optional,
      };
    });
  }

  getComponentFromParts(parts, collapse) {
    if (collapse) {
      // Native Intl formats should collapse time parts to allow parsing a
      // variety of times ("10pm", "10:30pm", "10:30", etc.). Custom formats are
      // instead provided a <time> token, so do not collapse as they may be
      // intentionally trying to match time components here.
      parts = this.collapseTimeParts(parts);
    }

    let src = '';
    let groups = [];

    for (let part of parts) {

      let { type, value, optional = false, relative = false } = part;

      if (type === 'literal') {

        // Strip regex tokens. Although these aren't likely to occur,
        // ja-JP may for example return "2:04 (土曜日)".
        value = value.replace(/[()|?]/g, '');

        // Intl literal parts may be made optional as the result of collapsing
        // the time parts, otherwise they should be required as to not interfere
        // with meaningful whitespace in other parts.
        // Punctuation should also be optional and may compound ie. "Dec., 2008"
        value = value.replace(/[.,\s]+/, `[,.\\s]${optional ? '*' : '+'}`);

        // Allow variants with hyphens, slashes, or periods.
        value = value.replace(/[-/]/g, '[-./]');

        src += value;
      } else if (type === 'source') {
        // TODO: really want to remove this
        value = value.replace(/^\s+|\s+$/g, '[.,\\s]*');
        src += value;
      } else if (type === 'time') {
        const { src: timeSrc, groups: timeGroups } = this.getTimeComponent(part, parts);
        src += timeSrc;
        groups = [...groups, ...timeGroups];
      } else {
        let resolver;
        if (relative) {
          const { phraseType } = part;
          resolver = this.resolveRelativePhrase;
          src += `(${this.getRelativePhraseSource(type, phraseType)})`;
        } else {
          if (type === 'year') {
            // Generic year token may be allowed to be 2-digits without an
            // apostrophe only if both day and month tokens are also specified.
            const dayPart = findPart(parts, 'day');
            const monthPart = findPart(parts, 'month');
            const apos = dayPart && monthPart ? "'?" : "'";
            src += `(${REG_YEAR}|${apos}\\d{2})`;
            resolver = resolveYear;
          } else if (type === 'yyyy') {
            // A yyyy token is required to be between 4 and 6 digits.
            type = 'year';
            src += `(${REG_YEAR})`;
            resolver = resolveYear;
          } else if (type === 'month') {
            if (this.isNumericPart(part)) {
              src += `(\\d{1,2})`;
            } else {
              src += `(${this.getMonthSource()})`;
            }
            resolver = this.resolveMonth;
          } else if (type === 'weekday') {
            src += `(${this.getWeekdaySource()})`;
            resolver = this.resolveWeekday;
          } else if (type === 'day') {
            type = 'date';
            const monthPart = findPart(parts, 'month');
            if (this.language === ENGLISH && !this.isNumericPart(monthPart)) {
              // English only: "1st", "2nd", etc.
              src += `(\\d{1,2}|(?:${REG_ORDINALS}))`;
              resolver = resolveOrdinal;
            } else {
              src += '(\\d{1,2})';
              resolver = resolveInteger;
            }
          } else if (type === 'hour') {
            src += `(${REG_HOUR})`;
            resolver = resolveInteger;
          } else if (type === 'minute') {
            src += `(${REG_MIN})`;
            resolver = resolveInteger;
          } else if (type === 'second') {
            src += `(${REG_SEC_NUMERIC})`;
            resolver = resolveInteger;
          } else if (type === 'fractionalSecond') {
            type = 'second';
            src += `(${REG_SEC})`;
            resolver = resolveFraction;
          } else if (type === 'dayPeriod') {
            src += `(${this.getDayPeriodSource()})`;
            resolver = this.resolveDayPeriod;
          } else if (type === 'timeZoneName') {
            src += `(${REG_ZONE})?`;
            resolver = resolveTimeZoneName;
          } else if (type === 'era') {
            src += `(${this.getEraSource()})`;
            resolver = this.resolveEra;
          } else if (type === 'timestamp') {
            src += '(\\d+)';
            resolver = resolveTimestamp;
          } else if (type === 'offset weekday') {
            // English only: "the 1st Sunday of next month", etc.
            const anchors = `(?:${REG_ORDINALS}|last)`;
            const weekdays = `(?:${this.getWeekdaySource('long|custom')})`;
            src += `(${anchors} ${weekdays})`;
            resolver = this.resolveOffsetWeekday;
          } else if (type === 'offset unit') {
            // English only: "the day after tomorrow" etc.
            // The tokens "before", "after", "from" cannot be derived from Intl
            // which makes multilingual support for this too difficult for now.
            const nums = `\\w+|a|the`;
            const units = `days?|weeks?|months?|years?`;
            const dirs = 'before|after|from';
            src += `((?:${nums}) (?:${units}) (?:${dirs}))`;
            resolver = this.resolveOffsetUnit;
          } else if (type === 'edge') {
            // English only: "the end of the month", etc.
            src += '(?:the )?(beginning|end|(?:first|last)(?: day)?) of';
            resolver = this.resolveEdge;
          } else if (type === 'unit') {
            src += `(${this.getUnitSource()})`;
            resolver = this.resolveRelativeUnit;
          } else {
            throw new Error(`Unknown type "${type}"`);
          }
        }
        if (optional) {
          src += '?';
        }
        groups.push({
          type,
          resolver,
        });
      }
    }
    return {
      src,
      groups,
    };
  }

  buildTimeComponent() {
    // Time component needs to resolve a number of different formats with
    // optional minute, second, and dayPeriod. To avoid collision with other
    // formats we must avoid parsing a single integer.
    //
    // When day period is last:
    //
    // - 10pm
    // - 10:30
    // - 10:30pm
    // - 10:30:45
    // - 10:30:45pm
    // - 10:30:45.500
    // - 10:30:45.500pm
    // - 10:30 at night
    // - 10:30pm at night
    // - noon
    //
    // When day period is first:
    //
    // - 午後10時
    // - 午後10時0分
    // - 午後10:30
    // - 午後10:30:45
    // - 午後10:30:45.500
    // - 10:30
    // - 10:30:45
    // - 10:30:45.500

    const hourGroup = {
      type: 'hour',
      resolver: resolveInteger,
    };
    const minuteGroup = {
      type: 'minute',
      resolver: resolveInteger,
    };
    const secondGroup = {
      type: 'second',
      resolver: resolveFraction,
    };
    const dayPeriodGroup = {
      type: 'dayPeriod',
      resolver: this.resolveDayPeriod,
    };
    let src;
    let groups = [
      hourGroup,
      minuteGroup,
      secondGroup,
    ];
    if (this.partOrderMatches('hour', 'dayPeriod')) {
      const dpf = this.getDayPeriodSource('implied');
      const dpl = this.getDayPeriodSource('long');
      const dp = `(?:\\s?(${dpf}))?(?:\\s?(${dpl}))?`;
      src = `(?!\\s)(${REG_HOUR}(?!$))?(?::(${REG_MIN})?)?(?::(${REG_SEC}))?${dp}`;
      groups = [
        ...groups,
        dayPeriodGroup,
        dayPeriodGroup,
      ];
    } else {
      const dp = this.getDayPeriodSource();
      src = `(${dp})?(${REG_HOUR})(?::(${REG_MIN}))?(?::(${REG_SEC}))?`;
      groups = [
        dayPeriodGroup,
        ...groups,
      ];
    }
    this.timeComponent = {
      src,
      groups,
    };
  }

  getTimeComponent(part, parts) {
    // Allow a time separator either before or
    // after the time depending on its position.
    const index = parts.indexOf(part);
    const sep1 = parts[index - 1] ? REG_TIME_SEP : '';
    const sep2 = parts[index + 1] ? REG_TIME_SEP : '';
    let { src, groups } = this.timeComponent;
    src = `(?:${sep1}${src}${sep2})?`;
    return {
      src,
      groups,
    };
  }

  partOrderMatches(type1, type2) {
    const formatter = new Intl.DateTimeFormat(this.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      hourCycle: 'h12',
      dayPeriod: 'long',
    });
    const parts = formatter.formatToParts();
    const part1 = findPart(parts, type1);
    const part2 = findPart(parts, type2);
    return parts.indexOf(part1) < parts.indexOf(part2);
  }

  collapseTimeParts(parts) {
    // Collapse "hour", "minute", "second", and "dayPeriod" parts here into
    // a single "time" part to allow complex matching of any time with any date
    // as otherwise the formats become permutational. Literals between time
    // components must be removed as well.
    const startIndex = parts.findIndex(this.isTimePart);
    if (startIndex !== -1) {
      let endIndex = startIndex;
      for (let part of parts.slice(startIndex + 1)) {
        if (this.isLiteralPart(part) || this.isTimePart(part)) {
          endIndex += 1;
        } else {
          break;
        }
      }
      parts = [
        ...parts.slice(0, startIndex),
        { type: 'time', optional: true },
        ...parts.slice(endIndex + 1),
      ];
    }
    // Also make literals surrounding optional parts optional themselves.
    parts.forEach((part, i) => {
      if (this.isLiteralPart(part)) {
        const last = parts[i - 1];
        const next = parts[i + 1];
        if (this.isOptionalPart(last) || this.isOptionalPart(next)) {
          part.optional = true;
        }
      }
    });
    return parts;
  }

  isNumericPart(part) {
    if (!part) {
      return false;
    }
    const { style } = part;
    return style === 'numeric' || style === '2-digit';
  }

  isTimePart(part) {
    return part && TIME_TYPES.includes(part.type);
  }

  isOptionalPart(part) {
    return part && part.optional;
  }

  isLiteralPart(part) {
    return part && part.type === 'literal';
  }

  buildRelativePhrases() {
    const formats = this.getRelativeFormats();
    const phrases = {};
    for (let { type: formatType, formatter } of formats) {
      for (let unit of UNITS) {
        if (unit !== 'millisecond') {
          for (let num = -5; num < 5; num++) {

            if (num === 0 && (unit === 'hour' || unit === 'minute')) {
              // Intl.RelativeTimeFormat with "auto" yields the following:
              //
              //  0 month  -> "this month"
              //  1 month  -> "next month"
              //  0 hour   -> "this hour"
              //  1 hour   -> "in an hour"
              //  ...etc
              //
              // The phrase "this hour" and "this minute" are not particularly
              // helpful and makes it difficult to optimize the regex later due
              // to the discrepancy with "last" and "next", so skipping them.
              continue;
            }

            let str = formatter.format(num, unit);
            if (str) {
              let type = formatType;
              str = str.replace(MATCH_INTEGER, () => {
                // Override type here if the format contains a digit to be
                // "numeric" as "auto" format may still return numbers.
                type = PHRASE_TYPE_NUMERIC;
                return NUM_TOKEN;
              });
              const phrase = {
                type,
                unit,
              };
              if (type === PHRASE_TYPE_FIXED) {
                phrase.value = num;
              } else {
                phrase.dir = Math.max(-1, Math.min(1, num));
              }
              phrases[str] = phrase;
            }
          }
        }
      }
    }
    this.relativePhrases = phrases;
  }

  buildAlternatePhrases() {
    this.buildAliases();
    this.buildRelativeUnitPhrases(this.months, 'month', 'year');
    this.buildRelativeUnitPhrases(this.weekdays, 'day', 'week');
  }

  buildAliases() {
    const { months, weekdays, relativePhrases } = this;
    const aliases = TOKEN_ALIASES[this.language] || {};
    for (let [token, alias] of Object.entries(aliases)) {
      //weekend: 'saturday|custom',
      const [name, type] = alias.split('|');
      for (let set of [months, weekdays, relativePhrases]) {
        if (name in set) {
          if (type) {
            set[token] = {
              ...set[name],
              type,
            };
          } else {
            set[token] = set[name];
          }
        }
      }
    }
  }

  buildUnits() {
    const units = {};
    for (let unit of UNITS) {
      if (unit !== 'millisecond') {
        for (let num = -5; num < 5; num++) {
          const parts = formatPartsForUnit(num, unit, this.locale);
          const part = findPart(parts, 'unit');
          if (part) {
            units[part.value] = unit;
          }
        }
      }
    }
    this.units = units;
  }

  buildRelativeUnitPhrases(set, unit, relUnit) {
    const type = PHRASE_TYPE_FIXED;
    const reg = RegExp(this.getUnits(relUnit).join('|'));
    for (let phrase of this.getRelativePhrases(relUnit, PHRASE_TYPE_FIXED)) {
      const { value: relValue } = this.relativePhrases[phrase];
      for (let token of this.getTokens(set, 'long|custom')) {
        const { value } = set[token];
        // CJK locales have numeric months like 1月, where a phrase like
        // "来1月" is meaningless, so filter them here.
        if (!token.match(MATCH_INTEGER)) {
          const key = phrase.replace(reg, token);
          // Don't override existing phrases.
          if (key !== phrase) {
            this.relativePhrases[key] = {
              type,
              unit,
              value,
              relUnit,
              relValue,
            };
          }
        }
      }
    }
  }

  buildAlternateFormats() {
    const formats = [
      ...ALTERNATE_DATETIME_FORMATS['default'],
      ...(ALTERNATE_DATETIME_FORMATS[this.locale] || []),
      ...(ALTERNATE_DATETIME_FORMATS[this.language] || []),
      ...(this.options.dateTimeFormats || []),
    ];
    for (let format of formats) {
      const parts = this.compilePartsFromFormat(format);
      const component = this.getComponentFromParts(parts);
      this.buildFormat(component);
    }
  }

  getRelativeFormats() {
    return [
      ...this.getRelativeIntlFormats(),
      ...this.getRelativeCustomFormats(),
    ];
  }

  getRelativeIntlFormats() {
    return [PHRASE_TYPE_NUMERIC, PHRASE_TYPE_FIXED].map((type) => {
      const formatter = new Intl.RelativeTimeFormat(this.locale, {
        numeric: type === PHRASE_TYPE_NUMERIC ? 'always' : 'auto',
      });
      return {
        type,
        formatter,
      };
    });
  }

  getRelativeCustomFormats() {
    return [
      ...this.getInternalCustomFormatters(),
      ...(this.options.relativeFormats || []),
    ].map((formatter) => {
      return { type: PHRASE_TYPE_FIXED, formatter };
    });
  }

  getInternalCustomFormatters() {
    return [
      ...(ALTERNATE_RELATIVE_FORMATS[this.locale] || []),
      ...(ALTERNATE_RELATIVE_FORMATS[this.language] || []),
    ].map((resolver) => {
      return { format: resolver };
    });
  }

  getMonthSource(type) {
    return this.getTokenSource(this.months, type);
  }

  getWeekdaySource(type) {
    return this.getTokenSource(this.weekdays, type);
  }

  getDayPeriodSource(type) {
    return this.getTokenSource(this.dayPeriods, type, (token) => {
      // Normalize "am/pm" to accept optional periods. These are
      // added as fixed tokens and apply to all locales.
      return token.replace(/^([ap])m$/, '$1\\.?(?:m\\.?)?');
    });
  }

  getEraSource(type) {
    return this.getTokenSource(this.eras, type);
  }

  getRelativePhraseSource(unit, type) {
    let src = compileRegExpAlternates(this.getRelativePhrases(unit, type));
    // Fixed phrases like "tomorrow" or "next week" will not have a token in
    // them so will match exactly. Phrases like "NUM days ago" will need to
    // match any floating point number.
    return src.replace(RegExp(NUM_TOKEN, 'g'), `(?:${REG_FLOAT}|[\\w\\s]+)`);
  }

  getRelativePhrases(unit, type) {
    let phrases = Object.keys(this.relativePhrases);
    if (unit) {
      const units = UNIT_SHORTCUTS[unit] || [unit];
      phrases = phrases.filter((key) => {
        const { unit } = this.relativePhrases[key];
        return units.includes(unit);
      });
    }
    if (type) {
      phrases = phrases.filter((key) => {
        const phrase = this.relativePhrases[key];
        return phrase.type === type;
      });
    }
    return phrases;
  }

  getUnitSource(type) {
    return compileRegExpAlternates(this.getUnits(type));
  }

  getUnits(type) {
    let units = Object.keys(this.units);
    if (type) {
      units = units.filter((key) => {
        return this.units[key] === type;
      });
    }
    return units;
  }

  // --- Resolvers

  resolveMonth(str, opt) {
    const { absProps } = opt;
    resolveInteger(str, opt);
    if (!('month' in absProps)) {
      const token = this.months[str];
      if (token) {
        absProps.month = token.value;
      }
    }
  }

  resolveWeekday(str, { absProps }) {
    const token = this.weekdays[str];
    if (token) {
      absProps.day = token.value;
    }
  }

  // --- English only resolvers

  resolveOffsetWeekday(str) {
    // An offset weekday such as "the 2nd Wednesday of February" implies a
    // weekday relative to the resolved month, so return a function here to
    // allow other units to be resolved before checking against the current
    // day and setting accordingly.
    return (date, absProps) => {
      let [ordinal, weekday] = str.split(' ');
      ordinal = replaceOrdinals(ordinal);
      const token = this.weekdays[weekday];
      if (token) {
        let day = token.value;
        let mult;
        if (ordinal === 'last') {
          mult = getWeekdaysInMonth(date, day) - 1;
        } else {
          mult = parseInt(ordinal, 10) - 1;
        }
        if (mult) {
          day += 7 * mult;
        }
        setOffsetWeekday(date, day);
        absProps.offsetWeekday = day;
      }
    };
  }

  resolveOffsetUnit(str) {
    // Offset units such as "the day after tomorrow", etc.
    return (date, absProps, relProps) => {
      let [num, unit, dir] = str.split(' ');
      num = replaceLocaleNumerals(num, this.language);
      num = parseFloat(num) || 1;
      unit = unit.replace(/s$/, '');
      num *= dir === 'before' ? -1 : 1;
      advanceDate(date, {
        [unit]: num,
      });
      relProps[unit] = (relProps[unit] || 0) + num;
    };
  }

  resolveEdge(str) {
    // Edge phrases like "the beginning of January", etc.
    return (date, absProps, relProps) => {
      const isEnd = str === 'end' || str === 'last day';
      const { index } = getPropsSpecificity({
        ...relProps,
        ...absProps,
      });
      resetByIndex(date, index, isEnd, absProps);
      if (str === 'first day' || str === 'last day') {
        resetByUnit(date, 'day', false, absProps);
      }
    };
  }

  resolveDayPeriod(str, { absProps }) {
    // The day period (am/pm) may appear before or after the hour, so need to
    // allow all resolvers to be called first, then advance the absolute hour
    // if it is set.
    return (date) => {
      str = str.replace(/\./g, '');
      str = str.replace(/^([ap])$/, '$1m');
      const token = this.dayPeriods[str];
      if (token) {
        const { type, value } = token;
        let targetHour;
        if ('hour' in absProps) {
          // When an hour is set then a dayPeriod may result in a shift:
          //
          // "10:00pm" -> "22:00"
          // "12:00am" -> "00:00"
          // "10 in the evening" -> "22:00"
          // "12 in the morning" -> "00:00"
          // "10 at night" -> "22:00"
          //
          // Note that many of these formats are
          // best-effort as ambiguity exists:
          //
          // "12 in the evening" => "00:00" (???)
          // "4 in the evening"  => "16:00" (???)
          // "4 at night"        => "04:00" (???)

          let hour = absProps.hour;
          if (type === 'implied') {

            // An "implied" type of "am/pm" should simply set the hour
            // ahead if the "pm" token exists and the hour is before 12,
            // or shift back if the hour is 12 and the "am" token exists.

            if (hour > 0 && hour < 12 && value === 12) {
              targetHour = hour + 12;
            } else if (hour === 12 && value === 0) {
              targetHour = hour - 12;
            }
          } else {

            // An "explicit" type such as "in the evening" needs to so
            // something a bit more subtle as these forms are ambiguous.

            if (hour < 12 && value >= 12) {
              targetHour = hour + 12;
            } else if (hour === 12 && (value <= 6 || value >= 18)) {
              targetHour = hour - 12;
            }
          }
        } else {
          // When the hour has not been set then an explicit dayPeriod may set
          // it. Note that implied dayPeriods "am/pm" should not be allowed
          // without the hour, so they should never make it this far. Examples:
          //
          // "in the evening" -> "18:00"
          // "at night" -> "20:00"
          // "noon" -> "12:00"
          // "midnight" -> "24:00" (advances the day)

          targetHour = value;
        }
        if (targetHour != null) {
          date.setHours(targetHour);
          absProps.hour = targetHour;
        }
      }
    };
  }

  resolveEra(str) {
    // Era requires that the year first be set so return a post resolver here.
    return (date, absProps) => {
      str = str.replace(/\./g, '');
      const token = this.eras[str];
      if (token) {
        const bc = token.value === 0;
        let year = date.getFullYear();
        if (bc && year > 0) {
          year = -year;
          date.setFullYear(year);
          absProps.year = year;
        }
      }
    };
  }

  resolveRelativePhrase(str, { relProps, absProps }) {
    let value;
    let phrase = this.relativePhrases[str];
    if (phrase) {
      // Fixed phrases such as "tomorrow", etc. have an
      // associated fixed value so simply set it here.
      value = phrase.value;
    } else {
      // Non-fixed phrases such as "5 days from now" require normalizing
      // the phrase and parsing the value from the matched string, then applying
      // the implied direction, such as -1 for "ago", etc.
      str = replaceLocaleNumerals(str, this.language);
      str = str.replace(MATCH_FLOAT, (match) => {
        value = match;
        return NUM_TOKEN;
      });
      phrase = this.relativePhrases[str];
      if (!phrase) {
        // Attempt to replace articles in relative phrases such as
        // "an hour ago", "hace una hora", etc. as a fallback.
        str = str.replace(/^\w+/, NUM_TOKEN);
        phrase = this.relativePhrases[str];
        // Set the value here for brevity. If the phrase
        // was not matched it will not proceed below.
        value = 1;
      }
    }
    if (phrase) {
      let { unit: type, dir, relUnit, relValue } = phrase;
      if (dir != null) {
        value *= phrase.dir;
      }

      let props;
      if (relUnit) {
        relProps[relUnit] = relValue;
        props = absProps;
      } else {
        props = relProps;
      }
      resolveFraction(value, {
        type,
        props,
      });
    }
  }

  resolveRelativeUnit(str, { relProps }) {
    // Out of context a unit for the most part has no meaning, so this on its
    // own does not affect the date, however it provides an anchor point for
    // resolving edges to allow formats like "the end of the day".
    const unit = this.units[str];
    relProps[unit] = 0;
  }

  compilePartsFromFormat(str) {

    str = this.runFormatExpansions(str);

    function flush() {
      if (buffer) {
        if (isToken) {
          let type = buffer;
          let style = 'numeric';
          let phraseType;
          let relative = false;
          let optional = false;
          type = type.replace(/\b[A-Z]/g, (str) => {
            style = 'long';
            return str.toLowerCase();
          });
          type = type.replace(/(any )?relative (.+)/, (str, any, unit) => {
            phraseType = any ? null : 'fixed';
            relative = true;
            style = 'long';
            return unit === 'unit' ? '' : unit;
          });
          type = type.replace(/\?$/, () => {
            optional = true;
            return '';
          });
          type = type.trim();
          parts.push({
            type,
            style,
            optional,
            relative,
            phraseType,
          });
        } else {
          parts.push({
            type: 'source',
            value: buffer,
          });
        }
      }
      buffer = '';
    }

    let buffer = '';
    let isToken = false;
    const parts = [];

    for (let char of str) {
      if (char === '<') {
        flush();
        isToken = true;
      } else if (char === '>') {
        flush();
        isToken = false;
      } else {
        buffer += char;
      }
    }
    flush();
    return parts;
  }

  dayMonthIsAmbiguous() {
    return DAY_MONTH_AMBIGUOUS_LOCALES[this.locale];
  }

  runFormatExpansions(str) {
    str = str.replace(/<dayMonth>/, () => {
      if (this.dayMonthIsAmbiguous()) {
        return '';
      } else if (this.partOrderMatches('day', 'month')) {
        return '<day>[-/]<month>';
      } else {
        return '<month>[-/]<day>';
      }
    });
    return str;
  }

  parse(str, options) {

    // Parsing is case insensitive so downcase the
    // string so that tokens are correctly matched.
    str = str.trim().toLowerCase();

    for (let format of this.formats) {
      const { reg, groups } = format;
      const match = str.match(reg);
      if (match) {
        const date = new Date();
        const { past = false, future = false, explain = false, timeZone } = options;
        const preference = (-past + future);
        const origin = cloneDate(date);
        const absProps = {};
        const relProps = {};
        const post = [];

        for (let i = 0; i < groups.length; i++) {
          const { type, resolver } = groups[i];
          const str = match[i + 1];
          if (str) {
            // TRACK: https://github.com/tc39/proposal-class-fields
            // Use public class field instead of .call here when this
            // proposal lands.
            const fn = resolver.call(this, str, {
              type,
              absProps,
              relProps,
            });
            if (fn) {
              post.push(fn);
            }
          }
        }
        if (Object.keys(relProps).length > 0) {
          advanceDate(date, relProps);
        }
        if (Object.keys(absProps).length > 0) {
          updateDate(date, absProps, true);
        }

        // Some resolvers may require the date to be updated
        // before they can resolve, so push them into an array
        // above and call them here.
        for (let fn of post) {
          fn(date, absProps, relProps);
        }

        //console.info(reg, match, absProps, relProps);

        // If no timeZoneOffset was derived from the parsing and
        // an override was set, then set it here.
        if (timeZone && !('timeZoneOffset' in absProps)) {
          setIANATimeZone(date, timeZone);
        }

        // Allow date to resolve before applying preference.
        if (preference) {
          const delta = date - origin;
          if (preference !== delta / Math.abs(delta)) {
            const unit = getAmbiguousUnit(absProps, relProps);
            if (unit) {
              advanceDate(date, {
                [unit]: preference,
              });
              // If an offset weekday has been set (ie. "the 2nd Friday of
              // November"), then advancing the date to accomodate a preference
              // may change it as it will advance/rewind the year, so check and
              // reset here if this is the case.
              const { offsetWeekday } = absProps;
              if (offsetWeekday != null && offsetWeekday % 7 !== date.getDay()) {
                setOffsetWeekday(date, offsetWeekday);
              }
            }
          }
        }

        this.cacheFormat(format);

        if (explain) {
          return {
            date,
            absProps,
            relProps,
            specificity: getPropsSpecificity({
              ...relProps,
              ...absProps,
            }),
            format,
            parser: this,
          };
        } else {
          return date;
        }
      }
    }
  }

  cacheFormat(format) {
    // If the format was matched then move it to the front of the array. In
    // addition to matching repeated patterns much faster, this will naturally
    // keep common patterns higher resulting in better overall performance.
    const { formats } = this;
    if (formats.indexOf(format) !== 0) {
      const index = formats.indexOf(format);
      formats.unshift(formats.splice(index, 1)[0]);
    }
  }

}

function setOffsetWeekday(date, day) {
  date.setDate(1);
  if (day % 7 < date.getDay()) {
    day += 7;
  }
  setWeekday(date, day);
}

function findPart(parts, type) {
  return parts.find((part) => part.type === type);
}

function getAmbiguousUnit(absProps, relProps) {
  let { unit } = getPropsSpecificity(absProps);
  while (unit) {
    if (propsUnitExists(relProps, unit)) {
      return null;
    } else if (!propsUnitExists(absProps, unit)) {
      break;
    }
    unit = getHigherUnit(unit, absProps);
  }
  return unit;
}

function getHigherUnit(unit, props) {
  if (unit === 'hour') {
    // Return "day" if it exists in the props, otherwise return "date"
    return 'day' in props ? 'day' : 'date';
  } else if (unit === 'day') {
    // "day" is relative to "week"
    return 'week';
  } else if (unit === 'date') {
    // "date" is relative to "month"
    return 'month';
  } else {
    // otherwise assume normal units
    return getAdjacentUnit(unit, -1);
  }
}

function propsUnitExists(props, unit) {
  if (unit === 'day' || unit === 'date') {
    // Day level props
    return 'day' in props || 'date' in props;
  } else {
    return unit in props;
  }
}

function buildNumericComponent() {
  // Note that ISO-8601 required a "basic" format where digits run together,
  // so much stricter parsing must be followed. The year MUST be either 4 digits
  // or include a sign before or after to be allowed.
  const date = `(\\d{4}|[+-]\\d{4,6})(?:[-/.]?(\\d{1,2})(?:[-/.]?(\\d{1,2}))?)?`;
  const time = `(${REG_HOUR}${REG_DEC})(?::?(${REG_MIN}${REG_DEC}))?(?::?(${REG_SEC}))?`;
  const src = `${date}(?:[T\\s]${time})?(${REG_ZONE})?`;
  const types = [
    'year',
    'month',
    'date',
    'hour',
    'minute',
    'second',
    'timeZone',
  ];
  const groups = types.map((type) => {
    let resolver;
    if (type === 'timeZone') {
      resolver = resolveTimeZoneName;
    } else if (type === 'hour' || type === 'minute' || type === 'second') {
      resolver = resolveFraction;
    } else {
      resolver = resolveInteger;
    }
    return {
      type,
      resolver,
    };
  });
  return {
    src,
    groups,
  };
}

function resolveYear(str, opt) {
  str = str.replace(/^'/, '');
  resolveInteger(str, opt);
  if (str.length === 2) {
    const { date, absProps } = opt;
    absProps.year = getTwoDigitYear(absProps.year, date);
  }
}

function resolveTimeZoneName(str, { absProps }) {
  // Need to resolve time zone after other
  // resolvers like minute and dayPeriod.
  return (date) => {
    let offset;
    if (str === 'z' || str === 'gmt') {
      offset = 0;
    } else {
      // Handle U+2212 MINUS SIGN as well as
      // hyphen-minus as per the ISO-8601 spec.
      str = str.replace(/−/, '-');
      const match = str.match(/([+-]\d{1,2}):?(\d{2})?/);
      if (match) {
        const hour = parseInt(match[1], 10) || 0;
        const minute = parseInt(match[2], 10) || 0;
        // GMT+10:00 is negative so flip the sign.
        offset = -(hour * 60 + minute);
      }
    }
    if (offset != null) {
      absProps.timeZoneOffset = offset;
      setTimeZoneOffset(date, offset);
    }
  };
}

function resolveTimestamp(str, { absProps }) {
  return (date) => {
    const timestamp = parseInt(str, 10);
    absProps.timestamp = timestamp;
    date.setTime(timestamp);
  };
}

function resolveInteger(str, { type, absProps }) {
  let num = parseInt(str, 10);
  if (!isNaN(num)) {
    if (type === 'month') {
      num -= 1;
    }
    absProps[type] = num;
  }
}

function resolveOrdinal(str, options) {
  str = replaceOrdinals(str);
  resolveInteger(str, options);
}

function resolveFraction(arg, { type: unit, props, absProps }) {

  // Allow resolver to be called
  // from another with any props.
  props = props || absProps;

  let str;
  if (isString(arg)) {
    // Allow European style decimal comma.
    str = arg.replace(',', '.');
  } else {
    // Input may be a number.
    str = String(arg);
  }

  let val = parseFloat(str);

  props[unit] = Math.trunc(val);

  // A string of "0.0" provides insight into its specificity, even if the
  // parsed values do not affect the date, so continue on if a decimal
  // separator has been found.
  if (str.includes('.')) {

    // If a lower unit exists, then set its value as the fraction in the lower
    // unit. For example: "half a minute" -> .5 * 60 = 30 seconds. Recursively
    // resolve the fraction until all units are resolved.
    const lower = getAdjacentUnit(unit, 1);

    if (lower) {

      // Floating point errors are not acceptable here as they
      // will result smaller units being recursively set,
      // so round to 3 places here.
      val = Math.round(val % 1 * 1000) / 1000;

      // Note that we are taking the "relative" unit multiplier
      // as this is appropriate for colloquial forms. For example
      // "half a year ago" is generally accepted to mean 6 months ago,
      // even though this does not take into account leap years, etc.
      val *= getUnitMultiplier(unit, 'rel');

      resolveFraction(val, {
        props,
        type: lower,
      });
    }
  }
}

function getLanguage(locale) {
  locale = ensureLocale(locale);
  return locale.slice(0, 2);
}

// If no locale is provided then need to fall back to
// browser default. This can be done by creating a new format
// object and checking its resolvedOptions.
function ensureLocale(locale) {
  if (!locale) {
    const formatter = new Intl.DateTimeFormat();
    locale = formatter.resolvedOptions().locale;
  }
  return locale;
}

function getTwoDigitYear(year, date, prefer) {
  // Following IETF here, adding 1900 or 2000 depending on the last two digits.
  // Note that this makes no accordance for what should happen after 2050, but
  // intentionally ignoring this for now. https://www.ietf.org/rfc/rfc2822.txt
  year += year < 50 ? 2000 : 1900;
  if (prefer) {
    const delta = year - date.getFullYear();
    if (delta / Math.abs(delta) !== prefer) {
      year += prefer * 100;
    }
  }
  return year;
}

const ALTERNATE_RELATIVE_FORMATS = {
  [ENGLISH]: [
    (value, unit) => {
      if (value >= 0) {
        const s = value !== 1 ? 's' : '';
        return `${value} ${unit}${s} from now`;
      }
    },
  ],
};

const ALTERNATE_DATETIME_FORMATS = {
  default: [
    // TODO: go through formats and check they're matching what we think they should
    '<weekday><time?>',
    '<time?><weekday>',
    // "last year", "this month", "next week", "1 minute ago", "now", etc.
    '<any relative unit>',
    // "10am tomorrow", "10:30pm in 5 days", etc.
    '<time?><any relative day>',
    // "today at 10am"
    '<any relative day><time?>',
    // "next week Friday at 10:30pm" etc.
    '<relative week> <weekday><time?>',
    // All locales should parse an unambiguous numeric DateTime with
    // "-" or "/" as separators. Unambiguous here means year first and no
    // 2-digit years allowed.
    '<yyyy>[-/]<month>[-/]<day><time?>',
    // .NET Alternate JSON Date format. Yes, this looks ridiculous.
    '\\\\\\/Date\\(<timestamp>(?:[-+]\\d{4})?\\)\\\\\\/',
  ],
  [ENGLISH]: [
    // English locales should not force ambiguous numeric format (8/10 vs 10/8),
    // however they should be able to disambiguate the month when it is
    // non-numeric. Ambiguous formats will be handled individually by Intl
    // formats.
    //
    // Additionally 2-digit years should only be allwed in final position when
    // date is initial. Ambiguous 2-digit number should always be parsed as the
    // date.
    //
    // - 02-Jan-2020 (2020-01-02)
    // - 02-Jan-20   (2020-01-02)
    // - 2020-Jan-02 (2020-01-02)
    // - Jan-02      (yyyy-01-02)
    // - 02-Jan      (yyyy-01-02)
    '(?:<yyyy>-)?<Month>[-\\s]<day><time?>',
    '<day>-<Month>(?:-<year>)?<time?>',
    '<time?><yyyy>[-/]<month>[-/]<day>',
    '<time?><dayMonth>[-/]<yyyy>',
    '<day> <Month>(?: <year>)?<time?>',
    '<Month>(?: <day>)?(?: of)? <relative year>',
    'the <day>(?: of (?:<relative month>|<Month>|the month))?<time?>',
    'the <offset weekday> (?:of|in) (?:<relative month>|<Month>)(?:,? <year>)?',
    '<edge> (?:<relative upper>|<relative day>|the <unit>|<year>)',
    '<edge>(?: day)? <Weekday>',
    '<edge> <Month>(?:,? <year>)?',
    '<offset unit> (?:<relative day>|<weekday>) <time?>',
    '<Weekday>(?: of)? <relative week><time?>',
    '<Weekday>,? <day> <Month> <yyyy> <time> <timeZoneName>',
  ],
};

const DAY_PERIODS = {
  default: {
    am: {
      value: 0,
      type: 'implied',
    },
    pm: {
      value: 12,
      type: 'implied',
    },
  },
  // These will no longer be required when explicit dayPeriod format lands
  // with the exception of "midnight" which is still not handled as an
  // explicit dayPeriod. TRACK: https://github.com/tc39/ecma402/pull/346
  [ENGLISH]: {
    'noon': {
      value: 12,
      type: 'long',
    },
    'midnight': {
      value: 24,
      type: 'long',
    },
    'in the morning': {
      value: 6,
      type: 'long',
    },
    'in the evening': {
      value: 18,
      type: 'long',
    },
    'in the afternoon': {
      value: 13,
      type: 'long',
    },
    'at night': {
      value: 20,
      type: 'long',
    }
  }
};

const TOKEN_ALIASES = {
  [ENGLISH]: {
    sept: 'sep',
    tues: 'tue',
    thurs: 'thu',
    weekend: 'saturday|custom',
  },
};

const DAY_MONTH_AMBIGUOUS_LOCALES = {
  'en-CA': true,
};
