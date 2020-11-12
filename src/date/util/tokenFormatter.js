import { getOrdinalSuffix } from '../../util/ordinals';
import { getISOWeek, getISOWeekYear, getDayOfYear } from './iso';
import { getFormattedOffset } from './timezoneOffsets';
import { getQuarter } from './quarter';

export function getTokenFormatter(formatter, format) {
  const parts = formatToResolvers(format);
  assertDateTimeFormat(formatter);
  const { locale, ...contextOptions } = getFormatterContextOptions(formatter);
  return {
    format: (date) => {
      return parts
        .map((token) => {
          const { type, value } = token;
          if (type === 'token') {
            const fn = TOKEN_RESOLVERS[value];
            return fn(date, value, locale, contextOptions);
          } else {
            return token.value;
          }
        })
        .join('');
    },
  };
}

const APOS = "'";

const TOKEN_RESOLVERS = {
  ...getIntlResolvers('GGGGG', {
    type: 'era',
    resolveType: (token) => {
      switch (token.length) {
        case 5:
          return 'narrow';
        case 4:
          return 'long';
        default:
          return 'short';
      }
    },
  }),
  ...getIntlResolvers('yyyyy', {
    pad: 3,
    type: 'year',
    resolveType: (token) => {
      return token.length === 2 ? '2-digit' : 'numeric';
    },
  }),
  ...getTokenResolvers('YYYYY', {
    pad: 2,
    resolve: (date, token) => {
      let year = String(getISOWeekYear(date));
      if (token.length === 2) {
        year = year.slice(-2);
      }
      return year;
    },
  }),
  ...getTokenResolvers('QQQQQ,qqqqq', {
    resolve: (date, token) => {
      let q = String(getQuarter(date));
      if (token.length === 2) {
        q = q.padStart(2, '0');
      } else if (token.length === 3) {
        q = 'Q' + q;
      } else if (token.length === 4) {
        q += `${getOrdinalSuffix(+q)} quarter`;
      }
      return q;
    },
  }),
  ...getIntlResolvers('MMMMM,LLLLL', {
    type: 'month',
    resolveType: (token) => {
      switch (token.length) {
        case 1:
          return 'numeric';
        case 2:
          return '2-digit';
        case 3:
          return 'short';
        case 4:
          return 'long';
        case 5:
          return 'narrow';
      }
    },
    resolveOptions: (token) => {
      if (token.includes('M')) {
        return { day: 'numeric' };
      }
    },
  }),
  ...getTokenResolvers('ww', {
    pad: 2,
    resolve: (date) => {
      return String(getISOWeek(date));
    },
  }),
  ...getIntlResolvers('dd', {
    type: 'day',
    resolveType: (token) => {
      return token.length === 2 ? '2-digit' : 'numeric';
    },
  }),
  ...getTokenResolvers('DDD', {
    pad: 2,
    resolve: (date) => {
      return String(getDayOfYear(date));
    },
  }),
  ...getIntlResolvers('EEEEE,ccccc', {
    type: 'weekday',
    resolveType: (token) => {
      switch (token.length) {
        case 5:
          return 'narrow';
        case 4:
          return 'long';
        default:
          return 'short';
      }
    },
    resolveOptions: (token) => {
      if (token.includes('E')) {
        return { month: 'numeric', day: 'numeric' };
      }
    },
  }),
  ...getIntlResolvers('aaaaaa', {
    type: 'dayPeriod',
    resolveType: (token) => {
      switch (token.length) {
        case 6:
        case 5:
          return 'narrow';
        case 4:
          return 'long';
        default:
          return 'short';
      }
    },
    resolveValue: (value, token) => {
      const len = token.length;
      if (len === 5 || len === 6) {
        value = value.charAt(0);
      }
      if (len === 2 || len === 6) {
        value = value.toLowerCase();
      }
      return value;
    },
    resolveOptions: () => {
      return { hour: 'numeric', hourCycle: 'h12' };
    },
  }),
  ...getIntlResolvers('hh,HH,kk,KK', {
    type: 'hour',
    resolveType: (token) => {
      return token.length === 2 ? '2-digit' : 'numeric';
    },
    resolveValue: (value, token) => {
      if (token === 'H' || token === 'k') {
        value = String(+value);
      }
      return value;
    },
    resolveOptions: (token) => {
      const first = token.charAt(0);
      let hourCycle;
      if (first === 'h') {
        hourCycle = 'h12';
      } else if (first === 'H') {
        hourCycle = 'h23';
      } else if (first === 'k') {
        hourCycle = 'h24';
      } else if (first === 'K') {
        hourCycle = 'h11';
      }
      return { hourCycle };
    },
  }),
  ...getIntlResolvers('mm', {
    type: 'minute',
    resolveType: (token) => {
      return token.length === 2 ? '2-digit' : 'numeric';
    },
  }),
  ...getIntlResolvers('ss', {
    type: 'second',
    resolveType: (token) => {
      return token.length === 2 ? '2-digit' : 'numeric';
    },
    resolveOptions: (token) => {
      if (token.length === 2) {
        // Required for 2-digit seconds to return a padded number. Possible bug?
        return { minute: 'numeric' };
      }
    },
  }),
  ...getTokenResolvers('SSS', {
    pad: 2,
    resolve: (date) => {
      return String(date.getMilliseconds());
    },
  }),
  ...getIntlResolvers('zzzz', {
    type: 'timeZoneName',
    resolveType: (token) => {
      return token.length === 4 ? 'long' : 'short';
    },
  }),
  ...getTokenResolvers('ZZZZZ,OOOO', {
    resolve: (date, token) => {
      let format;
      if (token.includes('Z')) {
        if (token.length === 4) {
          format = 'gmt-long';
        } else if (token.length === 5) {
          format = 'iso-extended';
        } else {
          format = 'iso-basic';
        }
      } else {
        if (token.length === 1) {
          format = 'gmt-short';
        } else if (token.length === 4) {
          format = 'gmt-long';
        } else {
          return token;
        }
      }
      return getFormattedOffset(date, format);
    },
  }),
};

