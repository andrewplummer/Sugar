import coerce from './util/coerce';

const REG = /[&<>]/g;

const MAP = {
  '<': 'lt',
  '>': 'gt',
  '&': 'amp',
};

/**
 * Converts HTML tags and ampersands to entities.
 *
 * @param {string} str - The string.
 *
 * @example
 *
 *   '<p>some text</p>'.escapeHTML() -> '&lt;p&gt;some text&lt;/p&gt;'
 *   'one & two'.escapeHTML()        -> 'one &amp; two'
 *
 **/
export default function escapeHtml(str = '') {
  str = coerce(str);
  return str.replace(REG, function(chr) {
    return `&${MAP[chr]};`;
  });
}
