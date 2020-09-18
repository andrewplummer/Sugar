// Handle normalization of input props for updating date.

const ALIASES = {
  years: 'year',
  months: 'month',
  weekday: 'day',
  weeks: 'week',
  days: 'day',
  hour: 'hours',
  minute: 'minutes',
  second: 'seconds',
  millisecond: 'milliseconds',
  ms: 'milliseconds',
};

const SHORTCUT_REG = /^(-?\d+(?:\.\d+)?) (year|month|week|day|hour|minute|(?:milli)?second)s?$/;

const FRACTIONAL_UNITS = {
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
  }
};

export function normalizeProps(props) {
  const normalized = {};
  for (let [unit, val] of Object.entries(props)) {
    unit = getNormalizedUnit(unit);
    normalized[unit] = val;
  }
  // Prioritize "date" over "day" when there is a conflict.
  if (normalized.date && normalized.day) {
    delete normalized.day;
  }
  return normalized;
}

export function getPropsFromString(str) {
  const match = str.match(SHORTCUT_REG);
  if (!match) {
    throwInvalidFormat(str);
  }
  const params = {};
  let val = parseFloat(match[1]);
  const unit = match[2];
  const fraction = val % 1;
  if (fraction !== 0) {
    const fUnit = FRACTIONAL_UNITS[unit];
    if (!fUnit) {
      throwInvalidFormat(str);
    }
    params[fUnit.unit] = Math.round(fraction * fUnit.mult);
    val = Math.trunc(val);
  }
  params[unit] = val;
  return params;
}

function throwInvalidFormat(str) {
  throw new TypeError(`Invalid input ${str}.`);
}

function getNormalizedUnit(unit) {
  return ALIASES[unit] || unit;
}
