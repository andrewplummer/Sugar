import { cloneDate } from '../../util/clone';
import { isNumber, isDate } from '../../util/typeChecks';
import { advanceDate, shiftDateByUnit } from './shift';
import { createDateFromRollup } from './creation';
import { getUnitMultiplier, getUnitIndex } from './units';

export function unitBefore(unit, input, date) {
  return getUnitDistanceOrDate(unit, input, date, -1);
}

export function unitAfter(unit, input, date) {
  return getUnitDistanceOrDate(unit, input, date, 1);
}

export function getUnitDistanceOrDate(unit, input, dateArg, dir) {
  const date = createDateFromRollup(dateArg || new Date());
  if (isNumber(input)) {
    const props = { [unit]: input * dir };
    return advanceDate(date, props);
  } else if (isDate(input)) {
    const [start, end] = dir > 0 ? [input, date] : [date, input];
    return getUnitDistance(unit, start, end);
  } else {
    throw new TypeError('Requires a number or a date');
  }
}

export function getUnitDistance(unit, d1, d2) {
  const fwd = d2 > d1;
  let [start, end] = fwd ? [d1, d2] : [d2, d1];
  let num = Math.trunc((end - start) / getUnitMultiplier(unit));

  // For units with potential ambiguity, use the numeric calculation as a
  // starting point, then iterate until we pass the target date. Decrement
  // starting point by 1 to prevent overshooting the date due to inconsistencies
  // in ambiguous units.
  if (unitIsAmbiguous(unit)) {
    const date = cloneDate(start);
    if (num) {
      num -= 1;
      shiftDateByUnit(date, unit, num);
    }
    while (date < end) {
      shiftDateByUnit(date, unit, 1);
      if (date > end) {
        break;
      }
      num += 1;
    }
  }
  return fwd ? -num : num;
}

// Ambiguous units cannot use getTime to determine the distance between them
// in that unit. For example, months cannot use (end - start) / MS_PER_UNIT,
// as there is not a number of fixed milliseconds in months. This is true for
// any unit with specificity lower than "hours" as even days do not have a fixed
// number of milliseconds in them during a day with a DST shift.
function unitIsAmbiguous(unit) {
  return getUnitIndex(unit) < getUnitIndex('hour');
}
