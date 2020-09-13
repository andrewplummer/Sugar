import { assertDate } from '../util/assertions';

/**
 * Returns `true` if the date falls within the given day of the week.
 *
 * @param {Date} date - The date to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date(2020, 0, 5).isSunday() -> true
 *   new Date(2020, 1, 6).isSunday() -> false
 *
 * @method isSunday
 * @method isMonday
 * @method isTuesday
 * @method isWednesday
 * @method isThursday
 * @method isFriday
 * @method isSaturday
 **/
export function isSunday(date) {
  return checkDay(date, 0);
}

export function isMonday(date) {
  return checkDay(date, 1);
}

export function isTuesday(date) {
  return checkDay(date, 2);
}

export function isWednesday(date) {
  return checkDay(date, 3);
}

export function isThursday(date) {
  return checkDay(date, 4);
}

export function isFriday(date) {
  return checkDay(date, 5);
}

export function isSaturday(date) {
  return checkDay(date, 6);
}

function checkDay(date, day) {
  assertDate(date);
  return date.getDay() === day;
}
