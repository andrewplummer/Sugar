import { isNumber } from './typeChecks';
import { assertFinite, assertPositiveNumber } from './assertions';

export default function(n1, n2, ...args) {

  assertFinite(n1);
  assertFinite(n2);

  const [step, fn] = collectArgs(args);

  assertFinite(step);
  assertPositiveNumber(step);

  const inc = (step || 1) * (n1 < n2 ? 1 : -1);
  const len = Math.abs(n2 - n1);
  const result = [];

  for (let i = 0, n = n1; i <= len; i += step) {
    result.push(fn ? fn(n, i) : n);
    n += inc;
  }

  return result;
}

function collectArgs(args) {
  if (args.length === 0) {
    return [1];
  } else if (args.length === 1) {
    return [args[0]];
  }
  return [args[0], args[1]];
}
