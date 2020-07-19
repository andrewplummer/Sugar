import coerce from './util/coerce';

const PARAMETER_REG = /[^a-z0-9\-_]+/gi;

/**
 * Replaces special characters in a string so that it may be used as part of a
 * pretty URL.
 *
 * @param {string} str - The string to convert.
 *
 * @example
 *
 *   'hell, no!'.parameterize() -> 'hell-no'
 *
 **/
export default function parameterize(str, separator = '-') {
  str = coerce(str);
  str = str.toLowerCase();
  str = str.replace(PARAMETER_REG, (seq, i) => {
    if (i === 0 || i + seq.length === str.length) {
      return '';
    } else {
      return separator;
    }
  });
  return encodeURI(str);
}
