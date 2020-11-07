import { cloneDate } from '../../util/clone';
import { resetByUnit } from './reset';

export function compareDatesByUnit(d1, d2, unit, options = {}) {
  const { margin = 0 } = options;
  const t = d1.getTime();
  const min = getEdgeTime(d2, unit, options, false);
  const max = getEdgeTime(d2, unit, options, true);
  return t >= (min - margin) && t <= (max + margin);
}

function getEdgeTime(date, unit, options, end) {
  date = cloneDate(date);
  resetByUnit(date, unit, {
    ...options,
    end,
  });
  return date.getTime();
}
