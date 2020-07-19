import normalize from './util/normalize';

/**
 * Converts underscores and camel casing to hypens.
 *
 * @param {string} str - The string to convert.
 *
 * @example
 *
 *   'a_farewell_to_arms'.dasherize() -> 'a-farewell-to-arms'
 *   'capsLock'.dasherize()           -> 'caps-lock'
 *
 **/
export default  function dasherize(str) {
  return normalize(str, '-');
}
