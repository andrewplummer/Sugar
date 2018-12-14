import { defineStatic } from './namespace';

export default defineStatic('random', function(n1 = 1, n2 = 0) {
  const min = Math.min(n1, n2);
  const max = Math.max(n1, n2) + 1;
  return Math.floor((Math.random() * (max - min)) + min);
});
