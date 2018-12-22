import { defineInstance } from '../core/number';

export default defineInstance(function log(n, base) {
  let log = Math.log(n);
  if (base) {
    log /= Math.log(base);
  }
  return log;
});
