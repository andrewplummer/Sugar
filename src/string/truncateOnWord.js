import { assertInteger } from '../util/assertions';
import { isString } from '../util/typeChecks';

// Split on whitespace as well as sequences of known punctuation blocks.
const SEPARATOR_REG = /[\s\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u00A1-\u00BF\u2000-\u206F\u2E00-\u2E7F\u3000-\u303F]/;

/**
 * Truncates the string to a specific length without splitting up words.
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
 *   'sittin on the dock'.truncate(10)           -> 'sittin on...'
 *   'sittin on the dock'.truncate(10, 'left')   -> '...on the dock'
 *   'sittin on the dock'.truncate(10, 'middle') -> 'sittin...dock'
 *
 **/
export default function truncateOnWord(str, length, from = 'right', ellipsis = '...') {
  assertInteger(length);
  if (!isString(str)) {
    str = String(str);
  }
  if (str.length <= length) {
    return str;
  }
  length = Math.max(0, length);
  switch(from) {
    case 'left':
      return ellipsis + fromLeft(str, length);
    case 'middle': {
      const half = Math.floor(length / 2);
      return fromRight(str, half) + ellipsis + fromLeft(str, half);
    }
    default:
      return fromRight(str, length, false) + ellipsis;
  }
}

function fromRight(str, length) {
  const reg = RegExp(SEPARATOR_REG.source, 'g');
  let index = null;
  while (reg.exec(str)) {
    const i = reg.lastIndex;
    if (i > length + 1 || i >= str.length) {
      break;
    }
    index = i;
  }
  if (index === null) {
    index = length + 1;
  }
  return str.slice(0, index - 1);
}

function fromLeft(str, length) {
  str = str.slice(str.length - length - 1);
  const match = str.match(SEPARATOR_REG);
  let index;
  if (match && match.index < str.length - 1) {
    index = match.index;
  } else {
    index = 0;
  }
  return str.slice(index + 1);
}
