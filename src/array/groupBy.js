import { mapWithShortcuts } from '../util/enumerable';
import { hasOwnProperty, forEachProperty } from '../util/helpers';

/**
 * Groups the array by `map` to an object.
 *
 * @param {Array} arr - The array.
 * @param {mapFn|string} map - A function that maps the array elements to keys
 *     or a string acting as a shortcut (supports `deep properties`).
 * @param {groupFn} [groupFn] - An optional callback that is called for each group.
 *
 * @callback mapFn
 *
 *   el   {number} The element of the current iteration.
 *   i    {number} The index of the current iteration.
 *   arr  {Array}  A reference to the array.
 *
 * @callback groupFn
 *
 *   arr  {Array}  The current group as an array.
 *   key  {string} The unique key of the current group.
 *   obj  {Object} A reference to the object.
 *
 * @example
 *
 *   ['a','aa','aaa'].groupBy('length') -> { 1: ['a'], 2: ['aa'], 3: ['aaa'] }
 *
 *   users.groupBy(function(n) {
 *     return n.age;
 *   }); -> users array grouped by age
 *
 *   users.groupBy('age', function(age, users) {
 *     // iterates each grouping
 *   });
 *
 * @returns {Object}
 *
 **/
export default function groupBy(arr, map, groupFn) {
  const result = {};
  for (let i = 0, len = arr.length; i < len; i++) {
    const el = arr[i];
    const key = mapWithShortcuts(el, map, arr, [el, i, arr]);
    if (!hasOwnProperty(result, key)) {
      result[key] = [];
    }
    result[key].push(el);
  }
  if (groupFn) {
    forEachProperty(result, groupFn);
  }
  return result;
}
