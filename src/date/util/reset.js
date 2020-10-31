import { UNITS, getUnitIndex, getUnitEdge } from './units';
import { callDateSet } from './helpers';

export function resetByUnit(date, unit, end, setProps) {
  return resetByIndex(date, getUnitIndex(unit), end, setProps);
}

export function resetByIndex(date, index, end = false, setProps) {
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
    const val = getUnitEdge(unit, end, date);
    callDateSet(date, unit, val);
    if (setProps) {
      setProps[unit] = val;
    }
    last = unit;
  }
}
