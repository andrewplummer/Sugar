import { assertPlainObject } from '../util/object';
import { isFunction } from '../util/typeChecks';
import { mergeDeep } from '../util/merge';

/**
 * Creates a new object with deeply merged properties of all objects passed.
 *
 * @extra This method will not modify objects passed. Use `merge` instead to
 *   directly mutate a target object. Nested plain objects will also be a new
 *   copy. Inherited and non-enumerable properties will not be merged.
 *   Enumerable getters will be merged by value only. An error will be thrown
 *   if any object passed is not "plain", created by either bracket syntax or
 *   `Object.create`. Cyclic objects will throw a TypeError.
 *
 *   For a shallow merge use `Object.assign` or the
 *   [object spread syntax](https://mzl.la/2ZyFTyz) instead.
 *
 * @param {...Object} - Source objects are enumerated as arguments here.
 * @param {resolverFn} [resolver] - A function to determine the value when a
 *   collision occurs. If this function is not provided or returns `undefined`,
 *   the value of the last provided source object in which this property exists
 *   will be used, or will deeply merge in the case of plain objects. Must be
 *   passed as the last argument.
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
 *   Object.add({a:1}, {a:1,b:2}) -> {a:1,b:2}
 *   Object.add({a:1,b:2}, {a:2}) -> {a:1,b:2}
 *   Object.add({a:1,b:2}, {a:2}, (key, n1, n2) => n1 + n2) -> {a:3,b:2}
 *
 **/
export default function add(...args) {
  let sources;
  let resolver;
  if (isFunction(args[args.length - 1])) {
    sources = args.slice(0, -1);
    resolver = args[args.length - 1];
  } else {
    sources = args;
  }
  if (!sources.length) {
    throw new TypeError('Source object must be provided');
  }
  const target = {};
  for (let source of sources) {
    assertPlainObject(source);
    mergeDeep(target, source, resolver, true);
  }
  return target;
}
