import { deepHasProperty } from '../util/deepProperties';

/**
 * Checks if the object has any non-inherited property that may be nested.
 *
 * @param {Object} obj - The object.
 * @param {string|Array<string>} path - The property or path to check. An array
 *   may be passed here that will traverse deeply into the object to check the
 *   property. Also supports a string as a shortcut to a path. When using
 *   bracket syntax with arrays, negative indexes are allowed.
 *
 * @returns {boolean}
 *
 * @example
 *
 *   Object.has(user, 'name') -> true if user name exists
 *   Object.has(user, ['profile', 'name']); -> true if user profile name exists
 *   Object.has(user, 'profile.name');      -> true if user profile name exists
 *   Object.has(user, 'posts[1].title'); -> true if second post title exists
 *   Object.has(user, 'posts[-1].title'); -> true if last post title exists
 *
 **/
export default function has(obj, path) {
  return deepHasProperty(obj, path);
}
