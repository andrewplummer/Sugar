import { assertDate } from '../util/assertions';
import { cloneDate } from '../util/clone';

/**
 * Returns a clone of the date.
 *
 * @param {Date} date - The date.
 *
 * @returns {Date}
 *
 * @example
 *
 *   new Date().clone() -> new date
 *
 **/
export default function clone(date) {
  assertDate(date);
  return cloneDate(date);
}
