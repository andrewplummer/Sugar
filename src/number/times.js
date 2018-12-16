import { defineInstance } from './namespace';

export default defineInstance('times', function(n, fn) {
  if (n <= 0 || !Number.isFinite(n) || !Number.isInteger(n)) {
    throw new RangeError('Number must be a positive, finite integer');
  }
  const arr = [];
  for(let i = 0; i < n; i++) {
    arr.push(fn(i, n));
  }
  return arr;
});
