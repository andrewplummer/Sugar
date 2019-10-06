import isMultipleOf from './util/isMultipleOf';

export default function isEven(n) {
  return Number.isInteger(n) && isMultipleOf(n, 2);
}
