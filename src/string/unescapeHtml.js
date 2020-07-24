import coerce from './util/coerce';

const REG = /&#?(x)?([\w\d]{0,5});/gi;

const MAP = {
  'lt':    '<',
  'gt':    '>',
  'amp':   '&',
  'nbsp':  ' ',
  'quot':  '"',
  'apos':  "'"
};

/**
 * Restores escaped HTML characters.
 *
 * @param {string} str - The string.
 *
 * @example
 *
 *   '&lt;p&gt;some text&lt;/p&gt;'.unescapeHTML() -> '<p>some text</p>'
 *   'one &amp; two'.unescapeHTML()                -> 'one & two'
 *
 **/
export default function unescapeHTML(str = '') {
  str = coerce(str);
  return str.replace(REG, function(full, hex, code) {
    return MAP[code] || String.fromCharCode(hex ? parseInt(code, 16) : +code);
  });
}
