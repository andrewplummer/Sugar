import { SPECIFICITY_INDEX } from './units';
import { callDateSet } from './helpers';

export function resetBySpecificity(date, specificity) {
  for (let i = specificity + 1; i < SPECIFICITY_INDEX.length; i++) {
    // Date reset value is 1, everything else is 0 index.
    const val = i === 2 ? 1 : 0;
    callDateSet(date, SPECIFICITY_INDEX[i], val);
  }
}
