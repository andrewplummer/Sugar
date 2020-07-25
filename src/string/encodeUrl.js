import coerce from './util/coerce';

/**
 * Shortcut for encodeURI global method to allow chaining.
 *
 * @param {string} str - The string.
 *
 * @example
 *
 *   'a b c'.encodeUrl() -> 'a%20b%20c'
 *
 **/
export default function encodeUrl(str = '') {
  str = coerce(str);
  return encodeURI(str);
}
