import { isString } from '../../util/typeChecks';

const ESCAPE_REG = /([\\/'*+?|()[\]{}.^$-])/g;

export default function(str) {
  if (!isString(str)) {
    str = String(str);
  }
  return str.replace(ESCAPE_REG,'\\$1');
}
