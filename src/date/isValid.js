import { assertValidDate } from '../util/assertions';

/**
 * Returns `true` if the date is valid.
 *
 * @param {Date} date - The date to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date().isValid() -> true
 *   new Date(NaN).isValid() -> false
 *
 **/
export default function isValid(date) {
  try {
    assertValidDate(date);
    return true;
  } catch(err) {
    return false;
  }
}
