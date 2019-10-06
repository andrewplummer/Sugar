import isMultipleOf from './util/isMultipleOf';

export default function isOdd(n) {
  return Number.isInteger(n) && !isMultipleOf(n, 2);
}
