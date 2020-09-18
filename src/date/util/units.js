const YEAR_AVG_DAYS = 365.2425;

export const SPECIFICITY_INDEX = [
  'year',
  'month',
  'week',
  'date',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
];

export const UNIT_MULTIPLIERS = {
  year: YEAR_AVG_DAYS * 24 * 60 * 60 * 1000,
  month: YEAR_AVG_DAYS / 12 * 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  hours: 60 * 60 * 1000,
  seconds: 1000,
  minutes: 60 * 1000,
};

export function getUnitSpecificity(unit) {
  if (unit === 'day') {
    unit = 'date';
  }
  return SPECIFICITY_INDEX.indexOf(unit);
}
