## Caution!

Here you will find points of caution when updating Sugar to a new version.
Think of it as a pruned Changelog with the most front-facing changes surfaced.
If your code breaks on update check here first! Read all the ones that are greater than the version you are migrating from.

### Note about versions < 1.3.9

Version 1.4.0 improves future-compatibility by ensuring that browser updates do not cause breakages going forward. Upgrading is highly recommended, however as there are also many API changes, [this patch](https://raw.github.com/andrewplummer/Sugar/master/lib/patches/sugar-es6-patch.min.js) was created for older versions. Just drop it in after the main script.



v1.4.1+
=======

- Level: Minor
  - `Object.select` and `Object.reject` now will match values when passed an object. This means that if you pass `{foo:'bar'}`, it will no longer match if the value of `foo` in your object is not `bar`. Previously it would match simply if the key existed.


v1.4.0+
=======

- Level: Major
  - `pad`, `padLeft`, and `padRight` now pad to the exact character. This means that `padLeft(20)` will produce a string exactly 20 characters long, instead of adding 20 characters worth of padding to the left side of the string as before. You can use `String#repeat` for the same effect as the old functionality.

- Level: Major
  - `Object.fromQueryString` now does not cast values by default. This means that all values in the resulting object are strings, unless `castBoolean` is true, which will cast boolean values of "true" and "false" only. Digits are no longer cast to numbers at all. Additionally, the "deep" argument is now removed. Deep parameters will always be parsed if they can be.

- Level: Major
  - `Function#lazy` now has different arguments. `limit` is now the third argument with `immediate` taking its place as second. Additionally `immediate` -- which determines whether lazy functions are executed immediately then lock or lock then execute after a timeout -- is now false by default.

- Level: Major
  - Date range methods `eachDay`, `eachMonth`, etc. are deprecated in favor of the syntax `every("day")`, etc.

- Level: Major
  - Date range method `duration` is deprecated in favor of `span`. Additionally it will add 1 to the duration to include the starting number itself. In effect for date ranges this means that `duration` will be 1 ms longer.

- Level: Major
  - `Range#step` alias was removed. Use `Range#every` instead.

- Level: Major
  - Date formatting tokens `z` and `zz` are now `Z` and `ZZ`. Additionally `zzz` was removed.

- Level: Moderate
  - `Array#find` now works according to the ES6 spec. This means that it will no longer take a `fromIndex` or `loop` arguments. Instead, the second argument is the context in which the function matcher will be run. If you need the previous functionality, use `Array#findFrom` and `Array#findIndexFrom` instead.

- Level: Moderate
  - `Array.sortBy` now performs a natural sort by default. This means numbers (any consecutive numbers, so this will include currency formatting, etc.) will sort as numbers, (2 before 100). If you do not want this behavior, set the flag `Array.AlphanumericSortNatural` to `false`.

- Level: Moderate
  - `Object.clone` now will error if being called on a user-created class instance or host object (DOM Elements, Events, etc). A number of complex issues tie in here, but in the end it is unreliable to call `clone` on an object that is not a standard data types as 1) hidden properties cannot be cloned 2) the original arguments to the constructor cannot be known 3) even if they could be known the issue of whether or not the constructor should actually be called again is not clear.

- Level: Moderate
  - The `split` argument was removed from `String#truncate`. For truncating without splitting words, use `String#truncateOnWord` instead. Argument position is adjusted accordingly.

- Level: Moderate
  - Class instances are now internally matched by reference only. This means that `Object.equal(new Person, new Person)` will now be `false`. This was in fact the original intended behavior but a bug had not been closed here leading to it not actually being `false`. Although a case can be made for matching class instances by value, in the end it is too expensive and tricky to distinguish them from host objects, which should never be matched by value. Instead it is better to check for equality of class instances on a unique identifier or the like.

- Level: Moderate
  - `Object.isObject` will now no longer return true for class instances for the same reasons listed above. This also was intended behavior but was defective.

- Level: Moderate
  - `String#normalize` is now deprecated, but still available as a separate script in the `lib/plugins` directory.

- Level: Moderate
  - Date ranges are now their own package (the "range" package), are not dependent on the Date package, and work on numbers and strings as well.

