v1.1.1
=====

### API Changes ###

- Object.merge now accepts a third parameter that determines what to do in the case of property conflicts. This parameter can be true, false, or a function. This change means that it now no longer accepts an arbitrary number of arguments.
- Added Object.isNaN
- Added Object.tap
- Consolidated the arguments that are passed to mapping functions on methods such as Array#min/max/groupBy/sortBy. All such functions will now be passed the array element, array index, and array object, in that order, to conform to ES5 Array#map behavior.
- Array#flatten can now accept a level of nesting to flatten to. Default is all levels.
- Array#remove no longer works like a reverse concat (ie. no longer flattens arguments passed to it as if they were passed as separate arguments, so removing arrays within arrays should now work properly. This applies to Array#exclude as well.
- Added Array#zip

### Internal Changes ###

- Refactored way in which type/hash methods are mapped
- Fixed Date bug "2 weeks from Monday"

v1.1
=====

### API Changes ###

- Array#unique can now unique on a function, giving a shortcut to uniquify deep objects
- Object.equals renamed to Object.equal in its class method only
- Object.equal now much more robust, can handle cyclic references, etc
- Number#format now accepts a parameter <place> for the decimal. "thousands", and "decimal" are pushed to 2nd and 3rd params
- Date#format now accepts different format tokens. A few counterintuitive ones removed, and others were added to match moment.js including fff, ddd, mmm, etc
- Function#lazy now executes immediately and locks instead of setting a delay
- Added RegExp#getFlags
- Added Function#fill, which allows arguments to be intelligently curried
- Fixed broken support for SpiderMonkey under CouchDB
- Fixed sortBy is unintentionally destructive
- Full Asian date number formats now accepted
- Array#map/min/max/most/least/groupBy/sortBy no longer errors on undefined, null, etc
- Fixed a bug with locking on Number#format when passing digits

### Internal Changes ###

- Optimized for Google closure compilers max compression level
- Minified script dropped about 5kb
- Intelligently determining if cloned objects are extended
- transformArgument now just accepts <map> not the arguments object
- refactored asian digits to be globally replaced
- Date#toJSON and Date#toISOString now properly fall back to native methods
- Significantly wrote asynchronous function tests to be more reliable



v1.0
=====

### API Changes ###

- Object.sugar() now will add all extended object (hash) methods to Object.prototype, letting you opt-in this functionality
- Object.watch() will observe changes in an object property and fire a callback if it has changed
- Array.create() quickly creates arrays, most notably from an arguments object
- Array#groupBy now allows a callback to iterate over each group
- String#normalize method deprecated, but still available in lib directory
- String#is/hasArmenian, is/hasBopomofo, is/hasEthiopic, and is/hasGeorgian deprecated
- String#is/hasLatin added
- String#toDate now accepts a locale parameter
- String#spacify added
- String#assign added
- Date module completely reworked to allow locales
- Date#format " short" token suffix deprecated
- Date#format " pad" token suffix deprecated
- Date#format "dir" parameter passed to the callback deprecated in favor of using the sign directly on the time itself
- Date#format locale now passed to the callback instead of the above
- Date#format passing no arguments now outputs a default simple date format for the current locale
- Date#relative same treatment as Date#format for callbacks as above
- Date.allowVariant for ambiguous dates (8/10/03) refactored to use locales instead
- Date.RFC1123 and Date.RFC1036 fix to not display GMT
- Date.setLocale will set an available locale or allow extending the Date class with new locales
- Date.getLocale gets a localization object (current localization by default)
- Date.addFormat allows additional date formats to be added
- Date#set passing true for the second param will now reset any units less specific, not just the time
- Date#isBefore/isAfter/isBetween now uses a straight comparison rather than trying to extend the bounds of the date based on specificity
- Date#format now accepts a second locale parameter that outputs the date in a specific locale. If no locale is set the current locale is used.
- Date#format passing "relative" as the format is now deprecated. Use Date#relative instead
- Function#lazy now accepts a "limit" parameter that will prevent a lazy function from queueing calls beyond a certain limit
- Function#debounce now accepts a "wait" parameter (default is true) that will allow function execution AFTER the timeout to be turned off so the function is run immediately




### Internal Changes ###

- major docs updates
- arrayEach will now default to not loop over sparse arrays unless explicitly told to
- major internal refactoring of the Date module to be more compact, robust, and light
- date module will be distilled and contained on its own in the repo


v0.9.5
=====

### API Changes ###

- .sugar method added to all classes to reinstate Sugar methods conditionally.
- Object.clone is now shallow by default, with an option for deep cloning
- Object.merge will now ignore non-objects
- Object.fromQueryString now takes the place of String#toObject.
- Nested object/array param parsing now possible with Object.fromQueryString.
- Array#remove now accepts unlimited parameters
- Array#exclude now accepts unlimited parameters
- Array#union now accepts unlimited parameters
- Array#subtract now accepts unlimited parameters
- Array#intersect now accepts unlimited parameters
- Array#split deprecated
- Array#compact no longer removes functions (bug)
- Array#compact now accepts flag to compact all falsy values
- Number#upto and Number#downto now accept a third parameter to traverse in multiples of > 1
- Number#pad now accepts a third parameter that is the base of the number
- Number#hex now accepts a parameter to pad the resulting string with a default of 1
- String#escapeHTML added
- String#truncate added. Will truncate a string without breaking words.
- String#toObject now refactored to Object.fromQueryString
- Function.lazy refactored to Function#lazy
- Function#lazy functions can now be cancelled via Function#cancel
- Function#defer deprecated -> use Function#delay instead
- Function#debounce added
- Function#after added
- Function#once added


