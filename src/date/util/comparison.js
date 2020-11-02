import { cloneDate } from '../../util/clone';
import { resetByUnit } from './reset';

export function compareDatesByUnit(d1, d2, unit, dow) {
  const time = d1.getTime();
  const min = getEdgeTime(d2, unit, dow, false);
  const max = getEdgeTime(d2, unit, dow, true);
  return time >= min && time <= max;
}

function getEdgeTime(date, unit, dow, end) {
  date = cloneDate(date);
  resetByUnit(date, unit, {
    end,
    dow,
  });
  return date.getTime();
}
