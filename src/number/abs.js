export default function abs(n) {
  // Note that .valueOf() here is only required due to a
  // very strange bug in iOS7 that only occurs occasionally
  // in which Math.abs() called on non-primitive numbers
  // returns a completely different number (Issue #400)
  return Math.abs((+n).valueOf());
}
