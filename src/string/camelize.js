import normalize from './util/normalize';
import capitalize from './util/capitalize';

// Regex matching camelCase.
const CAMELIZE_REG = /(^|_)([^_]+)/g;

/**
 * Converts underscores and hyphens to camel case.
 *
 * @param {string} str - The string to convert.
 * @param {boolean} first - Whether to upcase the first letter. Default is
 *   `true`.
 *
 *
 * @example
 *
 *   'caps_lock'.camelize()              -> 'CapsLock'
 *   'moz-border-radius'.camelize()      -> 'MozBorderRadius'
 *   'moz-border-radius'.camelize(false) -> 'mozBorderRadius'
 *
 **/
export default  function camelize(str, first = true) {
  str = normalize(str, '_');
  return str.replace(CAMELIZE_REG, function(match, pre, word, index) {
    return first || index > 0 ? capitalize(word, true) : word;
  });
}
