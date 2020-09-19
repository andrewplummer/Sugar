import { isFunction } from '../../util/typeChecks';
import { getDaysInMonth } from './helpers';

const YEAR_AVG_DAYS = 365.2425;

export const SPECIFICITY_INDEX = [
  'year',
  'month',
  'date',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
];

const UNIT_MULTIPLIERS = {
  year: YEAR_AVG_DAYS * 24 * 60 * 60 * 1000,
  month: YEAR_AVG_DAYS / 12 * 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  date: 24 * 60 * 60 * 1000,
  hours: 60 * 60 * 1000,
  seconds: 1000,
  minutes: 60 * 1000,
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
  hours: {
    start: 0,
    end: 23,
  },
  minutes: {
    start: 0,
    end: 59,
  },
  seconds: {
    start: 0,
    end: 59,
  },
  milliseconds: {
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

function normalizeUnit(unit) {
  return unit === 'day' ? 'date' : unit;
}
