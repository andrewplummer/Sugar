import coerce from './util/coerce';

/**
 * Shortcut for encodeURIComponent global method to allow chaining.
 *
 * @param {string} str - The string.
 *
 * @example
 *
 *   'q=foo bar'.encodeUrlParam() -> 'q%3Dfoo%20bar'
 *
 **/
export default function encodeUrlParam(str = '') {
  str = coerce(str);
  return encodeURIComponent(str);
}
