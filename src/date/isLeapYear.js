import { assertDate } from '../util/assertions';

/**
 * Returns true if the date is a leap year.
 *
 * @param {Date} date - The date.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date(2020, 0).isLeapYear() -> true
 *   new Date(2021, 0).isLeapYear() -> false
 *
 **/
export default function isLeapYear(date) {
  assertDate(date);
  const year = date.getFullYear();
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
