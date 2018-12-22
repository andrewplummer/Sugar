import { defineInstance } from '../core/number';
import isMultipleOf from './util/isMultipleOf';

export default defineInstance(function isEven(n) {
  return Number.isInteger(n) && isMultipleOf(n, 2);
});
