import { getUnitIndex, getPropsSpecificity } from './units';
import { resetByProps } from './reset';
import { callDateSet } from './helpers';

export function updateDate(date, props, reset) {

  // Prioritize "date" over "day" when there is a conflict.
  if ('day' in props && 'date' in props) {
    delete props.day;
  }

  const entries = Object.entries(props);

  if (reset) {
    // Reset first to prevent accidentally
    // traversing into a new month as described below.
    resetByProps(date, props);
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
    return getUnitIndex(a[0]) - getUnitIndex(b[0]);
  });

  for (let [unit, val] of entries) {
    callDateSet(date, unit, val);
  }

  return date;
}
