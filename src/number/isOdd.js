import { defineInstance } from './namespace';
import isMultipleOf from './util/isMultipleOf';

export default defineInstance('isOdd', function(n) {
  return Number.isInteger(n) && !isMultipleOf(n, 2);
});