- Level: Minor
  - Enumerable methods on object will now coerce primitive types. This means that `Object.findAll('foo')` will now treat `'foo'` as `new String('foo')`. This is reversed from the previous behavior which would error on primitive types and coerce objects to primitive types where possible.

- Level: Minor
  - `String#capitalize` passing the `all` flag now will not capitalize after an apostrophe.

- Level: Very Minor
  - Date ranges that have an end that is less than the start are now no longer considered invalid, and can be iterated across in exactly the same manner. This means that ranges can now be iterated in reverse and .start and .end are no longer equivalent to .min and .max.

- Level: Very Minor
  - Removed `Number#upto` and `Number#downto` will now work on inverse ranges. In other words (1).downto(5) if represented as an array will now produce [1,2,3,4,5] even though 1 is less than 5 and the operator was "downto". It will also step through the range accordingly.

- Level: Very Minor
  - Passing a regex to array matching methods like `findAll` will now match it directly against the element in the array, regardless of whether or not the matched element is a string or not. This makes the logic more straightforward but it also means that it will stringify the element before attempting to match. If, for example, you have instances of classes in the array and the regex is /t/, the /t/ will return true for that element as it will match the stringified "[object Object]" of the instance, which is likely not what you want, so caution is needed here.

- Level: Very Minor
  - Passing `null` to `.map` will now have the same effect as `undefined` (or no arguments), that is, no mapping will occur. This will apply to any method making use of the internal `transformArgument`, so `Array#min`, `Array#max`, and `Array#groupBy` are affected as well.

- Level: Very Minor
  - `String#pad/padLeft/padRight` will now raise an error on padding to a negative number. Conversely, they will no longer raise an error on undefined/null/NaN.


v1.3.9+
=======

- Level: Major
  - Removed `String#namespace`.


v1.3.8+
=======

- Level: Major
  - Renamed `Date#getWeek` and `Date#setWeek` to `Date#getISOWeek` and `Date#setISOWeek`.

- Level: Very Minor
  - Object.clone will now preserve a date's internal utc flag when set.


v1.3.7+
=======

- Level: Major
  - `String#startsWith` and `String#endsWith` now accept different arguments to better align them with the Harmony proposal of the same name. The second argument is now the "position" that limits where the string starts/ends, and the "case" flag indicating case sensitivity is now pushed to the 3rd argument.

- Level: Major
  - Enumerable object methods are now included when using `Object.extend()` making it that much more dangerous, especially as generic methods like `count` are now defined on the Object prototype. If you use this method, make sure you are in the habit of using `hasOwnProperty` when checking for presence inside a hash (probably not a bad idea anyway). Also note that Sugar itself has a number of areas that may exhibit unexpected behavior when this method is applied. Please report if you find any.

- Level: Moderate
  - Aliases on dates such as `daysAgo` will now count "past" an integer instead of rounding. This means that `Date.create('23 hours ago').daysAgo()` will now be `0`. There is however a small margin of error (roughly 0.1%) that will trigger a round up, which is higher for months, which have a more vague definition and a higher margin for error.


v1.3.6+
=======

- Level: Very Minor
  - Float values should be properly parsed in `Object.fromQueryString`, meaning IP addresses and the like will now parse as strings instead of truncated numbers.

- Level: Very Minor
  - NaN is no longer true for `isOdd`.

- Level: Very Minor
  - Date parsing now only allows a maximum of 59 for minutes and seconds.


v1.3.5+
=======

- Level: Very Minor
  - `Array.create` now properly creates arrays from objects.


v1.3.2+
=======

- Level: Minor
  - `Date.create` will no longer set the UTC flag on dates created from an ISO string with the "Z" flag. This can be considered a bug introduced in the last release. The "Z" flag indicates that a date is in UTC time, but should not serve as an indication that the date should further be manipulated as UTC, only as a cue when parsing. If you want the date to actually behave as UTC (internally call UTC methods), then you need to explicitly set with `Date#utc(true)` now.


v1.3.1+
=======


