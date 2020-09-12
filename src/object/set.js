import { deepSetProperty } from '../util/deepProperties';

/**
 * Sets a property in the object that may be nested.
 *
 * @param {Object} obj - The object.
 * @param {string|Array<string>} path - The property or path to set. An array
 *   may be passed here that will traverse deeply into the object to set the
 *   value. Also supports a string as a shortcut to a path. If any part of the
 *   path does not exist it will be initialized. When using a string shortcut,
 *   initialization will be an empty object `{}` when using dot syntax or empty
 *   array `[]` when using bracket syntax. When using bracket syntax with arrays
 *   negative indexes are allowed and no index will push the value onto the end
 *   of the array. Additionally, range syntax may be used to set the same value
 *   on slices of the array.
 * @param {any} val - The value to set. Will throw an error if not passed.
 *
 * @returns {Object} - A reference to the object, which will be modified.
 *
 * @example
 *
 *   Object.set(user, 'name', 'Jerry') -> sets the user name
 *   Object.set(user, ['profile', 'name'], 'Jerry'); -> sets the profile name
 *   Object.set(user, 'profile.name', 'Jerry'); -> sets the profile name
 *   Object.set(user, 'posts[1].title', 'post'); -> sets the second post title
 *   Object.set(user, 'posts[-1].title', 'post'); -> sets the last post title
 *   Object.set(user, 'posts[0..1].title', 'post'); -> sets the first and second post titles
 *   Object.set(user, 'posts[-2..-1].title', 'post'); -> sets the second to last and last titles
 *   Object.set(user, 'posts[1..].title', 'post'); -> sets post titles from second to last element
 *   Object.set(data, 'users[]', user); -> pushes the user object onto the inner array
 *   Object.set({}, 'a.b.c', 1); -> {a:{b:{c:1}}}
 *   Object.set({}, 'users[0].name', 'Jerry'); -> {users:[{name:'Jerry'}]}
 *
 **/
export default function set(obj, path, val) {
  deepSetProperty(obj, path, val);
  if (arguments.length < 3) {
    throw new TypeError('Value required');
  }
  return obj;
}
