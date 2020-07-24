import coerce from './util/coerce';
import { isRegExp } from '../util/typeChecks';
import { escapeRegExp } from '../util/regexp';
import { coalesceNull } from '../util/lang';

/**
 * Replaces multiple occurrences of a substring with fixed arguments.
 *
 * @param {string} str - The string.
 * @param {string|RegExp} find - A substring or regex to target the substring
 *   to be replaced. When this is a string all occurences of the substring will
 *   be replaced. This notably differs from `String#replace` behavior. If a
 *   regex is passed here it should be global.
 * @param {...string} - Remaining string arguments will be used as positional
 *   replacements. If there are more occurrences of the substring than there
 *   are arguments, the last argument passed will be used.
 *
 * @example
 *
 *   '-x -y -z'.replaceWith('-', 1, 2, 3) -> '1x 2y 3z'
 *   '-x -y -z'.replaceWith('-', 1, 2)    -> '1x 2y 2z'
 *   'one and two'.replaceWith(/one|two/g, '1st', '2nd') -> '1st and 2nd'
 *
 **/
export default function replaceWith(str, find, ...args) {
  str = coerce(str);
  if (!isRegExp(find)) {
    find = RegExp(escapeRegExp(find), 'g');
  }
  let count = 0;
  return str.replace(find, () => {
    return coalesceNull(args[Math.min(count++, args.length - 1)], '');
  });
}
