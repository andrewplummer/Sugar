
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

const fullwide = buildNumeralMapper('fullwide');

// Note that unit tokens in formats like 三百 etc, are not handled
// here or accessible via Intl.NumberFormat, however this is acceptable
// for the purposes of date parsing.
const hanidec = buildNumeralMapper('hanidec');

// Parsing out English tokens one, two, three, etc as a special exception.
const english = buildEnglishMapper();

const LANGUAGES = {
  'en': [english],
  'ja': [hanidec, fullwide],
  'zh': [hanidec],
};

export function parseLocaleNumber(str, language) {
  const mappers = LANGUAGES[language] || [];
  for (let mapper of mappers) {
    str = mapper(str);
  }
  return parseInt(str, 10);
}

function buildNumeralMapper(numberingSystem) {
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

function buildEnglishMapper() {
  const map = {};
  for (let i = 0; i < ENGLISH_NUMERALS.length; i++) {
    map[ENGLISH_NUMERALS[i]] = String(i);
  }
  return (str) => {
    return map[str] || str;
  };
}
