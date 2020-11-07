import { assertOrCreateDate, explainDateCreate } from './util/creation';
import { isDate, isNumber } from '../util/typeChecks';
import { compareDatesByUnit } from './util/comparison';

/**
 * Compares two dates by varying precision.
 *
 * @extra The dates will be compared based on the precision implied by the
 *   second argument. If a Date or number is passed, absolute values will be
 *   compared. If an object is passed, comparison will be on the most specific
 *   unit. If a string is passed precision will be derived from parsing.
 *
 * In addition to dates, both arguments accept alternate forms of input
 *   that will derive the date. Most notably this includes a string that will
 *   be parsed. For more see `Date.create.`
 *
 * @param {Date|string|Object} d1 - The first date to compare.
 * @param {Date|number|string|Object} d2 - A representation of the second date
 *   to be compared. Accepts a Date or number as a timestamp or valid input to
 *   `Date.create`.
 * @param {number} [margin] - A number in ms representing a margin of error.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   new Date(2020, 0).is(new Date(2020, 0)) -> true
 *   new Date(2020, 0).is('today') -> true
 *   new Date(2020, 0).is('tomorrow') -> false
 *   new Date(2020, 6).is({ year: 2020 }) -> true
 *   new Date(2020, 7, 10).is({ input: '10/8', locale: 'en-GB' }) -> true
 *   new Date(2020, 9, 8).is({ input: '10/8', locale: 'en-GB' }) -> false
 *
 **/
export default function is(d1, d2, margin) {
  d1 = assertOrCreateDate(d1);
  if (isDate(d2)) {
    return compareTimes(d1.getTime(), d2.getTime(), margin);
  } else if (isNumber(d2)) {
    return compareTimes(d1.getTime(), d2, margin);
  } else {
    const result = explainDateCreate(d2);
    if (result) {
      const { date } = result;
      const { unit } = result.specificity;
      return compareDatesByUnit(d1, date, unit, {
        margin,
      });
    }
  }
  return false;
}

function compareTimes(t1, t2, margin = 0) {
  return Math.abs(t2 - t1) <= margin;
}

