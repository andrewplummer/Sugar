import { unitAfter } from './util/distance';

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
 *   a number is passed, a date representing a point in time that many units
 *   from now will be returned. If a date is passed, a number representing the
 *   offset in the relevant unit will be returned.
 *
 * @returns {number|Date}
 *
 * @example
 *
 *   (5).secondsAfter() -> current date + 5 seconds
 *   (5).daysAfter() -> current date + 5 days
 *   new Date(2020, 0).monthsAfter() -> number of months from the current date
 *
 * @method secondsAfter
 * @method minutesAfter
 * @method hoursAfter
 * @method daysAfter
 * @method weeksAfter
 * @method monthsAfter
 * @method yearsAfter
 **/
export function yearsAfter(val, date) {
  return unitAfter('year', val, date);
}

export function monthsAfter(val, date) {
  return unitAfter('month', val, date);
}

export function weeksAfter(val, date) {
  return unitAfter('week', val, date);
}

export function daysAfter(val, date) {
  return unitAfter('day', val, date);
}

export function hoursAfter(val, date) {
  return unitAfter('hour', val, date);
}

export function minutesAfter(val, date) {
  return unitAfter('minute', val, date);
}

export function secondsAfter(val, date) {
  return unitAfter('second', val, date);
}

export function millisecondsAfter(val, date) {
  return unitAfter('millisecond', val, date);
}
