// Handle normalization of input props for updating date.

const ALIASES = {
  years: 'year',
  months: 'month',
  weekday: 'day',
  weeks: 'week',
  days: 'day',
  hours: 'hour',
  minutes: 'minute',
  seconds: 'second',
  milliseconds: 'millisecond',
  ms: 'millisecond',
};

const SHORTCUT_REG = /^(-?\d+(?:\.\d+)?) (year|month|week|day|hour|minute|(?:milli)?second)s?$/;

const FRACTIONAL_UNITS = {
  'date': {
    unit: 'hour',
    mult: 24,
  },
  'day': {
    unit: 'hour',
    mult: 24,
  },
  'hour': {
    unit: 'minute',
    mult: 60,
  },
  'minute': {
    unit: 'second',
    mult: 60,
  },
  'second': {
    unit: 'millisecond',
    mult: 1000,
  },
  'millisecond': {
    mult: 1,
  }
};

export function normalizeProps(props) {
  const normalized = {};
  for (let [unit, val] of Object.entries(props)) {
    unit = getNormalizedUnit(unit);
    normalizeFractionalUnit(normalized, unit, val);
  }
  return normalized;
}

export function getPropsFromString(str) {
  const match = str.match(SHORTCUT_REG);
  if (!match) {
    throw new TypeError(`Invalid input ${str}.`);
  }
  const props = {};
  normalizeFractionalUnit(props, match[2], parseFloat(match[1]));
  return props;
}

function normalizeFractionalUnit(props, unit, val) {
  if (unit in FRACTIONAL_UNITS) {
    const fraction = val % 1;
    if (fraction) {
      const { unit: fUnit, mult } = FRACTIONAL_UNITS[unit];
      if (fUnit) {
        props[fUnit] = Math.round(fraction * mult);
        // Truncate 5 in 5.5 hours.
        val = Math.trunc(val);
      } else {
        // Round milliseconds.
        val = Math.round(val);
      }
    }
  }
  props[unit] = val;
}

function getNormalizedUnit(unit) {
  return ALIASES[unit] || unit;
}
