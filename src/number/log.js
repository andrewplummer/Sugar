export default function log(n, base) {
  let log = Math.log(n);
  if (arguments.length > 1) {
    log /= Math.log(base);
  }
  return log;
}
