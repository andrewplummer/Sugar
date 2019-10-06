import { assertFinite } from '../util/assertions';
import { trunc, round } from './util/math';
import { isNumber } from '../util/typeChecks';
import format from './util/format';
import clamp from './util/clamp';

/**
 * @typedef {"integer"|"common"|"metric"|"binary"} UnitAlias
 *
 * @prop integer - Units suitable for large integers. Equivalent to "tmbk|".
 * @prop common  - Common si units, as used with "grams", "meters", etc. Equivalent to "k|mμn".
 * @prop metric  - Full si units. Equivalent to "YZEPTGMk|mμnpfazy".
 * @prop binary  - Alias for "metric", but considers the number as base 2.
 *
 */
const ALIAS_INTEGER = 'integer';
const ALIAS_COMMON  = 'common';
const ALIAS_METRIC  = 'metric';
const ALIAS_BINARY  = 'binary';

const INTEGER_UNITS = 'tbmk|';
const COMMON_UNITS  = 'k|mμn';
const METRIC_UNITS  = 'YZEPTGMK|mμnpfazy';

const UNIT_MID         = '|';
const UNIT_PLACEHOLDER = '-';

const SAFE_PRECISION = 10;

/**
 * Returns an abbreviated form of the number.
 *
 * @param {string} n - The number.
 *
 * @param {string} [precision] - When passed, will truncate
 * the number to the given precision. If null, the precision will
 * be 0 unless the number is between -1 and 1. A negative number
 * may also be passed.
 *
 * @param {string|UnitAlias} [units="integer"] - A string representing the
 * units to be used, or an alias to a preset. The "|" token
 * represents the midpoint, or zero. The "-" token represents a
 * placeholder. If passed, the unit will be skipped and the next
 * unit away from zero will be used.
 *
 * @param {Intl.NumberFormat} [formatter] - If an Intl number
 * formatter is passed, it will be used instead of the default
 * formatter. For more see [NumberFormat]{@link https://mdn.io/NumberFormat}.
 *
 * @returns {string}
 *
 * @throws {TypeError} Will be thrown if the input number is
 * not finite. This includes null, undefined, NaN, and Infinity.
 *
 * @example
 *
 * abbr(1000);    // "1k"
 * abbr(1000000); // "1m"
 * abbr(1234, 1); // "1.2k"
 * abbr(1234, 2); // "1.23k"
 * abbr(.15);     // "0.15"
 * abbr(.15, 2, 'common'); // "150m"
 * abbr(1234, 2, null, deFormatter); // "1,23k"
 *
 */
export default function abbr(n, precision, units, formatter) {

  assertFinite(n);

  const isBinary = units === ALIAS_BINARY;

  units = getUnitAlias(units);

  const mid = units.indexOf('|');
  const offset = Math.floor(getExponent(n, isBinary) / 3);

  let [unit, index] = getUnitAndIndex(mid, offset, units);

  if (unit === UNIT_MID) {
    unit = '';
  } else {
    n = getNumberInUnit(n, index - mid, isBinary);
  }

  n = getTruncated(n, precision);

  if (n === 0) {
    return '0';
  }

  return getFormatted(n, formatter) + unit;
}

function getUnitAlias(units) {
  switch (units) {
    case ALIAS_COMMON:  return COMMON_UNITS;
    case ALIAS_BINARY:  return METRIC_UNITS;
    case ALIAS_METRIC:  return METRIC_UNITS;
    case ALIAS_INTEGER: return INTEGER_UNITS;
  }
  return units || INTEGER_UNITS;
}

function getExponent(n, isBinary) {
  if (n === 0) {
    return 0;
  }
  n = Math.abs(n);
  let exp;
  if (isBinary) {
    exp = Math.log2(n) / 10 * 3;
  } else {
    exp = Math.log10(n);
  }
  return Math.floor(getSafe(exp));
}

function getNumberInUnit(n, offset, isBinary) {
  if (isBinary) {
    n *= Math.pow(2, 10 * offset);
  } else {
    n *= Math.pow(10, offset * 3);
  }
  return getSafe(n);
}

function getUnitAndIndex(mid, offset, units) {
  let index = clamp(mid - offset, 0, units.length - 1);
  let unit = units.charAt(index);
  if (unit !== UNIT_MID) {
    while (unit === UNIT_PLACEHOLDER && index >= 0 && index < units.length) {
      index += index < mid ? -1 : 1;
      unit = units.charAt(index);
    }
  }
  return [unit, index];
}

function getTruncated(n, precision) {
  if (!isNumber(precision) && n > -1 && n < 1) {
    // If the number is small and no precision
    // is specified, then let it through.
    return n;
  }
  if (precision < 0) {
    // Prevent negative precisions from returning 0.
    precision = Math.max(precision, -getExponent(n));
  }
  return trunc(n, precision || 0);
}

function getFormatted(n, formatter) {
  if (formatter) {
    return formatter.format(n);
  }
  return format(n);
}

function getSafe(n) {
  // Catching issues with both unsafe numbers and inexact
  // Math.logN implementations by rounding up front.
  return round(n, SAFE_PRECISION);
}
