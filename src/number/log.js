export default function log(n, base) {
  let log = Math.log(n);
  if (base) {
    log /= Math.log(base);
  }
  return log;
}
