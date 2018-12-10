import { defineInstance } from './namespace';
import isMultipleOf from './util/isMultipleOf';

export default defineInstance('isMultipleOf', function(n1, n2) {
  return isMultipleOf(n1, n2);
});
