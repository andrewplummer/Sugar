import { isString } from '../../util/typeChecks';

export default function getIndex(str, index, fromEnd) {
  if (isString(index)) {
    index = str.indexOf(index);
    if (index === -1) {
      index = fromEnd ? str.length : 0;
    }
    return index;
  } else if (Number.isInteger(index)) {
    return index;
  } else {
    throw new TypeError('Index must be an integer or string.');
  }
}

