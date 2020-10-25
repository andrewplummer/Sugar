import { updateDate } from './update';
import { advanceDate } from './shift';
import { setWeekday } from './weekdays';
import { setTimeZoneOffset, setIANATimeZone } from './timeZone';
//import { parseLocaleNumber } from './numbering';
import { isNaN } from '../../util/typeChecks';
import { cloneDate } from '../../util/date';
import { UNITS, getPropsSpecificity, getAdjacentUnit, formatPartsForUnit } from './units';
import { ENGLISH_NUMERALS, parseLocaleNumber } from './numbering';

const NUM_TOKEN = 'NUM';
const ENGLISH = 'en';

// Hour 0-29 parseable to support some
// locales that allow hours to overshoot.
const REG_HOUR = '[012]?[0-9]';

// Minutes 0-59 parseable.
const REG_MIN = '[0-5]\\d';

// Seconds 0-60 parseable to allow
// for leap seconds in ISO-8601 spec.
const REG_SEC_NUMERIC = `${REG_MIN}|60`;

// Parses decimal fractions with period or comma separator.
const REG_DEC = '(?:[.,]\\d+)?';

// Milliseconds are not part of Intl spec,
// so most seconds are parsed as fractional.
const REG_SEC = `(?:${REG_SEC_NUMERIC})${REG_DEC}`;

// Timezone suffix like "Z" in ISO-8601, "GMT+09:00", or just "GMT"
const REG_ZONE = `Z|GMT|(?:GMT)?[+−-]\\d{1,2}(?::?${REG_MIN})?(?:\\s\\(.+\\))?`;

// Matches 1-2 digits with optional ordinal suffix like
// 1st, 2nd, 3rd, 4th, 24th, etc. up to 100.
const REG_ORDINAL = '[^1]?(?:1st|2nd|3rd|[04-9]th)|1[0-9]th|\\d{1,2}';

const TIME_TYPES = ['hour', 'minute', 'second', 'dayPeriod'];

const REF_DATE = new Date(2020, 0);

// Numeric components apply to all locales
const NUMERIC_COMPONENT = buildNumericComponent();

export default class LocaleParser {

  constructor(locale, options) {
    this.locale = ensureLocale(locale);
    this.language = getLanguage(locale);
    this.options = options;

    this.formats = [];
    this.tokens = {};

    this.setup();
    this.buildFormats();
  }

  setup() {
    this.buildEras();
    this.buildUnits();
    this.buildDayPeriods();
    this.buildTimeComponent();
    this.buildRelativePhrases();
    this.buildMonths();
    this.buildWeekdays();
  }

  buildFormats() {
    this.buildIntlFormats();
    this.buildTimeFormats();
    this.buildNumericFormats();
    this.buildRelativeFormats();
    this.buildAlternateFormats();
  }

  buildMonths() {
    this.months = this.buildTokenSet('month', 0, 11, (date, val) => {
      date.setMonth(val);
    });
    this.buildRelativeUnitPhrases('year', 'month', this.months.long);
  }

  buildWeekdays() {
    this.weekdays = this.buildTokenSet('weekday', 5, 11, (date, val) => {
      date.setDate(val);
    });
    this.buildRelativeUnitPhrases('week', 'day', this.weekdays.long);
  }

  buildDayPeriods() {
    this.dayPeriods = this.buildTokenSet('dayPeriod', 0, 1, (date, val) => {
      date.setHours(val ? 12 : 0);
    });
  }

  getDayPeriodSource() {
    return this.getAbbreviatedTokenSource(this.dayPeriods);
  }

  getEraSource() {
    return this.getAbbreviatedTokenSource(this.eras);
  }

  buildEras() {
    this.eras = this.buildTokenSet('era', 0, 1, (date, val) => {
      date.setFullYear(val ? 1 : -1);
    });
  }

