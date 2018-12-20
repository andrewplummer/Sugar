import { defineInstance } from './namespace';
import pad from './util/pad';

export default defineInstance('toHex', function(n, digits) {
  return pad(n, digits, null, false, 16);
});
