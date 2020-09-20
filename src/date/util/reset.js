import { SPECIFICITY_INDEX, getUnitSpecificity, getUnitEdge } from './units';
import { callDateSet } from './helpers';

export function resetByUnit(date, unit, end) {
  return resetBySpecificity(date, getUnitSpecificity(unit), end);
}

export function resetBySpecificity(date, specificity, end = false) {
  for (let i = specificity + 1; i < SPECIFICITY_INDEX.length; i++) {
    let unit = SPECIFICITY_INDEX[i];
    // When resetting by specificity always ignore weeks and reset
    // the calendar date instead.
    if (unit === 'week') {
      continue;
    } else if (unit === 'day') {
      unit = 'date';
    }
    const val = getUnitEdge(unit, end, date);
    callDateSet(date, unit, val);
  }
}
