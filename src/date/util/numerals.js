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

const FULLWIDE = buildFormatMapper('fullwide');

// Note that unit tokens in formats like 三百 etc, are not handled
// here or accessible via Intl.NumberFormat, however this is acceptable
// for the purposes of date parsing.
const HANIDEC = buildFormatMapper('hanidec');

const LANGUAGES = {
  'en': [mapEnglishNumerals, mapEnglishHalf],
  'ja': [HANIDEC, FULLWIDE],
  'zh': [HANIDEC],
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
