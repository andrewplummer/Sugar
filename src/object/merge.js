import { isPlainObject, assertPlainObject, iterateWithCyclicCheck } from '../util/object';
import { isFunction } from '../util/typeChecks';
import { hasOwnProperty } from '../util/helpers';

/**
 * Performs a deep merge of properties from source object(s) into a target
 *   object.
 *
 * @extra This method will modify the object! Use `add` for a non-destructive
 *   alias. Inherited and non-enumerable properties will not be merged.
 *   Enumerable getters will be merged by value only. An error will be thrown
 *   if either argument is not a "plain" object, created by either bracket
 *   syntax or `Object.create`. Cyclic objects will throw a TypeError.
 *
 * @param {Object} target - The target object.
 * @param {...Object} - Sources are enumerated as arguments here.
 * @param {resolverFn} [resolver] - A function to determine the value when a
 *   collision occurs. If `undefined` is returned, the merge will be handled
 *   normally. If this function is not provided, will take the value of the
 *   source object or deeply merge in the case of plain objects. Must be passed
 *   as the last argument.
 *
 * @returns {Object}
 *
 * @callback resolverFn
 *
 *   key  The key of the current entry.
 *   tVal The value in `target` for the current entry.
 *   sVal The value in `source` for the current entry.
 *   target A reference to the target object.
 *   source A reference to the source object.
 *
 * @example
 *
 *   Object.merge({a:1}, {a:1,b:2}) -> {a:1,b:2}
 *   Object.merge({a:1,b:2}, {a:2}) -> {a:1,b:2}
 *   Object.merge({a:1,b:2}, {a:2}, (key, n1, n2) => n1 + n2) -> {a:3,b:2}
 *
 **/
export default function merge(target, ...args) {
  assertPlainObject(target);
  let sources;
  let resolver;
  if (isFunction(args[args.length - 1])) {
    sources = args.slice(0, -1);
    resolver = args[args.length - 1];
  } else {
    sources = args;
  }
  for (let source of sources) {
    assertPlainObject(source);
    mergeDeep(target, source, resolver);
  }
  return target;
}

function mergeDeep(target, source, resolver, stack = []) {
  iterateWithCyclicCheck(source, stack, (key, sVal, stack) => {
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
      val = sVal;
      if (isPlainObject(tVal) && isPlainObject(val)) {
        val = mergeDeep(tVal, val, resolver, stack);
      }
    }
    target[key] = val;
  });
  return target;
}
