import { isCJK } from './cjk';

export function getIntlFormatter(locale, options) {
  if (isCJK(getLanguage(locale))) {
    return new PatchedDateTimeFormat(locale, options);
  } else {
    return new Intl.DateTimeFormat(locale, options);
  }
}

//export function getIntlRelativeFormatter(locale, options) {
  //if (isCJK(getLanguage(locale))) {
    //return new PatchedRelativeTimeFormat(locale, options);
  //} else {
    //return new Intl.RelativeTimeFormat(locale, options);
  //}
//}

//export function getIntlNumberFormatter(locale, options) {
  //if (isCJK(getLanguage(locale))) {
    //return new PatchedNumberFormat(locale, options);
  //} else {
    //return new Intl.NumberFormat(locale, options);
  //}
//}

export function findPart(parts, type) {
  return parts.find((part) => part.type === type);
}

export function getLanguage(locale) {
  locale = ensureLocale(locale);
  return locale.slice(0, 2);
}

// If no locale is provided then need to fall back to
// browser default. This can be done by creating a new format
// object and checking its resolvedOptions.
export function ensureLocale(locale) {
  if (!locale) {
    const formatter = new Intl.DateTimeFormat();
    locale = formatter.resolvedOptions().locale;
  }
  return locale;
}

const LITERAL_REG = /^月/;

// Patch for CJK months incorrectly being reported in
// formatToParts as a literal instead of the unit value.
class PatchedDateTimeFormat extends Intl.DateTimeFormat {

  format(date) {
    return this.formatToParts(date).map((part) => part.value).join('');
  }

  formatToParts(date) {
    const parts = super.formatToParts(date);
    const monthPart = findPart(parts, 'month');
    if (monthPart) {
      const index = parts.indexOf(monthPart);
      const next = parts[index + 1];
      const match = next && next.value.match(LITERAL_REG);
      if (match) {
        monthPart.value += match[0];
        parts.splice(index + 1, 1);
      }
    }
    return parts;
  }
}

//// Patch for ja and zh-Hant locales incorrectly adding a space
//// in relative formats.
//class PatchedRelativeTimeFormat extends Intl.RelativeTimeFormat {

  //format(value, unit) {
    //return this.formatToParts(value, unit).map((part) => part.value).join('');
  //}

  //formatToParts(value, unit) {
    //const parts = super.formatToParts(value, unit);
    //for (let part of parts) {
      //if (part.type === 'literal') {
        //part.value = part.value.trim();
      //}
    //}
    //return parts;
  //}
//}


//// Patch for ja and zh-Hant locales incorrectly adding a space
//// in relative formats.
//class PatchedNumberFormat extends Intl.NumberFormat {

  //format(value) {
    //return this.formatToParts(value).map((part) => part.value).join('');
  //}

  //formatToParts(value) {
    //const parts = super.formatToParts(value);
    //for (let part of parts) {
      //if (part.type === 'literal') {
        //part.value = part.value.trim();
      //}
    //}
    //return parts;
  //}
//}

