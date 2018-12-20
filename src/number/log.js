import { defineInstance } from './namespace';

export default defineInstance('log', function(n, base) {
  let log = Math.log(n);
  if (base) {
    log /= Math.log(base);
  }
  return log;
});
