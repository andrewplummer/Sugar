import normalize from './util/normalize';
import capitalize from './util/capitalize';

// Words that should not be capitalized in titles
const DOWNCASED_WORDS = [
  'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at',
  'by', 'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over',
  'with', 'for'
];

const FULL_STOP_REG = /[.:;!]$/;
const WORD_REG = /\w+\S*/g;

/**
 * Capitalizes all the words and replaces some characters in the string
 * to create pretty output for use in titles.
 *
 * @param {string} str - The string to convert.
 *
 * @example
 *
 *   'man from the boondocks'.titleize() -> 'Man from the Boondocks'
 *   'x-men: apocalypse'.titleize() -> 'X-Men: Apocalypse'
 *   'TheManWithoutAPast'.titleize() -> 'The Man Without a Past'
 *   'raiders_of_the_lost_ark'.titleize() -> 'Raiders of the Lost Ark'
 *
 **/
export default function titleize(str) {
  str = normalize(str, ' ');
  let lastWasStop = false;
  return str.replace(WORD_REG, (word, i) => {
    const first = lastWasStop || i === 0;
    const last = i + word.length === str.length;
    const hasPunctuation = FULL_STOP_REG.test(word);
    if (first || last || !DOWNCASED_WORDS.includes(word)) {
      word = capitalize(word);
    }
    lastWasStop = hasPunctuation;
    return word;
  });
}
