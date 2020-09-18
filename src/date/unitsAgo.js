import { rewindDate } from './util/shift';

/**
 * Returns a date that is a number of units before the current date.
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
 * @param {number} val - The value in the relevant unit.
 *
 * @returns {Date}
 *
 * @example
 *
 *   (5).secondsAgo() -> current date - 5 seconds
 *   (5).daysAgo() -> current date - 5 days
 *
 * @method secondAgo
 * @method secondsAgo
 * @method minuteAgo
 * @method minutesAgo
 * @method hourAgo
 * @method hoursAgo
 * @method dayAgo
 * @method daysAgo
 * @method weekAgo
 * @method weeksAgo
 * @method monthAgo
 * @method monthsAgo
 * @method yearAgo
 * @method yearsAgo
 **/
export function yearsAgo(val) {
  return unitsAgo('year', val);
}

export function monthsAgo(val) {
  return unitsAgo('month', val);
}

export function weeksAgo(val) {
  return unitsAgo('week', val);
}

export function daysAgo(val) {
  return unitsAgo('day', val);
}

export function hoursAgo(val) {
  return unitsAgo('hours', val);
}

export function minutesAgo(val) {
  return unitsAgo('minutes', val);
}

export function secondsAgo(val) {
  return unitsAgo('seconds', val);
}

export function millisecondsAgo(val) {
  return unitsAgo('milliseconds', val);
}

function unitsAgo(unit, val) {
  const date = new Date();
  const props = { [unit]: val };
  rewindDate(date, props, true);
  return date;
}
