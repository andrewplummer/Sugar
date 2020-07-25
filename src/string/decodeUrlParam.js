import coerce from './util/coerce';

/**
 * Shortcut for decodeURIComponent global method to allow chaining.
 *
 * @param {string} str - The string.
 *
 * @example
 *
 *   'q%3Dfoo%20bar'.decodeUrlParam() -> 'q=foo bar'
 *
 **/
export default function decodeUrlParam(str = '') {
  str = coerce(str);
  return decodeURIComponent(str);
}
