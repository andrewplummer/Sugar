import { defineInstance } from './namespace';
import { assertPositiveInteger } from '../util/assertions';

export default defineInstance('times', function(n, fn) {
  assertPositiveInteger(n);
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(fn(i, n));
  }
  return arr;
});
