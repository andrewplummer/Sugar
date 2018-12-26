import { assertFinite, assertPositiveNumber } from '../../util/assertions';
import { isFunction } from '../../util/typeChecks';

export default function(n1, n2, ...args) {

  assertFinite(n1);
  assertFinite(n2);

  const [step, fn] = collectArgs(args);

  assertFinite(step);
  assertPositiveNumber(step);

  const inc = step * (n1 < n2 ? 1 : -1);
  const len = Math.abs(n2 - n1);
  const result = [];

  for (let i = 0, n = n1; i <= len; i += step) {
    result.push(fn ? fn(n, i) : n);
    n += inc;
  }

  return result;
}

export function collectArgs(args) {
  if (args.length === 2) {
    return [args[0], args[1]];
  } else if (args.length === 1) {
    return isFunction(args[0]) ? [1, args[0]] : [args[0]];
  }
  return [1];
}
