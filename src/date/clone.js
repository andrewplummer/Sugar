import { assertDate } from '../util/assertions';
import { cloneDate } from '../util/clone';

/**
 * Returns a copy of the date.
 *
 * @param {Date} date - The date.
 *
 * @returns {Date}
 *
 * @example
 *
 *   new Date().clone() -> creates a copy of the date
 *
 **/
export default function clone(date) {
  assertDate(date);
  return cloneDate(date);
}
