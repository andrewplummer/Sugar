import { getUnitSpecificity } from './units';
import { resetBySpecificity } from './reset';
import { callDateSet } from './helpers';

export function updateDate(date, props, reset) {
  const entries = Object.entries(props);

  if (reset) {
    // Reset first to prevent accidentally traversing into a new month as
    // described below.
    let specificity = 0;
    for (let [unit] of entries) {
      specificity = Math.max(specificity, getUnitSpecificity(unit));
    }
    resetBySpecificity(date, specificity);
  }

  // The order of operations is important as setting { month: 0: date: 31 }
  // on February 1 will produce different results depending on whether the
  // month or date is set first. Likewise setting { date: 7, hour: 2 } on
  // March 8 in a DST timezone will produce different results if hour or
  // date is set first.
  //
  // For values that fall within ranges correct for their unit, these should
  // be the only two cases where sorting is required, however date set methods
  // may also overshoot their boundaries or provide negative input which also
  // will cause shifts, for example { year: 2020, month: 36 }. For this reason
  // we need to sort in all cases from least specific -> most specific.
  entries.sort((a, b) => {
    return getUnitSpecificity(a[0]) - getUnitSpecificity(b[0]);
  });

  for (let [unit, val] of entries) {
    callDateSet(date, unit, val);
  }

  return date;
}

