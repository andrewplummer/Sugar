import { assertNumber } from '../util/assertions';
import { convertTimeToUnit, formatForUnit } from './util/units';

/**
 * Takes the number as a timestamp and converts to a localized string in the
 *   most appropriate units.
 *
 * @param {number} n - The number.
 * @param {string} locale - The locale code to localize in. If not passed will
 *   use the system locale.
 *
 * @returns {string}
 *
 * @example
 *
 *   (500).duration() -> '500 milliseconds'
 *   (1000).duration() -> '1 second'
 *   (24 * 60 * 60 * 1000).duration() -> '1 day'
 *   (24 * 60 * 60 * 1000).duration('es') -> '10 días'
 *
 **/
export default function duration(n, locale) {
  assertNumber(n);
  const { value, unit } = convertTimeToUnit(n);
  return formatForUnit(value, unit, locale);
}
