import { defineInstance } from '../core/number';
import pad from './util/pad';

export default defineInstance(function toHex(n, digits) {
  return pad(n, digits, null, false, 16);
});
