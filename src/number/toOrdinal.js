import { assertInteger } from '../util/assertions';
import { getOrdinalSuffix } from '../util/number';

export default function toOrdinal(n) {
  // TODO: COERCE PRIMITIVES
  assertInteger(n);
  return n + getOrdinalSuffix(n);
}
