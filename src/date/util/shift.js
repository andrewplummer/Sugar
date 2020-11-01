import { assertInteger } from '../../util/assertions';
import { callDateGet, getDaysInMonth } from './helpers';
import { updateDate } from './update';

// Util method allowing shifting by a single unit.
export function shiftDate(date, unit, val, reset) {
  advanceDate(date, { [unit]: val }, reset);
}

export function advanceDate(date, props, reset) {
  props = getAbsoluteProps(date, props, 1);
  updateDate(date, props, reset);
}

export function rewindDate(date, props, reset) {
  props = getAbsoluteProps(date, props, -1);
  updateDate(date, props, reset);
}

function getAbsoluteProps(date, relProps, dir) {
  relProps = { ...relProps };
  if ('day' in relProps) {
    if (!('date' in relProps)) {
      relProps.date = relProps.day;
    }
    delete relProps.day;
  }
  if ('week' in relProps) {
    assertInteger(relProps.week);
    relProps.date = (relProps.week * 7) + (relProps.date || 0);
    delete relProps.week;
  }
  const absProps = {};
  for (let [unit, val] of Object.entries(relProps)) {
    assertInteger(val);
    const curVal = callDateGet(date, unit);
    val = curVal + val * dir;
    // Need to anticipate month traversal when not enough days and
    // shift the target days by the amount they will be shifted.
    // This is only required for relative as any other updates will
    // be setting an explicit date.
    if (unit === 'date' && 'month' in absProps) {
      const targetYear = absProps.year || callDateGet(date, 'year');
      const daysInMonth = getDaysInMonth(targetYear, absProps.month);
      if (daysInMonth < curVal) {
        val -= curVal - daysInMonth;
      }
    }
    absProps[unit] = val;
  }
  return absProps;
}
