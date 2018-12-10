import { defineStatic } from './namespace';
import trunc from './util/trunc';

export default defineStatic('random', function(n1, n2) {
  if (arguments.length == 0) {
    n1 = 0;
    n2 = 1;
  } else if (arguments.length == 1) {
    n2 = n1;
    n1 = 0;
  }
  const min = Math.min(n1, n2);
  const max = Math.max(n1, n2) + 1;
  return Math.floor((Math.random() * (max - min)) + min);
});
