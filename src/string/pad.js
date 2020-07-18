/**
 * Pads the string evenly on both sides.
 *
 * @param {string} str - The string.
 * @param {number} [length] - The target length to pad the string to. If the
 *   sum of the string's length and `length` is odd, the resulting string length
 *   will be `length - 1`.
 * @param {string} [padString] - The string to use as padding. Defaults to empty
 *   space.
 *
 * @example
 *
 *   'string'.pad(10) -> '  string  '
 *   'hello'.pad(10) -> '  hello  '
 *
 **/
export default function pad(str, length, padString) {
  if (!length) {
    return str;
  }
  const len = str.length;
  let sum = len + length;
  if (sum % 2 === 1) {
    sum -= 1;
  }
  return str.padStart(sum / 2, padString).padEnd(sum - len, padString);
}
