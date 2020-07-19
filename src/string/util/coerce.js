import { isString } from '../../util/typeChecks';

export default function coerce(str) {
  if (!isString(str)) {
    str = String(str);
  }
  return str;
}
