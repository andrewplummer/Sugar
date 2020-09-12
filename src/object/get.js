import { deepGetProperty } from '../util/deepProperties';

/**
 * Gets any non-inherited property from the object that may be nested.
 *
 * @param {Object} obj - The object.
 * @param {string|Array<string>} path - The property or path to find. An array
 *   may be passed here that will traverse deeply into the object to get the
 *   value. If any property in the path does not exist, `undefined` will be
 *   returned. Also supports a string as a shortcut to a path. When using
 *   bracket syntax with arrays, negative indexes are allowed. Range syntax
 *   can also be used to return array slices.
 *
 * @returns {any}
 *
 * @example
 *
 *   Object.get(user, 'name') -> user.name
 *   Object.get(user, ['profile', 'name']); -> user profile name if it exists
 *   Object.get(user, 'profile.name'); -> user profile name if it exists
 *   Object.get(user, 'posts[1].title'); -> second post title if it exists
 *   Object.get(user, 'posts[-1].title'); -> last post title if it exists
 *   Object.get(user, 'posts[0..1].title'); -> first and second post titles
 *   Object.get(user, 'posts[1..].title'); -> second to last post titles
 *
 **/
export default function get(obj, path) {
  return deepGetProperty(obj, path);
}
