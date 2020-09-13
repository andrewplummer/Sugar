import { assertDate } from '../util/assertions';

/**
 * Returns `true` if the date falls within the given month.
 *
 * @param {Date} date - The date to check.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date(2020, 0).isJanuary() -> true
 *   new Date(2020, 1).isJanuary() -> false
 *
 * @method isJanuary
 * @method isFebruary
 * @method isMarch
 * @method isApril
 * @method isMay
 * @method isJune
 * @method isJuly
 * @method isAugust
 * @method isSeptember
 * @method isOctober
 * @method isNovember
 * @method isDecember
 **/
export function isJanuary(date) {
  return checkMonth(date, 0);
}

export function isFebruary(date) {
  return checkMonth(date, 1);
}

export function isMarch(date) {
  return checkMonth(date, 2);
}

export function isApril(date) {
  return checkMonth(date, 3);
}

export function isMay(date) {
  return checkMonth(date, 4);
}

export function isJune(date) {
  return checkMonth(date, 5);
}

export function isJuly(date) {
  return checkMonth(date, 6);
}

export function isAugust(date) {
  return checkMonth(date, 7);
}

export function isSeptember(date) {
  return checkMonth(date, 8);
}

export function isOctober(date) {
  return checkMonth(date, 9);
}

export function isNovember(date) {
  return checkMonth(date, 10);
}

export function isDecember(date) {
  return checkMonth(date, 11);
}

function checkMonth(date, month) {
  assertDate(date);
  return date.getMonth() === month;
}
