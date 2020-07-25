import { isNumber } from '../../util/typeChecks';
import { assertNumber } from '../../util/assertions';
import coerce from './coerce';

export default function(n, ...args) {
  const [min, max] = collectArgs(args);
  n = coerce(n);
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
  let min, max;
  if (args.length === 2) {
    min = args[0];
    max = args[1];
    return [args[0], args[1]];
  } else {
    min = null;
    max = args[0];
  }
  return [coerce(min), coerce(max)];
}
