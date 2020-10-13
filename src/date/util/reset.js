import { UNITS, getUnitIndex, getUnitEdge } from './units';
import { callDateSet } from './helpers';

export function resetByUnit(date, unit, end) {
  return resetByIndex(date, getUnitIndex(unit), end);
}

export function resetByIndex(date, index, end = false) {
  for (let i = index + 1; i < UNITS.length; i++) {
    let unit = UNITS[i];
    // When resetting by index always ignore
    // weeks and reset the calendar date instead.
    if (unit === 'week') {
      continue;
    } else if (unit === 'day') {
      unit = 'date';
    }
    const val = getUnitEdge(unit, end, date);
    callDateSet(date, unit, val);
  }
}
