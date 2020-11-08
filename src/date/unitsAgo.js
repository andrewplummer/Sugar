import { unitBefore } from './util/distance';

/**
 * Returns either a date or a number that represents the offset from the current
 *   date.
 *
 * @extra This method uses native `set` methods under the hood. If the target
 *   date falls on a day that does not exist (i.e. February 31), the date will
 *   be shifted to the last day of the month. Similarly, in rare cases a date
 *   may shift when landing on a DST transition, for example March 8th 2:00am
 *   in northern hemisphere timezones that follow DST. Be careful when using
 *   these methods if you need exact precision.
 *
 *   Singular methods are also provided as a readable alias when using
 *   chainables.
 *
 * @param {number|Date} val - Either a number in the relevant unit or a date. If
 *   a number is passed, a date representing a point in time that many units ago
 *   will be returned. If a date is passed, a number representing the offset in
 *   the relevant unit will be returned.
 *
 * @returns {number|Date}
 *
 * @example
 *
 *   (5).secondsAgo() -> current date - 5 seconds
 *   (5).daysAgo() -> current date - 5 days
 *   new Date(2020, 0).monthsAgo() -> number of months from the current date
 *
 * @method secondsAgo
 * @method minutesAgo
 * @method hoursAgo
 * @method daysAgo
 * @method weeksAgo
 * @method monthsAgo
 * @method yearsAgo
 **/
export function yearsAgo(val) {
  return unitBefore('year', val);
}

export function monthsAgo(val) {
  return unitBefore('month', val);
}

export function weeksAgo(val) {
  return unitBefore('week', val);
}

export function daysAgo(val) {
  return unitBefore('day', val);
}

export function hoursAgo(val) {
  return unitBefore('hour', val);
}

export function minutesAgo(val) {
  return unitBefore('minute', val);
}

export function secondsAgo(val) {
  return unitBefore('second', val);
}

export function millisecondsAgo(val) {
  return unitBefore('millisecond', val);
}
