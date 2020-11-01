import { compileRegExpAlternates } from './regex';
import { ENGLISH_NUMERALS } from './numerals';

function buildEnglishOrdinals() {
  return [
    ...'first|second|third'.split('|'),
    ...ENGLISH_NUMERALS.slice(4).map((str) => {
      str = str.replace(/ve$/, 'f');
      str = str.replace(/[et]$/, '');
      return str + 'th';
    }),
  ];
}

function buildTokenOrdinalReg() {
  const arr = ENGLISH_ORDINALS.map((str) => {
    return str.replace(/(st|nd|rd|th)$/, ' $1');
  });
  return compileRegExpAlternates(arr, '');
}

// Matches numeric English ordinals from "1st" up to "31st".
export const REG_NUMERIC_ORDINALS = '[23]?1st|2?2nd|2?3rd|(?:1[0-9]|[23]?[04-9])th';

// "first", "second", "third", up to "tenth"
export const ENGLISH_ORDINALS = buildEnglishOrdinals();

// Regex source matching ordinal tokens.
export const REG_TOKEN_ORDINALS = buildTokenOrdinalReg();

// Regex source matching both numeric and tokenized ordinals
export const REG_ORDINALS = `(?:${REG_NUMERIC_ORDINALS})|(?:${REG_TOKEN_ORDINALS})`;

export function replaceOrdinals(str) {
  return str.split(' ').map((token) => {
    const index = ENGLISH_ORDINALS.indexOf(token);
    return index !== -1 ? index + 1 : token;
  }).join(' ');
}
