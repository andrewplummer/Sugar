import { isNumber } from '../../util/typeChecks';
import { assertFunction, assertPositiveInteger } from '../../util/assertions';

export default function createLockFilter(condition, lockState) {
  let locked = false;

  if (isNumber(condition)) {
    assertPositiveInteger(condition);
    condition = createIterationLock(condition);
  }

  assertFunction(condition);

  return function() {
    if (!locked) {
      locked = condition.apply(this, arguments);
    }
    return locked === lockState;
  }
}

function createIterationLock(limit) {
  let count = 0;
  return function() {
    count += 1;
    return limit <= count;
  }
}
