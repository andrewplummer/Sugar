import pad from '../util/pad';

export default function toHex(n, digits) {
  return pad(n, digits, null, false, 16);
}
