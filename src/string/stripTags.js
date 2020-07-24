import coerce from './util/coerce';
import { isString } from '../util/typeChecks';

const REG = /<(\/)?\s*([^\s/>]*)\s*([^<>]*?)?\s*(\/)?>/gi;

const EMPTY_TAGS = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

/**
 * Strips HTML tags from the string.
 *
 * @param {string} str - The string.
 * @param {string|replaceFn} replace - Determines what the stripped tags will
 *   be replaced with. Passing a function here will allow custom behavior such
 *   as replacing specific tags or custom content based on tag properties.
 *   Default is an empty string.
 *
 * @callback replaceFn
 * @param {string} tag  - The tag name.
 * @param {string} html - The full html of the stripped tag including brackets.
 * @param {string} type - The tag type. One of "open", "close", or "empty".
 * @param {string} attr - The attributes of the tag as a string.
 * @returns {string}    - The return value will replace the stripped tag.
 *
 * @example
 *
 *   '<p>just <b>some</b> text</p>'.stripTags()    -> 'just some text'
 *   '<b>bold</b>'.stripTags(() => '*') -> '*bold*'
 *   '<p><b>text</b></p>'.stripTags((tag, html) => {
 *      return tag === 'b' ? '' : html;
 *   }); -> '<p>text</p>'
 *
 **/
export default function stripTags(str, replace = '') {
  str = coerce(str);
  const replaceFn = isString(replace) ? () => replace : replace;
  return str.replace(REG, (html, firstSlash, tag = '', attr = '', lastSlash) => {
    const type = getType(tag, firstSlash, lastSlash);
    return replaceFn(tag, html, type, attr);
  });
}

function getType(tag, firstSlash, lastSlash) {
  if (firstSlash) {
    return 'close';
  } else if (lastSlash || EMPTY_TAGS.includes(tag)) {
    return 'empty';
  } else {
    return 'open';
  }
}
