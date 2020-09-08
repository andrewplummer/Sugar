import { escapeRegExp } from '../util/regexp';

/**
 * Escapes all RegExp tokens in a string.
 *
 * @param {string} str - The string to escape.
 *
 * @example
 *
 *   RegExp.escape('really?')      -> 'really\?'
 *   RegExp.escape('yes.')         -> 'yes\.'
 *   RegExp.escape('(not really)') -> '\(not really\)'
 *
 * @param {string} str
 *
 **/
export default function escape(str) {
  return escapeRegExp(str);
}
