import { mapHanidec, mapNormalize } from './cjk';

export const ENGLISH_NUMERALS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
];

const ENGLISH_HALF_REG = /(?:a )?half(?: an?)?/;

const mapFullWide = buildFormatMapper('fullwide');

// Note that although Intl provides access to hanidec tokens it
// maps them in a very naive way (no unit placeholders like 十),
// so need to use something more advanced here.

const LANGUAGES = {
  'en': [mapEnglishNumerals, mapEnglishHalf],
  'ja': [mapHanidec, mapNormalize, mapFullWide],
  'zh': [mapHanidec],
};

export function replaceLocaleNumerals(str, language) {
  const mappers = LANGUAGES[language] || [];
  for (let mapper of mappers) {
    str = mapper(str);
  }
  return str;
}

function buildFormatMapper(numberingSystem) {
  const map = {};
  // Passed locale will not affect output.
  const formatter = new Intl.NumberFormat('en', {
    numberingSystem,
  });
  for (let i = 0; i < 10; i++) {
    map[formatter.format(i)] = String(i);
  }
  return (str) => {
    let result = '';
    for (let char of str) {
      result += map[char] || char;
    }
    return result;
  };
}

function mapEnglishNumerals(str) {
  return str.split(' ').map((token) => {
    const index = ENGLISH_NUMERALS.indexOf(token);
    return index !== -1 ? String(index) : token;
  }).join(' ');
}

function mapEnglishHalf(str) {
  return str.replace(ENGLISH_HALF_REG, '.5');
}
