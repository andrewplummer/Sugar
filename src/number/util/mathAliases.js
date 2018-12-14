import SugarNumber, { defineInstanceAlias } from '../namespace';

defineInstanceAlias('abs pow sin asin cos acos tan atan atan2 exp sqrt', function(name) {
  return function(n, arg) {
    // Note that .valueOf() here is only required due to a
    // very strange bug in iOS7 that only occurs occasionally
    // in which Math.abs() called on non-primitive numbers
    // returns a completely different number (Issue #400)
    return Math[name](n.valueOf(), arg);
  };
});

export const {
  abs,
  pow,
  sin,
  asin,
  cos,
  acos,
  tan,
  atan,
  atan2,
  exp,
  sqrt
} = SugarNumber;
