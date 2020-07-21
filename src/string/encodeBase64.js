import coerce from './util/coerce';

const HAS_GLOBAL = typeof btoa !== 'undefined';
const HAS_BUFFER = typeof Buffer !== 'undefined';

const BYTE_REG = /%([0-9A-F]{2})/g;

/**
 * Encodes the string into base64 encoding.
 *
 * @extra This method wraps built-in methods. It also smooths over issues
 *   with encoding Unicode strings.
 *
 * @param {string} str - The string.
 *
 * @example
 *
 *   'gonna get encoded!'.encodeBase64()  -> 'Z29ubmEgZ2V0IGVuY29kZWQh'
 *   'http://twitter.com/'.encodeBase64() -> 'aHR0cDovL3R3aXR0ZXIuY29tLw=='
 *
 **/
export default function encodeBase64(str) {
  str = coerce(str);
  if (HAS_GLOBAL) {
    return unicodeBase64Encode(str);
  } else if (HAS_BUFFER) {
    return Buffer.from(str, 'utf8').toString('base64');
  } else {
    throw new Error('Cannot base64 encode string (not supported).');
  }
}

function unicodeBase64Encode(str) {
  str = encodeURIComponent(str);
  str = str.replace(BYTE_REG, (match, code) => {
    return String.fromCharCode('0x' + code);
  });
  str = btoa(str);
  return str;
}
