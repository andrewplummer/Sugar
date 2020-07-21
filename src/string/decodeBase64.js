import { assertString } from '../util/assertions';

const HAS_GLOBAL = typeof atob !== 'undefined';
const HAS_BUFFER = typeof Buffer !== 'undefined';

const VALIDATION_REG = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;

/**
 * Decodes the string from base64 encoding.
 *
 * @extra This method wraps built-in methods. It also smooths over issues
 *   with decoding Unicode strings including UTF-8 input.
 *
 * @param {string} str - The string.
 *
 * @example
 *
 *   'aHR0cDovL3R3aXR0ZXIuY29tLw=='.decodeBase64() -> 'http://twitter.com/'
 *   'anVzdCBnb3QgZGVjb2RlZA=='.decodeBase64()     -> 'just got decoded!'
 *
 **/
export default function encodeBase64(str) {
  if (HAS_GLOBAL || HAS_BUFFER) {
    try {
      assertString(str);
      validateBase64(str);
      if (HAS_GLOBAL) {
        return decodeBase64Global(str);
      } else if (HAS_BUFFER) {
        return decodeBase64Buffer(str);
      }
    } catch(err) {
      throw new Error('Cannot base64 decode string (malformed input).');
    }
  } else {
    throw new Error('Cannot base64 decode string (not supported).');
  }
}

function validateBase64(str) {
  if (!VALIDATION_REG.test(str)) {
    throw new Error();
  }
}

// Handling UTF-8
// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
function decodeBase64Global(str) {
  str = atob(str);
  str = str.split('').map((char) => {
    return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
  }).join('')
  str = decodeURIComponent(str);
  return str;
}

function decodeBase64Buffer(str) {
  return Buffer.from(str, 'base64').toString('utf8')
}
