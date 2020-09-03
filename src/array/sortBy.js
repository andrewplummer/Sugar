import { isObject, isString } from '../util/typeChecks';
import { assertArray } from '../util/assertions';
import { getMapper } from '../util/mappers';

const DEFAULT_COLLATOR = new Intl.Collator();

/**
 * Sorts the array based on the result of mapped values.
 *
 * @extra As with `Array#sort`, this method will modify the array. Use
 *   `Array#clone` to create a copy if this is not desired.
 *
 * @param {Array} arr - The array.
 * @param {...string|mapFn|SortOptions} - Each passed argument will determine
 *   a field to sort on and/or options for sorting. Functions may be passed here
 *   to map values or a string serving as a shortcut. Implements deep mapping.
 *
 * @returns {Array}
 *
 * @callback mapFn
 *
 *   el   The array element.
 *   arr  A reference to the array.
 *
 * @typedef {Options} SortOptions
 * @property {string|mapFn} [map] - A function to map values or a string serving
 *   as a shortcut. When null, the array element will be used as the value.
 *   Implements deep mapping.
 * @property {boolean} [desc] - When true, sorting on the field will be in
 *   descending order. Default is `false`.
 * @property {Intl.Collator} [collator] - An instance of `Intl.Collator` that
 *   will determine collation affecting the resulting sort order. This may also
 *   be an object that implements a `compare` function returning `-1`, `1`, or `0`.
 *
 * @example
 *
 *   ['aa','aaa','a'].sortBy('length') -> ['a','aa','aaa']
 *   ['aa','aaa','a'].sortBy({
 *     map: 'length',
 *     desc: true
 *   }) -> ['aaa','aa','a']
 *   users.sortBy(function(n) {
 *     return n.age;
 *   }); -> users sorted by age
 *   users.sortBy('age') -> users sorted by age
 *   users.sortBy('name', 'age') -> users sorted by name, then by age
 *   users.sortBy({
 *     map: 'name',
 *     desc: true,
 *     collate: new Intl.Collator('fr'),
 *   }); -> users sorted in descending order by name, using French collation
 *
 **/
export default function sortBy(arr, ...args) {
  assertArray(arr);
  if (!args.length) {
    args = [{}];
  }
  const opts = args.map((arg) => {
    if (!isObject(arg)) {
      arg = {
        map: arg,
      };
    }
    return {
      ...arg,
      mapper: getMapper(arg.map, arr),
    };
  });
  return arr.sort((a, b) => {
    let result;
    for (let opt of opts) {
      result = compare(a, b, arr, opt);
      if (result !== 0) {
        break;
      }
    }
    return result;
  });
}

function compare(a, b, arr, opt = {}) {
  const { mapper, desc, collator = DEFAULT_COLLATOR } = opt;
  const aVal = mapper(a, arr);
  const bVal = mapper(b, arr);
  let result;
  if (isString(aVal) && isString(bVal)) {
    result = collator.compare(aVal, bVal);
  } else if (aVal < bVal) {
    result = -1;
  } else if (aVal > bVal) {
    result = 1;
  } else {
    result = 0;
  }
  if (desc) {
    result *= -1;
  }
  return result;

}
