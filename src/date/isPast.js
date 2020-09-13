import { assertDate } from '../util/assertions';

/**
 * Returns `true` if the date is in the past.
 *
 * @param {Date} date - The date to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date(Date.now() + 1000).isPast() -> true
 *   new Date(Date.now() - 1000).isPast() -> false
 *
 **/
export default function isPast(date) {
  assertDate(date);
  return date.getTime() < Date.now();
}
