import { assertDate } from '../util/assertions';

/**
 * Returns `true` if the date is in the future.
 *
 * @param {Date} date - The date to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date(Date.now() + 1000).isFuture() -> true
 *   new Date(Date.now() - 1000).isFuture() -> false
 *
 **/
export default function isFuture(date) {
  assertDate(date);
  return date.getTime() > Date.now();
}
