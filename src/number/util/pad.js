import replaceInteger from './replaceInteger';

export default function(n, digits, precision, forceSign, base) {
  return replaceInteger(n, precision, forceSign, base, str => {
    return str.padStart(digits, '0');
  });
}