- Level: Major
  - Array methods that allow fuzzy matching on an object (`findAll`, `filter`, `some`, etc.) as well as `unique`, `intersect`, `union`, and `subtract`, will now match by reference unless certain conditions are met. Most notably this means that arrays of functions as well as arrays of host objects (DOM elements, etc.) will now only match elements that are strictly true by reference (`===`). If you are using arrays of host objects or functions (event handlers and the like), use caution upgrading. Other kinds of arrays such as primitives (strings, numbers, etc) as well as object literals and instances of user-defined objects should not be affected.

- Level: Major
  - `Date#toUTC` deprecated. Previously, this method would subtract the timezone offset of the date, providing a pseudo-utc date. This was a very primitive way of handling the challenge of manipulating utc dates and had drawbacks such as subsequent date manipulations resetting to a localized time. This is now deprecated in favor of `Date#utc`, which simply sets an internal flag that will tell Sugar to use utc-based date methods or not. `Date#utc` will NOT manipulate the time in any way. To create a utc-based date that is set to utc time, a flag has been added to `Date#create`, and other creation methods like `Date#future` and `Date#past` to set the utc flag before parsing out the date.

- Level: Major
  - `Date#setUTC` deprecated. Instead, simply set the utc flag using `Date#utc` or passing `true` as the third argument to `Date#create`. After this point, utc-based methods will be used internally, making this method unnecessary.

- Level: Major
  - `Date#setUTCWeek` deprecated. Set the utc flag and use `Date#setWeek` instead.

- Level: Major
  - `Date#getUTCWeek` deprecated. Set the utc flag and use `Date#getWeek` instead.

- Level: Major
  - `Date#setUTCWeekday` deprecated. Set the utc flag and use `Date#setWeekday` instead.

- Level: Minor
  - `Date#clone` will now preserve the utc flag.

- Level: Minor
  - Array methods matching an empty object `{}` will now return true instead of false against another empty object.

- Level: Very Minor
  - `Date#setWeekday` now returns a timestamp instead of `undefined`.


v1.3+
=======


- Level: Major
  - Date locales are now moved into a separate package. This means that now with the default download package, setting the date locale to anything other than English will throw an error. If you require locales other than English, please include them from [the customize page](http://sugarjs.com/customize).

- Level: Major
  - `Array#min`, `Array#max`, `Array#least`, and `Array#most` now return a single value instead of an array. If you need to get "all min" or "all max" values, then pass `true` as the second argument to these methods.

- Level: Major
  - `Array#has` is deprecated. Use `Array#some` or `Array#any` instead.

- Level: Major
  - `String#toDate` is deprecated. Use `Date.create` instead.

- Level: Major
  - `String#add`, `String#insert`, `Array#add`, and `Array#insert` now consider negative indexes to be the same as built-in `Array#slice`. This means that adding 'd' to 'abc' at index -1 now results in 'abdc' instead of 'abcd'.

- Level: Major
  - Date parsing is now scoped by locale. Previously setting a locale would add all its formats into a common pool that would match from that point on. Now the locale must be either be set beforehand `Date.setLocale('fr')` or explicitly passed `Date.create('...', 'fr')`. The exception to this are numeric formats which are core formats and will parse in any locale.

- Level: Minor
  - Extended objects that are otherwise identical to non-extended counterparts are now considered equal by `Object.equal`.

- Level: Minor
  - `Object.isEmpty` will now error when passed a non-object. This includes object versions of primitives like strings, numbers, and booleans.

- Level: Minor
  - Default date output format `date.format()` now includes the time. Previously this was just the date.

- Level: Minor
  - `Array#groupBy` no longer returns extended objects. Use `Object.extended` on the result if you need this.

- Level: Minor
  - Unrecognized locale codes will now simply produce an invalid date instead of throwing an error. Likewise, fully qualified locale codes ('it_IT') will fall back to 2 character codes ('it') before giving up.

- Level: Very Minor
  - Array methods using fuzzy matching (findAll, remove, etc.) now match instances of classes as well as plain objects.

- Level: Very Minor
  - `String#capitalize` with the first argument as `true` (capitalize all words) will now capitalize any letter whose previous letter could not be capitalized. Previously only words after spaces were counted.



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


