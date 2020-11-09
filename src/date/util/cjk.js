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
