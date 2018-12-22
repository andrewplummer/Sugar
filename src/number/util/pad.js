import replaceInteger from './replaceInteger';

export default function pad(n, digits, precision, forceSign, base) {
  return replaceInteger(n, precision, forceSign, base, str => {
    return str.padStart(digits, '0');
  });
}
