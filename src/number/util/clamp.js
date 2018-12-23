import { isNumber } from '../../util/typeChecks';
import { assertValidNumber } from '../../util/assertions';

export default function(n, min, max) {
  assertValidNumber(n);
  if (!isNumber(min)) {
    min = n;
  }
  if (!isNumber(max)) {
    max = min;
    min = n;
  }
  return Math.min(max, Math.max(min, n));
}
