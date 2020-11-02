import { UNITS, getUnitIndex, getUnitEdge } from './units';
import { callDateSet } from './helpers';

export function resetByUnit(date, unit, options) {
  return resetByIndex(date, getUnitIndex(unit), options);
}

export function resetByIndex(date, index, options = {}) {
  const { end = false, props, dow } = options;
  let last = UNITS[index];
  for (let i = index + 1; i < UNITS.length; i++) {
    let unit = UNITS[i];
    if (unit === 'week') {
      // When resetting by index always ignore weeks.
      continue;
    } else if (unit === 'day' && last !== 'week') {
      // If the last unit was "week" then we can assume we are resetting the
      // day (Sunday or Saturday), otherwise assume a calendar date.
      unit = 'date';
    }
    let val = getUnitEdge(unit, date, end);
    if (unit === 'day' && dow) {
      // Specifying an alternate beginning/end of the week.
      // This is accomplished by shifting the edge value. Since we want to be
      // consistent with values returned by Date#getDay, expected input will
      // nearly always be 1 or 6 to denote Monday or Saturday, which seem to
      // be the only reasonable choices (https://bit.ly/360sLo6), however as
      // a value of 6 denotes the beginning of the week we need to convert it
      // to -1. Do this by arbitrarily taking Wednesday as a cutoff point and
      // shifting values beyond that as a negative offset from 0.
      val += (dow + 3) % 7 - 3;
    }
    callDateSet(date, unit, val);
    if (props) {
      props[unit] = val;
    }
    last = unit;
  }
}
