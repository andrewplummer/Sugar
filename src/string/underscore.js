import normalize from './util/normalize';

/**
 * Converts hyphens and camel casing to underscores.
 *
 * @param {string} str - The string to convert.
 *
 * @example
 *
 *   'a-farewell-to-arms'.underscore() -> 'a_farewell_to_arms'
 *   'capsLock'.underscore()           -> 'caps_lock'
 *
 **/
export default function underscore(str) {
  return normalize(str, '_');
}