### Internal Changes ###

- extendWithNativeCondition removed. Functionality now contained in extend
- shuffled and removed some dependencies to make it easier to extract the date module
- more robust equality comparison:
- multiArgs added to collect arguments
- array indexes now checked with hasProperty instead of hasOwnProperty
- object builders are now going through extend so they can store their references
- Object.clone refactored to use multiArgs
- Object.isEmpty now returns false if passed argument itself is falsy
- String#stripTags refactored to use multiArgs
- String#removeTags refactored to use multiArgs
-- "null" now taken into consideration for objects
-- object key length compared
-- strict equality matches in multiMatch


v0.9.4
=====

- Emergency fix for Array#compact incorrectly detecting NaN.

v0.9.3
=====

### API Changes ###

- Array.isArray polyfill added and aliased by Object.isArray (es5)
- Array#every/some/map/filter now throws a TypeError if no arguments passed (es5)
- Array#every/some/map/filter now defers to native if available and no arguments passed (es5)
- Array#none/any/all/has aliases similarly throw TypeErrors if no arguments passed (es5)
- Array#indexOf/lastIndexOf now performs a simple strict equality check. Added to v0.9.2 but separately here (es5)
- Array#indexOf/lastIndexOf refactored to defer to String#indexOf/lastIndexOf if a string is passed as the scope (es5)
- Array#forEach/reduce/reduceRight now all throw a TypeError if callback is not callable (es5)
- Array#reduce/reduceRight now throw a TypeError if the array is empty and no initial value passed (es5)
- Array#each is now no longer an alias of forEach and has different behavior:
 - second parameter is the index to start from
 - third parameter is a boolean that runs the loop from the beginning if true
 - returns the array
 - fn returning false will break out of the loop
 - will throw a TypeError if fn is not callable (same as forEach)
 - array is now passed as the scope
 - now detects sparse arrays and switches to a different algorithm to handle them
- Array#find refactored to use an internal method insted of Array#findAll to avoid collisions
- Array#find now breaks as soon as it finds an element
- Array#eachFromIndex removed
- Array#removeAtIndex renamed to Array#removeAt
- Array#unique refactored to use an internal method instead of Array#find to avoid collisions
- Array#subtract/intersect refactored to use an internal method instead of Array#find to avoid collisions
- Array#subtract/intersect refactored to use Array.isArray instead of Object.isArray
- Array#union refactored to use an internal method instead of Array#unique to avoid collisions
- Array#min/max refactored to use an internal method instead of Array#unique to avoid collisions
- Array#least/most will now throw a TypeError if the first argument exists, but is not a string or function
- Array#least/most refactored to use an internal method instead of Array#unique to avoid collisions
- Array#groupBy will now throw a TypeError if the first argument exists, but is not a string or function
- Array#sortBy will now throw a TypeError if the first argument exists, but is not a string or function
- Array#compact/flatten now internally use Array.isArray instead of Object.isArray
- Array#collect alias removed
- Array#shuffle alias removed
- String#hankaku/zenkaku/hiragana/katakana refactored to shift char codes instead of using a hash table
- String#hankaku/zenkaku refactored to be much more accurate & strictly defined
- String#shift added
- String#trim refactored to handle all characters covered in es5/unicode (es5)
- String#trim refactored to check for support and polyfill as needed (es5)
- String#titleize removed
- String#capitalize refactored to allow capitalization of all letters
- String#pad/padLeft/padRight refactored to accept the number as the second param and padding as the first
- String#repeat refactored to return a blank string on num < 1
- String#add refactored to act in parallel with Array#add
- String#remove added as a reciprocal of String#add and a parallel of Array#remove
- String#dasherize/underscore refactored to strip whitespace
- Object.keys refactored to defer to native if < 2 arguments instead of == 1
- Object.keys will now throw a TypeError if non-object passed (es5)
- Number.random fixed which had implied globals min & max
- Date.now polyfill added (es5)
- Date#toISOString refactored polyfill to check for native browser support (es5)
- Date#toJSON added as a polyfill alias to Date#toISOString with similar native checks (es5)
- Date#format/relative refactored to point to an internal method to avoid collisions
- fixed date methods in ambiguous situations such as "5 months ago" when the target month does not have enough days
- Function#bind refactored to check for native support and behave much more closely to spec (es5)
- added documentation for unicode block methods
- added devanagari and ethiopic scripts


### Internal Changes ###

- refactored unicode script methods to use .test instead of .match
- extendWithNativeCondition refactored to allow a "supported" flag
- getMinOrMax refactored to use iterateOverObject
- getFromIndexes renamed to getAtIndexes
- toIntegerWithDefault added
- arrayFind added
- arrayEach added
- arrayUnique added
- isArrayIndex added (es5)
- toUint32 added (es5)
- checkCallback added (es5)
- checkFirstArgumentExists added (es5)
- buildObject refactored to be less invasive



v0.9.2
=====

- Emergency fix to alleviate issues with indexOf/lastIndexOf breaking on functions/deep objects



v0.9.1
=====

- Change Object.create to Object.extended to avoid collision with ES5
- Use of defineProperty in modern browsers to prevent enumeration in for..in loops.
- Add test for for..in loop breakage and allowed older browsers to have a "warning" message.
- Object.isArray will now alias native Array.isArray if it is present.
- Fix collisions with Prototype on Object.clone.
- Test cleanup.

