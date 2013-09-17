v1.4.1
======

### API Changes ###

- Fix for Object.select/reject not performing value match. (Issue #362)
- Fix for Object.merge not properly merging when target object isn't an object (Issue #365)
- Fix for development script not running properly in meteor (Issue #361)


v1.4.0
======

### API Changes ###

- Adding generalized ranges for Numbers and Strings in addition to Dates.
- Date ranges are now part of the Range package and are no longer dependent on the Date package.
- Adding `clamp` for ranges and an alias for Number.
- Adding `cap` for ranges and an alias for Number.
- Added `String#truncateOnWords`. Part of the `String#truncate` functionality is now here.
- `Array.create` will understand ranges and can build an array from one.
- `DateRange#duration` is deprecated in favor of `Range#span`.
- Fix for relative times with "4 weeks" that are actually past the single month threshold.
- `Number#upto` and `Number#downto` will now work on inverse ranges.
- `pad`, `padLeft`, and `padRight` now pad to the specified length, instead of simply adding to string.
- Fuzzy matching methods like `findAll` now directly match regexes against elements, regardless of whether or not they are strings.
- Instances of classes are now entirely matched by reference only, as originally intended. This means that any equality checking inside Sugar will consider them equal only if they are `===`.
- `Object.clone` now only works on known object types and does not work on instances of user-created classes.
- `String#assign` now can be passed an array as well as enumerated arguments.
- Fixed global variable leak #328
- Optimization for `Array#removeAt` #324
- Fix for `isThisWeek` being false when not en locale.
- Timezone formatting tokens changed to align with Moment.js better.
- Major performance optimization for date formatting and more.
- Added `Date#beginningOfISOWeek` and `Date#endOfISOWeek`
- Fix for `Array#create` not working on argument objects of zero-length (Issue #299).
- Fix for `String#capitalize` capitalizing after apostrophes (Issue #325).
- Fix for extended objects `select` and `reject` returning plain objects.
- Fix for `Object.merge` not merging certain deep objects.
- Added Date.SugarNewDate to allow customization of internally created dates.
- Removed `multiMatch` in favor of a cached matcher system.
- Fix for environments where regexes are functions.
- Fix for `Function#cancel` not properly clearing all timers (Issue #346).
- Fix for lazy functions not being able to recursively call themselves.
- Added option `immediate` to `Function#lazy`, which is now false by default.
- Added `Function#every`.
- Exposed `Array.AlphanumericSort` to allow its use in native `Array#sort`.
- Added `Array.AlphanumericSortNatural` that is on by default and triggers a natural sort.
- Fixed strings not being coerced into objects in < IE8.
- `Array.find` now aligns with ES6 spec.
- Fixed bug with array like objects iterated over with loop = true.
- Fixed `String#truncate` not returning primitives.
- `String#repeat` is now aligned more with spec. `String#pad` follows suit.
- Added `Array#findFrom` and `Array#findIndexFrom`.
- Removed `String#normalize`.
- Removed `Range#step` alias.
- Removed `deep` argument from `Object.fromQueryString` and replaced with optional boolean casting.

### Performance Enhancements ###

- Object.map: up to 682% faster
- Date#format: up to 21,400% faster
- Array#min/max/less/more up to 83% faster
- Enumerable methods like findAll/findIndex/map/any/count/sum/etc.: up to 11,270% faster
- isString/isNumber/isBoolean: up to 77% faster
- isEqual returns up front when === (can be *much* faster). Many methods use this internally as well.
- Math related functions (and internals that use them): up to 16% faster.
- getRegExpFlags is up to 1000% faster.
- Range#every up to 52% faster for dates, 1500% faster for numbers/strings.
- Array#at and String#at up to 242% faster for single index lookups.
- String#assign up to 30% faster.


v1.3.9
======

### API Changes ###

- Added `Object.toQueryString`.
- Fix for timezone offset -0330, etc (Issue #262).
- Fix for methods like `isToday` not working when using a non-English locale (Issue #264).
- Removed `Sugar#namespace` to fix conflict with jQuery (Issue #265).


v1.3.8
======

### API Changes ###

- Renamed `Date#getWeek` and `Date#setWeek` to `Date#getISOWeek` and `Date#setISOWeek`.
- Updating `Date#setWeek` (now `Date#setISOWeek`) to follow ISO-8601 standard.
- Allowing lazy and throttled functions to return a memoized result, allowing them to double as a caching mechanism.
- Performance improvement to return early using typeof for type checks.
- Performance improvement for loops.
- Fix for Array#sample sometimes returning undefined (Issue #252).
- Fix for French locales (Issue #249).
- Fix for conflict with Coffeescript (Issue #248).
- Fix for Object.clone not preserving date _utc flag (Issue #256).


v1.3.7
======

### API Changes ###

- Added Object.select and Object.reject to help filter keys in objects.
- String#startsWith and String#endsWith have changed to match the Harmony proposal better.
- Fix for Date.create not preserving the UTC flag when the source is also a date (Issue #235).
- Object.clone on arrays with the "deep" flag set to true should create a deep clone of the array (Issue #237).
- Array#min/max should throw an error when comparing to undefined (Issue #232).
- Fix for dates that fallback to native parsing when forcing UTC flag (Issue #244).
- Date#since/fromNow aliases will now count "past" integers instead of rounding (Issue #236).
- Adding enumerable methods to `Object.extend()`.


v1.3.6
======

### API Changes ###

- Faster String#repeat (Issue #214 - Thanks to @termi!).
- Fixed issue with Array#sample skewing randomization (Issue #216).
- Limiting minute/second parsing to 0-59 (Issue #219).
- Fixed issue with `addMonths` (Issue #221).
- Fixed issue with NaN being true for `isOdd` (Issue #220).
- Fixed issue with HTML escaping (Issue #212).
- Fixed issue with float values parsing in `Object.fromQueryString` (Issue #225).
- Internal refactoring of `Object.each`.
- Fixed issue with `7 July` date format (Issue #227).
- Added "'yy" as a valid year format.
- Allowing empty strings for thousands separator and decimal in `Number#format` (Issue #229).

v1.3.5
======

### API Changes ###

- Now allowing "n days later" etc. as a parsable format (#199).
- Added support for "the nth" format (#205).
- Fixed issue with `Array.create` on objects (#195).
- Fixed am/pm issues with Date parsing (#201).
- Fixed issues with `Date.future` (#210), zh-CN locale time parsing, (#204).
- Added support for Finnish locale (#185), Dutch, and Danish.
- Fixed `Number.random` to have better random distribution (#196).
- Issue with Date cloning (#200).

v1.3.4
======

### API Changes ###

- Refactored 3rd utc argument into a separate object for clarity.


v1.3.3
======

### Internal Changes ###

- multiMatch does not treat functions as callbacks when matching against other functions.


v1.3.2
======

### API Changes ###

- `Date#create` on ISO dates no longer sets the utc flag.
- Fixed implementation of 'Function#bind', which was overriding native method due to an error in the MDN docs.


v1.3.1
======


### API Changes ###

- Matching by value in arrays is now opt-in and must meet certain requirements, namely being of class [object Object], and having `hasOwnProperty`. This will notably now exclude functions and host objects such as DOM elements. This means that such excluded objects will be matched by reference only.
- Fixed issue with Array.create not properly creating arrays #171
- Empty objects now match themselves in arrays #176
- Date#setWeekday now returns a timestamp for consistency with Date#setDay #181
- Date#toUTC deprecated in favor of Date#utc and utc flag in Date#create.
- Date#setUTC deprecated in favor of direct use of utc flag.
- Date#setUTCWeek deprecated in favor of direct use of utc flag.
- Date#getUTCWeek deprecated in favor of direct use of utc flag.
- Date#setUTCWeekday deprecated in favor of direct use of utc flag.
- Date#clone now clones the utc flag of the date.
- Fixed issue with DateRange causing an infinite loop when DST traverses back 1 hour.
- Better date disambiguation for ambiguous dates ("Sunday", etc)
- Various date parsing fixes.
- Timers set by delays are now exposed #170
- Function#debounce debounced function is now canceled instead of original.
- Internal refactoring of class check handling.



v1.3
======


### API Changes ###

- Sugar packages are now further split up and can easily be customized and repackaged. Aside from "core" there is the "es5" package that can be opted out of if <= IE8 support isn't an issue. DateRanges (below) are now their own package, as are inflections.
- Date locales are now a separate package, only English is included in the base "date" package.
- Enumerable methods are now available as class methods on Object, and instance methods on extended objects. This includes: map, any, all, none, count, sum, average, find, findAll, min, max, least, most, and reduce.
- Added Object.size (also available to extended objects)
- Array#min, Array#max, Array#least, and Array#most now return a single element by default with the option to return multiple elements.
- Object.equals now considers identical objects vs. extended objects to be the same
- Refactored Object.isEmpty to be an enumerable method in the Array package. This means that it will error on non-objects now.
- Added "language" package.
- String#normalize moved from Inflections to Language package
- String#has[Script] moved from String to Language package
- String#hankaku and String#zenkaku moved from String to Language package
- String#hiragana and String#katakana moved from String to Language package
- String#namespace moved from Inflections to String package
- String#parameterize now checks for normalize and also uses encodeURI for final output
- String#split patching for regexes is now removed from the String package and is on its own in /lib/extra. It can be dropped in anywhere after Sugar is loaded.

- Array#has is deprecated
- Array#groupBy no longer returns extended objects
- Array#groupBy no longer corrupts array length (Issue 142)
- Enumerable methods now allow fuzzy matching of instances of classes (Issue 157)

- All Math methods are now mapped onto Number and are accessible as instance methods

- String#capitalize all will capitalize any letter after a letter that could not be capitalized.
- String#insert, and Array#insert now treat negative indexes like String#slice
- Fixed issue with decodeBase64 shim (Issue 145)

- String#toDate is now deprecated.
- Date parsing formats are now scoped by locale. This means that if the current locale is set to English, only English formats will be parsed when Date#create does not specify a locale, even if a different locale was initialized previously. Numeric and common formats are available in all locales.
- Added output formats Date#long and Date#full which now included the time. Date#long (mm dd, yyyy hh:mm) is now the default for Date#format, and the previous default (no time) is now Date#short. Date#full includes milliseconds and weekday.
- Date format "just now" now supported
- Date#reset now supports resetting a unit based on a string.
- Date#advance and other advance methods can now reset the time.
- Date#advance now accepts string input like "4 days" (Issue 161)
- Date.past and Date.future added which allow date parsing that prefers the past or future when the specified date is ambiguous ("Sunday", etc.)
- Date parsing now allows time to be in front of the date string as well
- Fixed various issues with timezones, DST, and date parsing (Issue 146), (Issue 138)
- Added "in 3 days", etc. as a parsable format
- Added "the 2nd Tuesday of November", etc. as a parsable format
- Added more parsable formats with weekdays (such as "last monday", etc) in various locales
- Added time parsing in non-English date formats
- Fully qualified ISO language codes will now match more generic codes. This means passing "it_IT" will correctly find "it" if the more specific locale is not available.
- Unknown languages codes will now simply return an invalid date instead of throwing an error.
- Added support for full kanji numerals in date parsing
- Added support for time suffixes in Asian time strings (時 etc)
- Added support for various relative formats in CKJ dates  (先週水曜日 etc)
- Fixed inconsistently not allowing spaces before am/pm (Issue 144)

- Added DateRange, accessed through Date.range as a separate package


v1.2.5
======


### API Changes ###

- String#truncate refactored to split words by default (standard behavior) allow splitting in various positions, and changing argument order.
- Object.isObject should be true for extended objects as well.
- Function#throttle added to take the place of Function#debounce with `false` as the `wait` parameter.
- Date parsing support for hour/minute/second fractions (now take the place of milliseconds).
- Date parsing support now sees commas in decimals.
- Date parsing support for .NET dates.


v1.2.4
======


### API Changes ###

- Major performance improvement for Array#unique, Array#union, Array#intersect (now On vs. On²)
- Array#min, Array#max, Array#most, Array#least also benefit from this.
- Object.equal(s) is now egal (this should only matter for edge cases) like Underscore.
- Object.merge will now work on non-objects as well.
- Custom formats in Date.addFormat will now override built-in formats.
- Fix for Array#union incorrectly flattening arrays.
- Fix for isObject not working across iframes.
- Fix for String#chars incorrectly trimming.
- Fix for String#each not matching all characters.

### Internal Changes ###

- multiArgs now flatten is opt-in

v1.2.3
======


### API Changes ###

- String#compare, Number#compare, and Date#compare are deprecated.
- Array#sortBy now makes much more sensible sorting when sorting on strings.
- Added Array.AlphanumericSortOrder
- Added Array.AlphanumericSortIgnore
- Added Array.AlphanumericSortIgnoreCase
- Added Array.AlphanumericSortEquivalents
- Object.merge defaults are now more sensible. shallow/deep is 3rd with shallow default and resolve is 4th
- Added Number#duration to dates package.
- Bugfix for leaking globals.
- Bugfix for String#compact (Issue 115)

### Internal Changes ###

- Cleanup for toISOString internal code.




v1.2.2
======


### API Changes ###

- Performance optimization for Object.merge and by extension Object.clone
- Object.extended now maintains its "Hash" constructor and checks against it when cloning.
- Object.merge now will also clone dates and regexes as well.
- Reset dates that will be set with UTC methods (fixes issue #98).

### Internal Changes ###


- Removed references to isDefined, isNull, and isObjectPrimitive




v1.2.1
======


### API Changes ###

- Added Object.has to fix issue #97. Stand-in for Object#hasOwnProperty.
- Fixed issue with String#has not escaping regex tokens.
- Date.setLocale can now overwrite a default locale object.
- Date locales can now add their own formats.
- Fix for Ender, which was broken when modularized in 1.2.
- Workaround for Ender requiring externs.

### Internal Changes ###

- Date optional tokens now start from {0}
- References to Object.extend and Object.restore now held and allowed to be restored later.


v1.2
====


### API Changes ###

- Allowed external libraries to extend natives through a common interface "extend".
- Renamed "sugar" to "restore" to restore Sugar methods on a given class.
- Extending Object.prototype functionality is now on "extend" instead.
- Split the date library into its own module that hooks into this new interface.
- Added a new module: String inflections
- Object.keys now passes values as part of the callback like array methods.
- Object.merge now merges undefined properties as well.
- Array#every now uses fuzzy object matching
- Array#some now uses fuzzy object matching
- Array#filter now uses fuzzy object matching
- Array#find now uses fuzzy object matching
- Array#findAll now uses fuzzy object matching
- Array#findIndex now uses fuzzy object matching
- Array#remove now uses fuzzy object matching
- Array#none now uses fuzzy object matching
- Array#count now uses fuzzy object matching
- Array#exclude now uses fuzzy object matching
- Array#clone is now no longer based off Array#concat, which will fail on sparse arrays in IE7.
- Added Number#abbr
- Added Number#metric
- Added Number#bytes
- Added Number#isInteger
- Fixed issue with Number#ordinalize where 113 would be "113rd".
- String#each will now pass the match into the callback
- String#toDate will now check for Date.create before hooking into it.
- String#underscore will now check for acronyms if Inflectors module is present.
- String#camelize will now check for acronyms if Inflectors module is present.
- RegExp.escape will now perform a [toString] operation on non-strings (ie. numbers, etc).
- Function#fill now uses internal Array#splice to fill in arguments.
- Added support for JSON date format Date(xxxxxxxxxx).
- Fixed issues with Date#getWeek.
- Fixed issues with traversing months before January.
- String#titleize added to inflections module.


### Internal Changes ###

- Reworked "multiMatch" to recursively traverse object structures.
- mergeObject now merges undefined properties as well
- Created method arrayIntersect to handle both Array#intersect and Array#subtract
- Array#intersect and Array#subtract will not allow fuzzy object matching
- Array#indexOf and Array#lastIndexOf polyfills now work off arrayIndexOf
- Added internal support for other dates that use timestamps.
- Reworked adding of Date#toISOString and Date#toJSON support.




v1.1.3
======

### API Changes ###

- Fixed issue with Object.isEmpty where strings with length > 0 will return true.

### Internal Changes ###

- Updated Array#sortBy to use .compare method when available.


v1.1.2
======

### API Changes ###

- Added Array#findIndex.
- Added Array#sample.
- Added String#compare.
- Added Number#compare.
- Added Date#compare.
- Fixed issue with floats not properly being recognized in the query string.
- Fixed issue with Object.isEmpty on non-object types and null.
- Fixed issue with arrayEach not allowing negative start indexes.
- Fixed issue with Array#reduce not recognizing 0 as a starting value.
- Fixed issue with Array#add not allowing negative indexes.
- Fixed issue with Number.random not recognizing upper limit of 0.
- Fixed issue with String#dasherize not working on single camel cased letters.
- Fixed issue with String#assign not working on an empty string or other falsy value.
- Fixed issues with French and German date months not being correct.
- Fixed Function#after not calling the method immediately when num is 0.


### Internal Changes ###

- Refactored Array#reduce and Array#reduceRight to use the same internal method.
- Refactored String#camelize to be smaller.
- Refactored checkMonthTraversal to be more robust in a variety of situations.

v1.1.1
======

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
====

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
====

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
======

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
======

- Emergency fix for Array#compact incorrectly detecting NaN.

v0.9.3
======

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
- Array#compact/flatten now internally uses Array.isArray instead of Object.isArray
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
======

- Emergency fix to alleviate issues with indexOf/lastIndexOf breaking on functions/deep objects



v0.9.1
======

- Change Object.create to Object.extended to avoid collision with ES5
- Use of defineProperty in modern browsers to prevent enumeration in for..in loops.
- Add test for for..in loop breakage and allowed older browsers to have a "warning" message.
- Object.isArray will now alias native Array.isArray if it is present.
- Fix collisions with Prototype on Object.clone.
- Test cleanup.

