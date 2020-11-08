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
 *   a number is passed, a date representing a point in time that many units
 *   from now will be returned. If a date is passed, a number representing the
 *   offset in the relevant unit will be returned.
 *
 * @returns {number|Date}
 *
 * @example
 *
 *   (5).secondsBefore() -> current date + 5 seconds
 *   (5).daysBefore() -> current date + 5 days
 *   new Date(2020, 0).monthsBefore() -> number of months from the current date
 *
 * @method secondsBefore
 * @method minutesBefore
 * @method hoursBefore
 * @method daysBefore
 * @method weeksBefore
 * @method monthsBefore
 * @method yearsBefore
 **/
export function yearsBefore(val, date) {
  return unitBefore('year', val, date);
}

export function monthsBefore(val, date) {
  return unitBefore('month', val, date);
}

export function weeksBefore(val, date) {
  return unitBefore('week', val, date);
}

export function daysBefore(val, date) {
  return unitBefore('day', val, date);
}

export function hoursBefore(val, date) {
  return unitBefore('hour', val, date);
}

export function minutesBefore(val, date) {
  return unitBefore('minute', val, date);
}

export function secondsBefore(val, date) {
  return unitBefore('second', val, date);
}

export function millisecondsBefore(val, date) {
  return unitBefore('millisecond', val, date);
}
