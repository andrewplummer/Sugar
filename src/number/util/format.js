import replaceInteger from './replaceInteger';

export default function format(n, precision, forceSign) {
  return replaceInteger(n, precision, forceSign, 10, str => {
    for (let i = str.length - 3; i > 0; i -= 3) {
      str = str.slice(0, i) + ',' + str.slice(i);
    }
    return str;
  });
}
