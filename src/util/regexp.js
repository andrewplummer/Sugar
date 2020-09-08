import { isString } from './typeChecks';

const ESCAPE_REG = /([\\/'*+?|()[\]{}.^$-])/g;

export function escapeRegExp(str) {
  if (!isString(str)) {
    str = String(str);
  }
  return str.replace(ESCAPE_REG,'\\$1');
}
