import { isString } from './typeChecks';

const ESCAPE_REG = /([\\/'*+?|()[\]{}.^$-])/g;

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
export function escapeRegExp(str) {
  if (!isString(str)) {
    str = String(str);
  }
  return str.replace(ESCAPE_REG,'\\$1');
}
