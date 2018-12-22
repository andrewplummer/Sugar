import { defineInstance } from '../core/number';
import { assertPositiveInteger } from '../util/assertions';

export default defineInstance(function times(n, fn) {
  assertPositiveInteger(n);
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(fn(i, n));
  }
  return arr;
});
