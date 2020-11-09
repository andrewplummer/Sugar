import { JA, KO, ZH, ZH_HANS, ZH_HANT } from './const';
import { UNITS } from './const';

const CJK_LANGUAGES = [JA, KO, ZH];
const MIN_SEC = '分秒';

const TIME_MARKERS = {
  [ZH_HANT]: `點${MIN_SEC}`,
  [ZH_HANS]: `点${MIN_SEC}`,
  [JA]: `時${MIN_SEC}`,
  [KO]: '시분초',
};

export function isCJK(language) {
  return CJK_LANGUAGES.includes(language);
}

const HANIDEC_MAP = {
  '零': 0,
  '一': 1,
  '二': 2,
  '三': 3,
  '四': 4,
  '五': 5,
  '六': 6,
  '七': 7,
  '八': 8,
  '九': 9,
  '十': 10,
  '百': 100,
  '千': 1000,
};

const HANIDEC_REG = /[零一二三四五六七八九十百千]+/g;

export function mapHanidec(str) {
  return str.replace(HANIDEC_REG, (num) => {
    let sum = 0;
    let place = 1;
    for (let i = num.length - 1; i >= 0; i--) {
      const char = num.charAt(i);
      const val = HANIDEC_MAP[char];
      if (val > 0 && val % 10 === 0) {
        place = val;
        sum += place;
      } else if (place > 1) {
        sum += (val - 1) * place;
      } else {
        sum += val;
      }
    }
    return String(sum);
  });
}

// CJK time markers are not reliably accessible through Intl,
// so manually providing them here.
export function getTimeMarker(unit, language, locale) {
  const markers = TIME_MARKERS[locale] || TIME_MARKERS[language];
  if (markers) {
    const index = UNITS.indexOf(unit);
    if (index >= 4 && index <= 6) {
      return markers.charAt(index - 4);
    }
  }
  return '';
}
