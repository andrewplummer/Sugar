import coerce from './util/coerce';

/**
 * Removes a substring from the string.
 *
 * @extra This method is simply an alias for `str.replace(find, '')` to better
 *        communicate intent.
 *
 * @param {string} str - The string.
 * @param {string|RegExp} find - A substring or regex to target the substring
 *   to be removed. When this is a string or non-global regex only the first
 *   occurrence will be removed.
 *
 * @example
 *
 *   'foobar'.remove('o')      -> 'fobar'
 *   'foobar'.remove(/[a-f]/g) -> 'foor'
 *
 **/
export default function remove(str, find) {
  str = coerce(str);
  return str.replace(find, '');
}
