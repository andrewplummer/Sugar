import step from '../util/step';
export default function(n1, n2, ...args) {
  if (n1 > n2) {
    [n2, n1] = [n1, n2];
  }
  return step(n1, n2, args);
}
