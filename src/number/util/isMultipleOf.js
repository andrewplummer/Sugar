import { isNumber } from '../../util/typeChecks';

export default function isMultipleOf(n1, n2) {
  if (!isNumber(n1) || !isNumber(n2)) {
    return false;
  }
  return n1 % n2 === 0;
}
