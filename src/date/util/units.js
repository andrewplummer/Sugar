import { isFunction } from '../../util/typeChecks';
import { getDaysInMonth } from './helpers';
import { UNITS } from './const';

const YEAR_AVG_DAYS = 365.2425;
const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;

// "min" here denotes the minimum possible value for the unit and is used in
// relative time formats where we want to greedily assume the upper unit
// without caring too much for accuracy.
//
// "rel" similarly denotes the multiplier relative to it's lower unit for
// formats like "half a year ago" that colloquially refer to a fraction of the
// lower unit where precision is also not expected. "half a month" is ambiguous,
// so keeping things simple and saying "4 weeks".

const UNIT_MULTIPLIERS = {
  year: {
    avg: YEAR_AVG_DAYS * DAY_IN_MS,
    min: 365 * DAY_IN_MS,
    rel: 12,
  },
  month: {
    avg: YEAR_AVG_DAYS / 12 * DAY_IN_MS,
    min: 28 * DAY_IN_MS,
    rel: 4,
  },
  week: {
    avg: 7 * DAY_IN_MS,
    rel: 7,
  },
  day: {
    avg: DAY_IN_MS,
    rel: 24,
  },
  hour: {
    avg: HOUR_IN_MS,
    rel: 60,
  },
  minute: {
    avg: 60 * 1000,
    rel: 60,
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
  day: {
    start: 0,
    end: 6,
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

export function getUnitMultiplier(unit, type = 'avg') {
  const mult = UNIT_MULTIPLIERS[normalizeUnit(unit)];
  // Return the multiplier for the type, falling back to the average.
  return mult[type] || mult['avg'];
}

export function getUnitIndex(unit) {
  if (!unit) {
    throw new Error('Unit is required');
  }
  return UNITS.indexOf(normalizeUnit(unit));
}

export function isTimeUnit(unit) {
  return getUnitIndex(unit) >= 4;
}

// Note: this function needs to handle "date"
// as well as "day" as a specific unit.
export function getPropsPrecision(props) {
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

export function getUnitEdge(unit, date, end) {
  const edge = UNIT_EDGES[unit];
  let val = edge[end ? 'end' : 'start'];
  if (isFunction(val)) {
    val = val(date);
  }
  return val;
}

export function convertTimeToUnit(ms, type) {
  let unit = 'millisecond';

  // Round the time to avoid floating point errors.
  ms = Math.round(ms);

  let value = ms;
  for (let i = UNITS.length - 2; i >= 0; i--) {
    const u = UNITS[i];
    const mult = getUnitMultiplier(u, type);
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
    unit: normalizeUnit(unit),
    style: 'unit',
    unitDisplay: 'long',
  });
}

function normalizeUnit(unit) {
  return unit === 'date' ? 'day' : unit;
}
