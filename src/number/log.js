import { defineInstance } from './namespace';

export default defineInstance('log', function(n, base) {
  return Math.log(n) / (base ? Math.log(base) : 1);
});
