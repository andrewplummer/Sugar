import { advanceDate } from './util/shift';

/**
 * Returns a date that is a number of units after the current date.
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
 *   (5).secondsFromNow() -> current date + 5 seconds
 *   (5).daysFromNow() -> current date + 5 days
 *
 * @method secondFromNow
 * @method secondsFromNow
 * @method minuteFromNow
 * @method minutesFromNow
 * @method hourFromNow
 * @method hoursFromNow
 * @method dayFromNow
 * @method daysFromNow
 * @method weekFromNow
 * @method weeksFromNow
 * @method monthFromNow
 * @method monthsFromNow
 * @method yearFromNow
 * @method yearsFromNow
 **/
export function yearsFromNow(val) {
  return unitsFromNow('year', val);
}

export function monthsFromNow(val) {
  return unitsFromNow('month', val);
}

export function weeksFromNow(val) {
  return unitsFromNow('week', val);
}

export function daysFromNow(val) {
  return unitsFromNow('day', val);
}

export function hoursFromNow(val) {
  return unitsFromNow('hours', val);
}

export function minutesFromNow(val) {
  return unitsFromNow('minutes', val);
}

export function secondsFromNow(val) {
  return unitsFromNow('seconds', val);
}

export function millisecondsFromNow(val) {
  return unitsFromNow('milliseconds', val);
}

function unitsFromNow(unit, val) {
  const date = new Date();
  const props = { [unit]: val };
  advanceDate(date, props, true);
  return date;
}
