import { assertFinite } from '../../util/assertions';

export default function(n1, n2, args) {

  assertFinite(n1);
  assertFinite(n2);

  const [step, fn] = collectArgs(args);
  const inc = (step || 1) * (n1 < n2 ? 1 : -1);
  const len = Math.abs(n2 - n1);
  const result = [];

  for (let i = 0, n = n1; i <= len; i++) {
    result.push(n);
    fn(n, i);
    n += inc;
  }

  return result;
}

function collectArgs(args) {
  if (args.length === 2) {
    return [args[0] || 1, args[1]];
  }
  return [1, args[0]];
}