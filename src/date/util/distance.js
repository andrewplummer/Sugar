import { cloneDate } from '../../util/date';
import { shiftDate } from './shift';
import { getUnitMultiplier, getUnitIndex } from './units';

export function getUnitDistance(date1, date2, unit) {
  const fwd = date2 > date1;
  if (!fwd) {
    let tmp = date2;
    date2  = date1;
    date1  = tmp;
  }
  let num = Math.trunc((date2 - date1) / getUnitMultiplier(unit));

  // For units with potential ambiguity, use the numeric calculation as a
  // starting point, then iterate until we pass the target date. Decrement
  // starting point by 1 to prevent overshooting the date due to inconsistencies
  // in ambiguous units.
  if (unitIsAmbiguous(unit)) {
    date1 = cloneDate(date1);
    if (num) {
      num -= 1;
      shiftDate(date1, unit, num);
    }
    while (date1 < date2) {
      shiftDate(date1, unit, 1);
      if (date1 > date2) {
        break;
      }
      num += 1;
    }
  }
  return fwd ? -num : num;
}

// Ambiguous units cannot use getTime to determine the distance between them
// in that unit. For example, months cannot use (date2 - date1) / MS_PER_UNIT,
// as there is not a number of fixed milliseconds in months. This is true for
// any unit with specificity lower than "hours" as even days do not have a fixed
// number of milliseconds in them during a day with a DST shift.
function unitIsAmbiguous(unit) {
  return getUnitIndex(unit) < getUnitIndex('hour');
}
