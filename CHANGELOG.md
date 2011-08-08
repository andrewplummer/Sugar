0.9.3
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



0.9.2
=====

- Emergency fix to alleviate issues with indexOf/lastIndexOf breaking on functions/deep objects



0.9.1
=====

- Change Object.create to Object.extended to avoid collision with ES5
- Use of defineProperty in modern browsers to prevent enumeration in for..in loops.
- Add test for for..in loop breakage and allowed older browsers to have a "warning" message.
- Object.isArray will now alias native Array.isArray if it is present.
- Fix collisions with Prototype on Object.clone.
- Test cleanup.

