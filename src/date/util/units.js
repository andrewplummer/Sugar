import { isFunction } from '../../util/typeChecks';
import { getDaysInMonth } from './helpers';

const YEAR_AVG_DAYS = 365.2425;
const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export const UNITS = [
  'year',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
  'millisecond',
];

// Note that years, months, weeks, and days may have 1 hour less in DST
// timezones when a fallback shift occurs.
const UNIT_MULTIPLIERS = {
  year: {
    avg: YEAR_AVG_DAYS * 24 * 60 * 60 * 1000,
    min: 365 * 24 * 60 * 60 * 1000 - HOUR_IN_MS,
  },
  month: {
    avg: YEAR_AVG_DAYS / 12 * 24 * 60 * 60 * 1000,
    min: 28 * DAY_IN_MS - HOUR_IN_MS,
  },
  week: {
    avg: 7 * 24 * 60 * 60 * 1000,
    min: 7 * DAY_IN_MS - HOUR_IN_MS,
  },
  day: {
    avg: 24 * 60 * 60 * 1000,
    min: DAY_IN_MS - HOUR_IN_MS,
  },
  hour: {
    avg: HOUR_IN_MS,
  },
  minute: {
    avg: 60 * 1000,
  },
  second: {
    avg: 1000,
  },
  millisecond: {
    avg: 1,
  },
};

const UNIT_EDGES = {
  month: {
    start: 0,
    end: 11,
  },
  date: {
    start: 1,
    end: (date) => {
      return getDaysInMonth(date);
    }
  },
  hour: {
    start: 0,
    end: 23,
  },
  minute: {
    start: 0,
    end: 59,
  },
  second: {
    start: 0,
    end: 59,
  },
  millisecond: {
    start: 0,
    end: 999,
  },
};

export function getUnitMultiplier(unit, min = false) {
  const mult = UNIT_MULTIPLIERS[normalizeDate(unit)];
  return mult[min ? 'min' : 'avg'] || mult['avg'];
}

export function getUnitIndex(unit) {
  if (!unit) {
    throw new Error('Unit is required');
  }
  return UNITS.indexOf(normalizeDate(unit));
}

// Note: this function needs to handle "date"
// as well as "day" as a specific unit.
export function getPropsSpecificity(props) {
  let unit;
  let index = -1;
  for (let key of Object.keys(props)) {
    const i = getUnitIndex(key);
    if (i > index) {
      index = i;
      unit = key;
    }
  }
  return {
    unit,
    index,
  };
}

export function getAdjacentUnit(unit, offset) {
  return UNITS[getUnitIndex(unit) + offset];
}

export function getUnitEdge(unit, end, date) {
  const edge = UNIT_EDGES[unit];
  let val = edge[end ? 'end' : 'start'];
  if (isFunction(val)) {
    val = val(date);
  }
  return val;
}

export function convertTimeToUnit(ms, min) {
  let unit = 'millisecond';
  let value = ms;
  for (let i = UNITS.length - 2; i >= 0; i--) {
    const u = UNITS[i];
    const mult = getUnitMultiplier(u, min);
    if (Math.abs(ms) >= mult) {
      unit = u;
      value = Math.trunc(ms / mult);
    }
  }
  return {
    unit,
    value,
  }
}

export function formatForUnit(value, unit, locale) {
  return getUnitFormatter(unit, locale).format(value);
}

export function formatPartsForUnit(value, unit, locale) {
  return getUnitFormatter(unit, locale).formatToParts(value);
}

function getUnitFormatter(unit, locale) {
  return new Intl.NumberFormat(locale, {
    unit: normalizeDate(unit),
    style: 'unit',
    unitDisplay: 'long',
  });
}

function normalizeDate(unit) {
  return unit === 'date' ? 'day' : unit;
}
