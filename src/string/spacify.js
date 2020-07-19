import normalize from './util/normalize';

/**
 * Converts camelcase, underscores, and hyphens to spaces.
 *
 * @param {string} str - The string to convert.
 *
 * @example
 *
 *   'camelCase'.spacify()                         -> 'camel case'
 *   'an-ugly-string'.spacify()                    -> 'an ugly string'
 *   'oh-no_youDid-not'.spacify().capitalize(true) -> 'something else'
 *
 **/
export default function spacify(str) {
  return normalize(str, ' ');
}
