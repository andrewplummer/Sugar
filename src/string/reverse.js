import coerce from './util/coerce';

/**
 * Reverses the string.
 *
 * @param {string} str - The string.
 *
 * @example
 *
 *   'jumpy'.reverse()        -> 'ypmuj'
 *   'lucky charms'.reverse() -> 'smrahc ykcul'
 *
 ***/
export default function reverse(str) {
  str = coerce(str);
  return str.split('').reverse().join('');
}