  buildTokenSet(type, min, max, fn) {
    let long = this.getTokensForStyle('long', type, min, max, fn);
    let short = this.getTokensForStyle('short', type, min, max, fn);
    let tokens = [...long];
    if (long[0] !== short[0]) {
      tokens = [...long, ...short];
    }
    const source = [];
    const normalized = [];
    for (let token of tokens) {

      // Force am/pm abbreviations for locales
      // that do not include them in formatToParts.
      if (token === 'am' || token === 'pm') {
        token = `${token.charAt(0)}.${token.charAt(1)}.`;
      }

      source.push(token.replace(/\./g, '\\.?'));
      normalized.push(token.replace(/\./g, ''));
    }
    return {
      long,
      short,
      source,
      normalized,
    };
  }

  getTokensForStyle(style, type, min, max, fn) {
    const date = cloneDate(REF_DATE);
    const formatter = new Intl.DateTimeFormat(this.locale, {
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h12',
      [type]: style,
    });
    const result = [];
    for (let i = min; i <= max; i++) {
      fn(date, i);
      const parts = formatter.formatToParts(date);
      const part = parts.find((p) => {
        return p.type === type;
      });
      result.push(part.value.toLowerCase());
    }
    return result;
  }

  buildIntlFormats() {
    this.buildIntlFormat({
      year: 'numeric',
      month: 'long',
    });
    this.buildIntlFormat({
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

    this.buildIntlFormat({
      year: 'numeric',
      month: 'numeric',
    });

    // Format 8/10 is "August 12th" in en-US and "October 10" in en-GB,
    // however it is ambiguous in "en-CA" so should not be parseable here.
    if (!dayMonthIsAmbiguous(this.locale)) {
      this.buildIntlFormat({
        month: 'numeric',
        day: 'numeric',
      });
    }

    this.buildIntlFormat({
      day: 'numeric',
      year: 'numeric',
      month: 'long',
      weekday: 'long',
      timeZoneName: 'long',
    });
    this.buildIntlFormat({
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      era: 'short',
    });
    this.buildIntlFormat({
      month: 'long',
    });
    this.buildIntlFormat({
      weekday: 'long',
    });
  }

  buildTimeFormats() {
    this.buildFormat(this.timeComponent);
  }

  buildIntlFormat(options) {
    this.buildFormat(this.getIntlComponent(this.locale, options));
  }

  buildNumericFormats() {
    this.buildFormat(NUMERIC_COMPONENT);
  }

  buildFormat(format) {
    const { src, groups } = format;
    const reg = this.buildRegExp(src);
    const exists = this.formats.some((f) => {
      return f.reg.source === reg.source;
    });

    // Only push the format if an identical one does not exist. This may occur
    // with alternate formats that ensure both versions of locale variants can
    // be correctly parsed, for example "October 12th" vs "12 October".
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
    if ('day' in options || 'weekday' in options) {
      // If a day is specified in the format then add "hour" which will be
      // replaced with an optional time format in the resulting component.
      options = {
        ...options,
        hour: 'numeric',
      };
    }
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.formatToParts().map((part) => {
      const { type, value } = part;
      const style = options[type];
      return {
        type,
        value,
        style,
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
      let { type, value, optional = false, fixed = false, relative = false } = part;
      if (type === 'literal') {
        value = value.replace(/[.,\s]+/, '[.,\\s]*');
        value = value.replace(/[-/]+/, '[-./]+');
        src += value;
      } else if (type === 'source') {
        src += value;
      } else if (type === 'time') {
        const { src: timeSrc, groups: timeGroups } = this.getTimeComponent(part, parts);
        src += timeSrc;
        groups = [...groups, ...timeGroups];
      } else {
        let resolver;
        if (relative) {
          resolver = this.resolveRelativePhrase;
          src += `(${this.getRelativePhraseSource(type, fixed)})`;
        } else {
          if (type === 'year') {
            // Generic year token may be allowed to be 2-digits without an
            // apostrophe only if both day and month tokens are also specified.
            const dayPart = findPart(parts, 'day');
            const monthPart = findPart(parts, 'month');
            const apos = dayPart && monthPart ? "'?" : "'";
            src += `(\\d{4,6}|${apos}\\d{2})`;
            resolver = resolveYear;
          } else if (type === 'yyyy') {
            // A yyyy token is required to be between 4 and 6 digits.
            type = 'year';
            src += `(\\d{4,6})`;
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
          } else if (type === 'offset weekday') {
            // the 1st Sunday of next month
            src += `((?:${REG_ORDINAL}) (?:${this.getWeekdaySource()}))`;
            resolver = this.resolveOffsetWeekday;
          } else if (type === 'offset') {
            // English only: "the day after tomorrow" etc.
            // The tokens "before", "after", "from" cannot be derived from Intl
            // which makes multi-lingual support for this too difficult for now.
            const nums = `\\d+|the|${ENGLISH_NUMERALS.join('|')}`;
            const units = `days?|weeks?|months?|years?`;
            const dirs = 'before|after|from';
            src += `((?:${nums}) (?:${units}) (?:${dirs}))`;
            resolver = this.resolveOffsetUnit;
          } else if (type === 'day') {
            type = 'date';
            resolver = resolveInteger;
            const monthPart = findPart(parts, 'month');
            if (this.language === ENGLISH && !this.isNumericPart(monthPart)) {
              src += `(${REG_ORDINAL})`;
            } else {
              src += '(\\d{1,2})';
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
            resolver = resolveDecimalTime;
          } else if (type === 'dayPeriod') {
            src += `\\s?(${this.dayPeriods.source.join('|')})\\s?`;
            resolver = this.resolveDayPeriod;
          } else if (type === 'timeZoneName') {
            src += `(${REG_ZONE})?`;
            resolver = resolveTimeZoneName;
          } else if (type === 'era') {
            src += `\\s?(${this.eras.source.join('|')})\\s?`;
            resolver = this.resolveEra;
          } else if (type === 'timestamp') {
            src += '(\\d+)';
            resolver = resolveTimestamp;
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
    // formats we must avoid parsing a single integer. Approach here is to
    // create alternate groups that make the day period required when no minutes
    // are specified, otherwise allow optional seconds and trailing dayPeriod
    // when last. Potential formats include:
    //
    // When day period is last:
    //
    // - 12pm
    // - 12:00pm
    // - 12:00:00pm
    // - 12:00:00.000pm
    // - 12:00
    // - 12:00:00
    // - 12:00:00.000
    //
    // When day period is first:
    //
    // - 午後12時
    // - 午後12時0分
    // - 午後12:00
    // - 午後12:00:00
    // - 午後12:00:00.000
    // - 12:00
    // - 12:00:00
    // - 12:00:00.000
    //
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
      resolver: resolveDecimalTime,
    };
    const dayPeriodGroup = {
      type: 'dayPeriod',
      resolver: this.resolveDayPeriod,
    };
    let dp = this.dayPeriods.source.join('|');
    let src;
    let groups;
    if (this.partOrderMatches('hour', 'dayPeriod')) {
      src = `(${REG_HOUR})(?:\\s?(${dp})|(?::(${REG_MIN})?(?::(${REG_SEC}))?\\s?(${dp})?))`;
      groups = [
        hourGroup,
        dayPeriodGroup,
        minuteGroup,
        secondGroup,
        dayPeriodGroup,
      ];
    } else {
      src = `(${dp})?(${REG_HOUR}):(${REG_MIN})?(?::(${REG_SEC}))?|(${dp})(${REG_HOUR})`;
      groups = [
        dayPeriodGroup,
        hourGroup,
        minuteGroup,
        secondGroup,
        dayPeriodGroup,
        hourGroup,
      ];
    }
    this.timeComponent = {
      src,
      groups,
    };
  }

  getTimeComponent(part, parts) {
    // Greedily accept any non-digit separator between time boundaries
    // that Intl does not provide access to, for example:
    //
    // - "tomorrow at 10:00 AM"
    // - "mañana a las 10:00 AM"
    //
    // To do this we need to find adjacent non-literal parts that are
    // of either type "day" or "weekday'.
    parts = parts.filter((part) => {
      return part.type !== 'literal' && part.type !== 'source';
    });
    const index = parts.indexOf(part);
    const lastIsDay = this.isDayPart(parts[index - 1]);
    const nextIsDay = this.isDayPart(parts[index + 1]);

    const words = '\\D*';
    const space = '\\s*';
    const sep1 = lastIsDay ? words : space;
    const sep2 = nextIsDay ? words : space;
    let { src, groups } = this.timeComponent;
    src = `(?:${sep1}${src}${sep2})?`;
    return {
      src,
      groups,
    };
  }

  partOrderMatches(type1, type2) {
    // TODO: document
    // Time components assume....
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
    const collapsed = [];
    let isTime = false;
    for (let part of parts) {
      const { type } = part;
      if (TIME_TYPES.includes(type)) {
        if (!isTime) {
          collapsed.push({
            type: 'time',
          });
          isTime = true;
        }
      } else if (type === 'literal') {
        if (!isTime) {
          collapsed.push(part);
        }
      } else {
        collapsed.push(part);
        isTime = false;
      }
    }
    return collapsed;
  }

  isNumericPart(part) {
    if (!part) {
      return false;
    }
    const { style } = part;
    return style === 'numeric' || style === '2-digit';
  }

  isDayPart(part) {
    if (!part) {
      return false;
    }
    const { type } = part;
    return type === 'day' || type === 'weekday';
  }

  buildRelativePhrases() {
    const formatters = this.getRelativeFormatters();
    const phrases = {};
    for (let unit of UNITS) {
      if (unit !== 'millisecond') {
        for (let formatter of formatters) {
          for (let num = -5; num < 5; num++) {
            let str = formatter.format(num, unit);
            if (str) {
              let isFixed = true;
              str = str.replace(/\d+/, () => {
                isFixed = false;
                return NUM_TOKEN;
              });

              let phrase;
              if (isFixed) {
                phrase = {
                  unit,
                  value: num,
                };
              } else {
                const dir = Math.max(-1, Math.min(1, num));
                phrase = {
                  dir,
                  unit,
                };
              }
              phrases[str] = phrase;
            }
          }
        }
      }
    }
    this.relativePhrases = phrases;
  }

  buildUnits() {
    const units = {};
    for (let unit of UNITS) {
      if (unit !== 'millisecond') {
        for (let num = -5; num < 5; num++) {
          const parts = formatPartsForUnit(num, unit, this.locale);
          const part = parts.find((part) => part.type === 'unit');
          if (part) {
            units[part.value] = unit;
          }
        }
      }
    }
    this.units = units;
  }

  buildRelativeFormats() {
    this.buildRelativePhraseFormat();
  }

  buildRelativePhraseFormat() {
    this.buildFormat(this.getRelativePhraseComponent());
  }

  buildRelativeUnitPhrases(relUnit, absUnit, arr) {
    const reg = RegExp(this.getUnits(relUnit).join('|'));
    for (let phrase of this.getRelativePhrases(relUnit, true)) {
      const { unit, value } = this.relativePhrases[phrase];
      for (let i = 0; i < arr.length; i++) {
        const key = phrase.replace(reg, arr[i]);
        this.relativePhrases[key] = {
          unit,
          value,
          absUnit,
          absValue: i
        };
      }
    }
  }

  buildRegExp(src) {
    return RegExp(`^${src}$`, 'i');
  }

  buildAlternateFormats() {
    const formats = [
      ...ALTERNATE_DATETIME_FORMATS['default'],
      ...(ALTERNATE_DATETIME_FORMATS[this.locale] || []),
      ...(ALTERNATE_DATETIME_FORMATS[this.language] || []),
      ...(this.options.dateTimeFormats || []),
    ];
    for (let format of formats) {
      const parts = compilePartsFromFormat(format);
      const component = this.getComponentFromParts(parts);
      this.buildFormat(component);
    }
  }

  getRelativeFormatters() {
    return [
      new Intl.RelativeTimeFormat(this.locale, {
        numeric: 'auto',
      }),
      new Intl.RelativeTimeFormat(this.locale, {
        numeric: 'always',
      }),
      ...(this.options.relativeFormats || []),
      ...this.getAlternateRelativeFormats(),
    ];
  }

  getAlternateRelativeFormats() {
    const formats = [
      ...(ALTERNATE_RELATIVE_FORMATS[this.locale] || []),
      ...(ALTERNATE_RELATIVE_FORMATS[this.language] || []),
    ];
    return formats.map((fn) => {
      return { format: fn };
    });
  }

  getMonthSource() {
    return this.getTokensWithAlternates(
      this.months.source,
      SHORT_MONTH_ALTERNATES
    ).join('|');
  }

  getWeekdaySource() {
    return this.getTokensWithAlternates(
      this.weekdays.source,
      SHORT_WEEKDAY_ALTERNATES
    ).join('|');
  }

  getTokensWithAlternates(arr, obj) {
    const alt = obj[this.language];
    const alternates = alt ? Object.keys(alt) : [];
    return [...arr, ...alternates];
  }

  getRelativePhraseComponent() {
    return {
      src: `(${this.getRelativePhraseSource()})`,
      groups: [
        {
          resolver: this.resolveRelativePhrase,
          relative: true,
        },
      ],
    };
  }

  getRelativePhraseSource(unit, fixed) {
    let src = compileRegExpAlternates(this.getRelativePhrases(unit, fixed));
    return src.replace(/NUM/g, this.getArticles() ? '\\w+' : '\\d+');
  }

  getRelativePhrases(type, fixed) {
    let phrases = Object.keys(this.relativePhrases);
    if (type) {
      phrases = phrases.filter((key) => {
        const { unit, absUnit } = this.relativePhrases[key];
        return unit === type || absUnit === type;
      });
    }
    if (fixed) {
      phrases = phrases.filter((key) => {
        return 'value' in this.relativePhrases[key];
      });
    }
    return phrases;
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

  getArticles() {
    return ARTICLES[this.language];
  }

  resolveMonth(str, opt) {
    const { absProps } = opt;
    resolveInteger(str, opt);
    if (!('month' in absProps)) {
      str = str.replace(/\./g, '');
      str = this.resolveShortAlternate(str, SHORT_MONTH_ALTERNATES);
      absProps.month = this.months.normalized.indexOf(str) % 12;
    }
  }

  resolveWeekday(str, { absProps }) {
    str = str.replace(/\./g, '');
    str = this.resolveShortAlternate(str, SHORT_WEEKDAY_ALTERNATES);
    absProps.day = this.weekdays.normalized.indexOf(str) % 7;
  }

  resolveShortAlternate(str, obj) {
    const alt = obj[this.language];
    if (alt && alt[str]) {
      str = alt[str];
    }
    return str;
  }

  resolveOffsetWeekday(str) {
    // An offset weekday such as "the 2nd Wednesday of February" implies a
    // weekday relative to the resolved month, so return a function here to
    // allow other units to be resolved before checking against the current
    // day and setting accordingly.
    return (date) => {
      const [ordinal, weekday] = str.split(' ');
      const mult = parseInt(ordinal, 10) - 1;
      let day = this.weekdays.normalized.indexOf(weekday) % 7;
      if (day < date.getDay()) {
        day += 7;
      }
      if (mult) {
        day += 7 * mult;
      }
      setWeekday(date, day);
    };
  }

  // English only
  resolveOffsetUnit(str) {
    return (date, absProps, relProps) => {
      let [num, unit, dir] = str.split(' ');
      num = parseLocaleNumber(num, this.language) || 1;
      unit = unit.replace(/s$/, '');
      num *= dir === 'before' ? -1 : 1;
      advanceDate(date, {
        [unit]: num,
      });
      relProps[unit] = (relProps[unit] || 0) + num;
    };
  }

  resolveDayPeriod(str, { absProps }) {
    // The day period (am/pm) may appear before or after the hour, so need to
    // allow all resolvers to be called first, then advance the absolute hour
    // if it is set.
    return (date) => {
      str = str.replace(/\./g, '');
      const index = this.dayPeriods.normalized.indexOf(str);
      const pm = index % 2 === 1;
      let hour = date.getHours();
      if (pm && hour > 0 && hour < 12) {
        hour += 12;
        absProps.hour = hour;
        date.setHours(hour);
      }
    };
  }

  resolveEra(str) {
    // Era requires that the year first be set so return a post resolver here.
    return (date) => {
      str = str.replace(/\./g, '');
      const index = this.eras.normalized.indexOf(str);
      const bc = index % 2 === 0;
      const year = date.getFullYear();
      if (bc && year > 0) {
        date.setFullYear(-year);
      }
    };
  }

  resolveRelativePhrase(str, { relProps, absProps }) {
    let value;
    let phrase = this.relativePhrases[str];
    if (phrase) {
      // Fixed phrases such as "tomorrow", etc. have an associated
      // fixed value so simply set it here.
      value = phrase.value;
    } else {
      // Non-fixed phrases such as "5 days from now", etc. require normalizing
      // the phrase and parsing the value from the matched string, then applying
      // the implied direction, such as -1 for "ago", etc.
      // in an hour replace
      // in a week
      // a week ago
      str = str.replace(/\d+/, (match) => {
        value = parseInt(match, 10);
        return NUM_TOKEN;
      });
      phrase = this.relativePhrases[str];
      if (!phrase) {
        // Attempt to replace articles as a fallback as we don't want
        // to replace them in a string that already has a numeric format.
        const articles = this.getArticles();
        if (articles) {
          str = str.replace(RegExp(articles), () => {
            value = 1;
            return NUM_TOKEN;
          });
          phrase = this.relativePhrases[str];
        }
      }
    }
    if (phrase) {
      const { unit, dir, absUnit, absValue } = phrase;
      if (dir != null) {
        value *= phrase.dir;
      }
      relProps[unit] = value;
      if (absUnit) {
        absProps[absUnit] = absValue;
      }
    }
  }

  parse(str, options) {
    // Parsing is case insensitive so normalize string
    // to lowercase so that tokens are correctly matched.
    str = str.trim().toLowerCase();
    for (let format of this.formats) {
      const { reg, groups } = format;
      const match = str.match(reg);
      if (match) {
        const { past = false, future = false, explain = false, timeZone } = options;
        const preference = (-past + future);
        const date = new Date();
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
            }
          }
        }
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
      resolver = resolveDecimalTime;
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

function compilePartsFromFormat(str) {
  function flush() {
    if (buffer) {
      if (isToken) {
        let type = buffer;
        let style = 'numeric';
        let fixed = false;
        let relative = false;
        let optional = false;
        type = type.replace(/^[A-Z]/, (str) => {
          style = 'long';
          return str.toLowerCase();
        });
        type = type.replace(/^relative /, () => {
          style = 'long';
          relative = true;
          return '';
        });
        type = type.replace(/^fixed /, () => {
          style = 'long';
          fixed = true;
          return '';
        });
        type = type.replace(/\?$/, () => {
          optional = true;
          return '';
        });
        parts.push({
          type,
          style,
          fixed,
          relative,
          optional,
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

function resolveDecimalTime(str, { type, absProps }) {
  str = str.replace(',', '.');
  const num = parseFloat(str);
  absProps[type] = Math.trunc(num);

  // Allow setting zero as this will
  // resolve the specificity later.
  if (str.includes('.')) {
    let dec = num % 1;
    let unit;
    if (type === 'hour') {
      unit = 'minute';
      dec *= 60;
    } else if (type === 'minute') {
      unit = 'second';
      dec *= 60;
    } else if (type === 'second') {
      unit = 'millisecond';
      dec *= 1000;
    }
    absProps[unit] = Math.round(dec);
  }
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
    '<weekday><time?>',
    '<time?><weekday>',
    '<relative day> <time>',
    '<time> <relative day>',
    '<relative week> <weekday><time?>',
    // All locales should parse an unambiguous numeric DateTime with
    // "-" or "/" as separators. Unambiguous here means year first and no
    // 2-digit years allowed.
    '<year>[-/]<month>[-/]<day> <time?>',
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
    '<day> <Month>[.,]* <year><time?>',
    '<Month>(?: of)? <relative year>',
    'the <day>(?: of (?:<relative month>|<Month>|the month))?',
    'the <offset weekday> of <relative month>',
    '<offset> <relative fixed day>',
    '<offset> <weekday>',
    '<Weekday>(?: of)? <relative week>',
    '<Weekday>,? <day> <Month> <yyyy>(?:<time>(?:<timeZoneName>)?)?', // IETF
  ],
};

const SHORT_MONTH_ALTERNATES = {
  [ENGLISH]: {
    sept: 'sep',
  },
};

const SHORT_WEEKDAY_ALTERNATES = {
  [ENGLISH]: {
    tues: 'tue',
    thurs: 'thu',
  },
};

const ARTICLES = {
  [ENGLISH]: 'an?|the',
};

function dayMonthIsAmbiguous(locale) {
  return DAY_MONTH_AMBIGUOUS_LOCALES[locale] || false;
}

const DAY_MONTH_AMBIGUOUS_LOCALES = {
  'en-CA': true,
};

// Compiles optimized regex alternates from an array.
// Expected input is relatively well structured, for example:
//
// 1. "NUM days ago", "NUM months from now", "in NUM weeks", etc.
// 2. "NUM 日前", "NUM ヶ月後", "NUM 週前", etc.
//
// Basic approach:
//
// - Group by length of space-split token array.
// - Build a simple trie of tokens for each group of the same length.
// - Traverse once into the trie to take top-level branches as separate.
// - Traverse further until there is a divergence.
// - At the first divergence begin walking the trie building up unique
//   token sets for every level.
// - Push all sub-level token sets as non-capturing groups.
//
// Notes:
//
// - Grouping by length avoids complexity of dealing with non-required
//   groups. This could be optimized further but works well for this data
//   set and produces an easily readable regex.
//
// - Traversing once into the trie at the top level produces better results
//   for this data set as past/future formats usually diverge at the first token
//   but not after that until the unit is encountered.
//
// - Assuming sub-level tokens apply to all branches at the point of divergence
//   may result in false positive matches, however this is acceptable for the
//   purpose of greedy date parsing here.
//
// - CJK languages like Japanese and Chinese do not benefit as much as they do
//   not use spaces but tend to be more structured anyway, so this method still
//   works well.
//
// - Further optimization may be possible by recursive grouping on common
//   prefixes/suffixes from both ends, however it adds significant complexity
//   and could potentially result in incorrectly slicing non-BMP tokens. Using
//   spaces as a separator splits the difference and produces generally good
//   results for date formats.
function compileRegExpAlternates(arr) {
  return Object.values(groupTokensByLength(arr))
    .map((group) => {
      const trie = buildTokenTrie(group);
      return Object.entries(trie)
        .map(([key, branch]) => {
          const tokens = [key];
          let keys = Object.keys(branch);
          while (keys.length === 1) {
            tokens.push(keys[0]);
            branch = branch[keys[0]];
            keys = Object.keys(branch);
          }
          if (keys.length > 1) {
            const sets = [];
            walkTrie(branch, (key, level) => {
              let set = sets[level];
              if (!set) {
                set = sets[level] = new Set();
              }
              set.add(key);
            });
            for (let set of sets) {
              tokens.push(getNonCapturingGroup(Array.from(set)));
            }
          }
          return tokens.join(' ');
        })
        .join('|');
    })
    .join('|');
}

function groupTokensByLength(arr) {
  const groups = {};
  for (let str of arr) {
    const tokens = str.split(' ');
    const len = tokens.length;
    let group = groups[len];
    if (!group) {
      group = groups[len] = [];
    }
    group.push(tokens);
  }
  return groups;
}

function buildTokenTrie(arr) {
  const trie = {};
  for (let tokens of arr) {
    let branch = trie;
    for (let token of tokens) {
      if (!branch[token]) {
        branch[token] = {};
      }
      branch = branch[token];
    }
  }
  return trie;
}

function walkTrie(trie, fn, level = 0) {
  for (let [key, branch] of Object.entries(trie)) {
    fn(key, level);
    walkTrie(branch, fn, level + 1);
  }
}

function getNonCapturingGroup(arr) {
  let src = arr.join('|');
  if (arr.length > 1) {
    src = `(?:${src})`;
  }
  return src;
}
