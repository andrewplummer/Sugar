import Range from '../util/Range';
import { isString } from '../util/typeChecks';

const MULTIBYTE_START = 0xD800;

export default function(start, end) {
  return new CharRange(start, end);
}

class CharRange extends Range {

  isValidMember(m) {
    if (!m) {
      return false;
    }
    const len = this.getValue(m) > MULTIBYTE_START ? 2 : 1;
    return m.length === len;
  }

  getValue(m) {
    return isString(m) ? m.codePointAt(0) : null;
  }

  getMember(val) {
    // Let an empty string stand in for an unknown invalid value.
    return val >= 0 ? String.fromCodePoint(val) : '';
  }

}
