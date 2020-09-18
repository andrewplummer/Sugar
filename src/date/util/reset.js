import { SPECIFICITY_INDEX, getUnitSpecificity } from './units';
import { callDateSet } from './helpers';

export function resetByUnit(date, unit) {
  return resetBySpecificity(date, getUnitSpecificity(unit));
}

export function resetBySpecificity(date, specificity) {
  for (let i = specificity + 1; i < SPECIFICITY_INDEX.length; i++) {
    const unit = SPECIFICITY_INDEX[i];
    if (unit !== 'week') {
      // Date reset value is 1, everything else is 0 index.
      const val = unit === 'date' ? 1 : 0;
      callDateSet(date, SPECIFICITY_INDEX[i], val);
    }
  }
}
