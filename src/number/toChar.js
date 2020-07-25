import { assertNonNegativeInteger } from '../util/assertions';

export default function toChar(n) {
  if (n != null) {
    n = +n;
  }
  assertNonNegativeInteger(n);

  // Note that fromCharCode was historically 2x faster than
  // fromCodePoint, however this no longer seems to be the case.
  // https://jsperf.com/fromcharcode-vs-fromcodepoint/6
  return String.fromCodePoint(n);
}
