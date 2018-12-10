import SugarNumber, { defineInstanceAlias } from '../namespace';
import roundWithPrecision from './roundWithPrecision';

defineInstanceAlias('round floor ceil', function(name) {
  const fn = Math[name];
  return function(n, place) {
    return place ? roundWithPrecision(n, place, fn) : fn(n);
  };
});

export const { round, floor, ceil } = SugarNumber;
