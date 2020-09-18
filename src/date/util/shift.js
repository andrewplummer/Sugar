import { assertInteger } from '../../util/assertions';
import { callDateGet, getDaysInMonth } from './helpers';
import { updateDate } from './update';

// Util method allowing shifting by a single unit.
export function shiftDate(date, unit, val, reset) {
  advanceDate(date, { [unit]: val }, reset);
}

export function advanceDate(date, props, reset) {
  props = getPropsFromRelative(date, props, 1);
  updateDate(date, props, reset);
}

export function rewindDate(date, props, reset) {
  props = getPropsFromRelative(date, props, -1);
  updateDate(date, props, reset);
}

function getPropsFromRelative(date, relProps, dir) {
  const props = {};
  if ('day' in relProps) {
    relProps.date = relProps.day;
    delete relProps.day;
  }
  if ('week' in relProps) {
    assertInteger(relProps.week);
    relProps.date = (relProps.week * 7) + (relProps.date || 0);
    delete relProps.week;
  }
  for (let [unit, val] of Object.entries(relProps)) {
    assertInteger(val);
    const curVal = callDateGet(date, unit);
    val = curVal + val * dir;
    // Need to anticipate month traversal when not enough days and
    // shift the target days by the amount they will be shifted.
    // This is only required for relative as any other updates will
    // be setting an explicit date.
    if (unit === 'date' && 'month' in props) {
      const targetYear = props.year || callDateGet(date, 'year');
      const daysInMonth = getDaysInMonth(new Date(targetYear, props.month));
      if (daysInMonth < curVal) {
        val -= curVal - daysInMonth;
      }
    }
    props[unit] = val;
  }
  return props;
}
