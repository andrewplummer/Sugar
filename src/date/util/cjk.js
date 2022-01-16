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

// This regex must avoid matching fixed phrases "一昨日", "星期一", etc.
const HANIDEC_REG = /[零一二三四五六七八九十百千]+/g;
const HANIDEC_DISALLOW_REG = /星期|昨日/;

export function isCJK(language) {
  return CJK_LANGUAGES.includes(language);
}

export function mapHanidec(str) {
  if (!HANIDEC_DISALLOW_REG.test(str)) {
    str = str.replace(HANIDEC_REG, (num) => {
      let sum = 0;
      let place = 1;
      let hold;
      for (let i = num.length - 1; i >= 0; i--) {
        const char = num.charAt(i);
        let val = HANIDEC_MAP[char];
        if (val > 0 && val % 10 === 0) {
          sum += val;
          place = val;
          hold = true;
        } else {
          sum += (val - (hold ? 1 : 0)) * place;
          place *= 10;
          hold = false;
        }
      }
      return String(sum);
    });
  }
  return str;
}

export function jaNormalize(str) {
  // Normalize "ヶ月" and "ヵ月" to "か月" to match Intl.
  str = str.replace(/[ヶヵ]/g, 'か');

  // Normalize no space before relative unit to fix RelativeTimeFormat bug.
  str = str.replace(/(\d+)(秒|分|時間|日|週間|か月|年)(前|後)/g, '$1 $2$3');

  return str;
}

export function zhNormalize(str) {
  // Normalize no space before relative unit to fix RelativeTimeFormat bug.
  str = str.replace(/(\d+)(秒|分|時間|日|週間|か月|年)(前|後)/g, '$1 $2$3');
  return str;
}

export function koNormalize(str) {
  // Normalize as spacing mistakes are common here.
  str = str.replace(/(이번|다움|지난)(\S)/g, '$1 $2');
  return str;
}

// CJK time markers are not reliably accessible
// through Intl, so manually providing them here.
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
