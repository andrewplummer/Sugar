import { assertDecimal } from '../../util/assertions';
import { isNumber } from '../../util/typeChecks';
import { round } from './math';

function toAbsString(n, precision, base) {
  const abs = Math.abs(n);
  if (precision < 0) {
    return round(abs, precision).toString(base);
  } else if (isNumber(precision)) {
    return abs.toFixed(precision);
  }
  return abs.toString(base);
}

export default function(n, precision, forceSign, base, fn) {
  n = +n;
  assertDecimal(n);

  let sign = '';
  let [integer, decimal] = toAbsString(n, precision, base).split('.');
  integer = fn(integer);
  if (n < 0) {
    sign = '-';
  } else if (forceSign) {
    sign = '+';
  }
  return sign + integer + (decimal ? '.' + decimal : '');
}
