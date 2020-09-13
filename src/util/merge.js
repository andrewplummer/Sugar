import { isPlainObject, iterateWithCyclicCheck } from '../util/object';
import { hasOwnProperty } from '../util/helpers';

export function mergeDeep(target, source, resolver, add = false, stack = []) {
  iterateWithCyclicCheck(source, stack, (key, sVal) => {
    let val;
    let tVal = target[key];
    let handled = false;
    if (hasOwnProperty(target, key) && resolver) {
      val = resolver(key, tVal, sVal, target, source);
      if (val !== undefined) {
        handled = true;
      }
    }
    if (!handled) {
      if (isPlainObject(sVal)) {
        if (isPlainObject(tVal)) {
          val = add ? {...tVal} : tVal;
          mergeDeep(val, sVal, resolver, add, stack);
        } else if (add) {
          val = {...sVal};
        } else {
          val = sVal;
        }
      } else {
        val = sVal;
      }
    }
    target[key] = val;
  });
  return target;
}
