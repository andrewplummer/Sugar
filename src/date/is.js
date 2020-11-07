import { assertDate } from '../util/assertions';
import { collectRollupInput, createDate } from './util/creation';
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
 * @param {Date} date - The first date to compare.
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
export default function is(date, d2, margin) {
  assertDate(date);
  if (isDate(d2)) {
    return compareTimes(date.getTime(), d2.getTime(), margin);
  } else if (isNumber(d2)) {
    return compareTimes(date.getTime(), d2, margin);
  } else {
    const { input, options } = collectRollupInput(d2);
    const { date: parsedDate, specificity } = createDate(input, {
      ...options,
      explain: true,
    });
    const { unit } = specificity;
    return compareDatesByUnit(date, parsedDate, unit, {
      margin,
    });
  }
  return false;
}

function compareTimes(t1, t2, margin = 0) {
  return Math.abs(t2 - t1) <= margin;
}

