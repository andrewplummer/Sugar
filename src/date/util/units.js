import { isFunction } from '../../util/typeChecks';
import { getDaysInMonth } from './helpers';

const YEAR_AVG_DAYS = 365.2425;

export const SPECIFICITY_INDEX = [
  'year',
  'month',
  'week',
  'date',
  'hour',
  'minute',
  'second',
  'millisecond',
];

const UNIT_MULTIPLIERS = {
  year: YEAR_AVG_DAYS * 24 * 60 * 60 * 1000,
  month: YEAR_AVG_DAYS / 12 * 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  date: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
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

export function getUnitMultiplier(unit) {
  return UNIT_MULTIPLIERS[normalizeUnit(unit)];
}

export function getUnitSpecificity(unit) {
  return SPECIFICITY_INDEX.indexOf(normalizeUnit(unit));
}

export function getUnitEdge(unit, end, date) {
  const edge = UNIT_EDGES[normalizeUnit(unit)];
  let val = edge[end ? 'end' : 'start'];
  if (isFunction(val)) {
    val = val(date);
  }
  return val;
}

export function convertTimeToUnit(ms) {
  let unit = 'millisecond';
  let value = ms;
  for (let i = SPECIFICITY_INDEX.length - 2; i >= 0; i--) {
    const u = SPECIFICITY_INDEX[i];
    const mult = UNIT_MULTIPLIERS[u];
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

function normalizeUnit(unit) {
  return unit === 'day' ? 'date' : unit;
}
