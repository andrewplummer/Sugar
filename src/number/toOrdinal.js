import { assertInteger } from '../util/assertions';
import { getOrdinalSuffix } from '../util/ordinals';

export default function toOrdinal(n) {
  // TODO: COERCE PRIMITIVES
  assertInteger(n);
  return n + getOrdinalSuffix(n);
}
