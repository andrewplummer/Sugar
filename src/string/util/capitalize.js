
// Matches non-punctuation characters except apostrophe for capitalization.
const CAPITALIZE_REG = /[^\u0000-\u0040\u005B-\u0060\u007B-\u007F]+('s)?/g;

/**
 * Capitalizes the first character of the string.
 *
 * @param {string} str - The string.
 * @param {boolean} [lower] - When `true` the remainder of the string will
 *     be lower case. Default is `false`.
 * @param {boolean} [all] - When `true` all words in the string will be
 *     capitalized. Default is `false`.
 *
 * @example
 *
 *   'hello'.capitalize()           -> 'Hello'
 *   'HELLO'.capitalize(true)       -> 'Hello'
 *   'hello kitty'.capitalize()     -> 'Hello kitty'
 *   'hEllO kItTy'.capitalize(true, true) -> 'Hello Kitty'
 *
 **/
export default function capitalize(str, downcase, all) {
  if (downcase) {
    str = str.toLowerCase();
  }
  return all ? str.replace(CAPITALIZE_REG, caps) : caps(str);
}

function caps(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
