import { isNumber } from '../../util/typeChecks';
import { assertNumber } from '../../util/assertions';

export default function(n, ...args) {
  const [min, max] = collectArgs(args);
  assertNumber(n);
  if (isNumber(min)) {
    n = Math.max(n, min);
  }
  if (isNumber(max)) {
    n = Math.min(n, max);
  }
  return n;
}

function collectArgs(args) {
  if (args.length === 2) {
    return [args[0], args[1]];
  }
  return [null, args[0]];
}
