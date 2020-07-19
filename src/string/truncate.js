import { assertInteger } from '../util/assertions';
import { isString } from '../util/typeChecks';

/**
 * Truncates the string to a specific length.
 *
 * @param {string} str - The string to truncate.
 * @param {number} length - The target length to truncate the string to.
 * @param {string} [from] - Determines the position at which to truncate. One of
 *   `right`, `left` or `middle`. Default is `right`.
 * @param {string} [ellipsis] - The ellipsis string to be added when truncating.
 *   Default is `...`.
 *
 * @example
 *
 *   'sittin on the dock'.truncate(10)           -> 'sittin on ...'
 *   'sittin on the dock'.truncate(10, 'left')   -> '...n the dock'
 *   'sittin on the dock'.truncate(10, 'middle') -> 'sitti... dock'
 *
 **/
export default function truncate(str, length, from = 'right', ellipsis = '...') {
  assertInteger(length);
  if (!isString(str)) {
    str = String(str);
  }
  length = Math.max(0, length);
  if (str.length <= length) {
    return str;
  }
  switch(from) {
    case 'left':
      str = str.slice(str.length - length);
      return ellipsis + str;
    case 'middle':
      const str1 = str.slice(0, Math.ceil(length / 2));
      const str2 = str.slice(str.length - Math.floor(length / 2));
      return str1 + ellipsis + str2;
    default:
      return str.slice(0, length) + ellipsis;
  }
}
