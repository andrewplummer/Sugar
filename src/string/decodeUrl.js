import coerce from './util/coerce';

/**
 * Shortcut for decodeURI global method to allow chaining.
 *
 * @param {string} str - The string.
 *
 * @example
 *
 *   'a%20b%20c'.decodeUrl() -> 'a b c'
 *
 **/
export default function decodeUrl(str = '') {
  str = coerce(str);
  return decodeURI(str);
}
