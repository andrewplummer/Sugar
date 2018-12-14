import SugarNumber, { defineInstanceAlias } from '../namespace';

defineInstanceAlias('isNaN isFinite isInteger isSafeInteger', function(name) {
  return function(n) {
    return Number[name](n);
  };
});

export const { isNaN, isFinite, isInteger, isSafeInteger } = SugarNumber;
