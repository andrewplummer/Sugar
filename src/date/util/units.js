const ALIASES = {
  weekday: 'day',
  hour: 'hours',
  minute: 'minutes',
  second: 'seconds',
  millisecond: 'milliseconds',
  ms: 'milliseconds',
};

export const SPECIFICITY_INDEX = [
  'year',
  'month',
  'date',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
];

export function getUnitSpecificity(unit) {
  unit = getNormalizedUnit(unit);
  if (unit === 'day') {
    unit = 'date';
  }
  return SPECIFICITY_INDEX.indexOf(unit);
}

export function getNormalizedUnit(unit) {
  return ALIASES[unit] || unit;
}