function getIntlResolvers(str, opt) {
  const { type, resolveType, resolveValue, resolveOptions, ...rest } = opt;
  const resolve = (date, token, locale, contextOptions) => {
    const formatter = new Intl.DateTimeFormat(locale, {
      ...contextOptions,
      ...(resolveOptions && resolveOptions(token)),
      [type]: resolveType(token),
    });
    const parts = formatter.formatToParts(date);
    const part = parts.find((p) => p.type === type);
    const value = part ? part.value : '';
    return resolveValue ? resolveValue(value, token, part, parts) : value;
  };
  return getTokenResolvers(str, {
    ...rest,
    resolve,
  });
}

function getTokenResolvers(str, options) {
  const resolver = getTokenResolver(options);
  const tokens = str.split(',');
  const resolvers = {};
  for (let token of tokens) {
    for (let i = 1; i <= token.length; i++) {
      const t = token.slice(0, i);
      resolvers[t] = resolver;
    }
  }
  return resolvers;
}

function getTokenResolver(options) {
  const { pad, resolve } = options;
  return (date, token, locale, contextOptions) => {
    let value = resolve(date, token, locale, contextOptions);
    if (pad && token.length >= pad) {
      value = value.padStart(token.length, '0');
    }
    return value;
  };
}

function formatToResolvers(str) {
  let i = 0;
  let type;
  let buffer = '';
  let escaped = false;
  const resolvers = [];
  while (i < str.length) {
    const next = str.charAt(i);
    if (next === APOS) {
      if (str.charAt(i + 1) === APOS) {
        buffer += next;
      }
      escaped = !escaped;
      type = 'literal';
    } else if (escaped) {
      buffer += next;
    } else {
      if (TOKEN_RESOLVERS[buffer + next]) {
        buffer += next;
      } else {
        // Flush buffer if next does not exist
        flushBuffer(buffer, type, resolvers);
        buffer = next;
      }
      type = next in TOKEN_RESOLVERS ? 'token' : 'literal';
    }
    i++;
  }
  flushBuffer(buffer, type, resolvers);
  return resolvers;
}

function flushBuffer(str, type, resolvers) {
  if (str) {
    resolvers.push({
      type,
      value: str,
    });
  }
}

function assertDateTimeFormat(formatter) {
  if (!(formatter instanceof Intl.DateTimeFormat)) {
    throw new TypeError('Tokenized formatting requires Intl.DateTimeFormat');
  }
}

const CONTEXT_OPTIONS = [
  'locale',
  'calendar',
  'numberingSystem',
  'localeMatcher',
  'formatMatcher',
  'timeZone',
];

// Extracts contextual options from the formatter. "contextual" here means that
// the should only affect the returned values themselves, not the parts included
// as this may affect the resulting format when tokenized.
function getFormatterContextOptions(formatter) {
  const result = {};
  const resolvedOptions = formatter.resolvedOptions();
  for (let name of CONTEXT_OPTIONS) {
    result[name] = resolvedOptions[name];
  }
  return result;
}
