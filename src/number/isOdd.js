import { defineInstance } from '../core/number';
import isMultipleOf from './util/isMultipleOf';

export default defineInstance(function isOdd(n) {
  return Number.isInteger(n) && !isMultipleOf(n, 2);
});
