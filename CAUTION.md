## Caution!

Here you will find points of caution when updating Sugar to a new version.
Think of it as a pruned Changelog with the most front-facing changes surfaced.
If your code breaks on update check here first!


Read all the ones that are greater than the version you are migrating from.




v1.2.5+
=======

- Level: Major
  - `String#truncate` arguments changed. `ellipsis` (`"..."` by default) is now the last argument of four. Second argument is now `split` which is true by default, so the method will behave like standard truncate methods by default. `from` added as the third parameter and determines where to truncate. Can be `"right"` (default), `"left"`, or `"middle"`.

- Level: Major
  - `Function#debounce` no longer has an argument `wait`. Equivalent function is now `Function#throttle` (no arguments). `fn.debounce(100, false)` is now `fn.throttle(100)`.

- Level: Minor
  - `Object.isObject` now returns `true` for extended objects.


v1.2.4+
=======

- Level: Minor
  - Object.equal and its instance method form "equals" is now considered "egal". This means that, for example, new String('w') will NOT be equal to 'w', etc. Previously equal was nearly egal, but not quite, so this should only affect very small edge cases. This now means that Sugar will match Underscore's _.isEqual method 100% of the time with the only exception being custom "isEqual" methods that Underscore checks explicitly.

- Level: Very Minor
  - Object.merge will now merge properties of non-objects like functions.



v1.2.3+
=======

- Level: Major
  - String#compare, Number#compare, and Date#compare are deprecated

- Level: Major
  - Object.merge params are swapped. `resolve` is now the 4th parameter and `deep` is now 3rd.
  - When using extended objects, this are now 2nd and 3rd parameters. `deep` is now false by default.

- Level: Minor
  - Array#sortBy now exhibits more sensible behavior when sorting on strings.



v1.2.2+
=======

- Level: Very Minor
  - Extended objects now keep their "Hash" constructor (which is internal) so they no longer have `Object` as their constructor. If you are doing instanceof checks here this may break (which you shouldn't be doing anyway)



v1.2+
=====

- Level: Major
  - Array methods now use "fuzzy object matching" when passing an object. As an example, `arr.find({ foo: 'bar' })` would previously only match an identical object, now it will match any object whose `foo` property is `bar`. Additionally, note that passing regexes and functions will be used to match (regexes match against strings, functions are callbacks that return `true`/`false`), not compared directly. This applies to the following array methods: `every`, `some`, `filter`, `find`, `findAll`, `findIndex`, `remove`, `none`, `count`, and `exclude`.

- Level: Major
  - Object.sugar renamed to Object.restore. However Object.sugar() equivalent is now Object.extend().

- Level: Minor
  - Object.merge now also merges undefined properties.



v1.1.2+
=======

- Level: Minor
  - Function#after will now call a method immediately if the passed value is `0`.

- Level: Very minor
  - Object.isEmpty will now properly report `false` for primitive types like `null` and empty strings.



v1.1.1+
=======

- Level: Major
  - Object.merge no longer merges an arbitrary number of arguments. Use extended objects and chaining instead.

- Level: Minor
  - Array#remove and Array#exclude now no longer accept an arbitrary number of arguments. Pass only 1 argument to these methods (may be a nested array).



v1.1+
=====

- Level: Major
  - Object.equals renamed to Object.equal.

- Level: Major
  - Number#format "thousands" and "decimal" parameters are now pushed to the 2nd and 3rd parameters, adding a "place" for the decimal as the 1st.

- Level: Minor
  - A few tokens were removed from Date#format. See sugarjs.com/dates for a list of currently accepted tokens.

- Level: Minor
  - Function#lazy now executes, then waits as opposed to waiting, then executing.

- Level: Minor
  - Array#sortBy is now no longer destructive, so you will need to set the variable explicitly.



v1.0+
=====


- Level: Major
  - String#normalize is removed, but now available in the Inflections module, available at sugarjs.com/customize.

- Level: Major
  - String#is/hasArmenian, is/hasBopomofo, is/hasEthiopic, and is/hasGeorgian deprecated.

- Level: Minor
  - Passing a second parameter to Date#set now no longer resets only the time, but also any unit less specific than the most specific one set. So if the object `{ hours: 5 }` is passed with the second parameter `true`, minutes, seconds, and milliseconds will be reset.

- Level: Minor
  - Passing "relative" as the format to Date#format is now deprecated, and instead Date#relative.

- Level: Minor
  - Date.allowVariant deprecated in favor of the locale system. Any locale that is not 'en' or 'en-US' will use variants when ambiguities exist.

- Level: Very minor
  - Date#format token suffixes " short", and " pad" deprecated.

- Level: Very minor
  - When passing a function to Date#format or Date#relative, the "dir" parameter is now deprecated. Instead the milliseconds argument has a sign directly on it.



v0.9.5+
=======


- Level: Major
  - Array#split deprecated.

- Level: Major
  - String#toObject is now Object.fromQueryString.

- Level: Major
  - Function.lazy is now Function#lazy and is called directly on function instances.

- Level: Major
  - Function#defer is now simply Function#delay with no arguments.

- Level: Moderate
  - Object.clone is now shallow by default.



v0.9.3+
=======


- Level: Major
  - Array#each is no longer an alias of Array#forEach and now has its own behavior including a 2nd parameter for the start index, 3rd parameter for looping from the beginning, returning the array, allowing returning false to break the loop, passing the array as scope to the callback, and support for sparse arrays.

- Level: Major
  - Array#eachFromIndex deprecated.

- Level: Major
  - Array#removeAtIndex renamed to Array#removeAt.

- Level: Major
  - Array#collect deprecated.

- Level: Major
  - Array#shuffle deprecated.

- Level: Major
  - String#titleize deprecated. It is now available again as of v1.2 in the Inflections module, available at sugarjs.com/customize.

- Level: Major
  - String#pad/padLeft/padRight changed argument order to padding first and number second.

- Level: Moderate
  - Array#indexOf/lastIndexOf now performs a simple `===` equality check instead of a deep recursive property check.

- Level: Minor
  - String#repeat will now return a blank string on numbers less than 1.

- Level: Minor
  - String#dasherize and String#underscore now strip whitespace.



v0.9.1+
=======

- Level: Major
  - Object.create changed to Object.extended.


