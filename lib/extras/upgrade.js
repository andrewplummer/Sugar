(function(exports, global, __filename) {
  'use strict';

  var IS_BROWSER = typeof window !== 'undefined';

  // I'm the upgrade helper! Just drop me in your code, ideally right after Sugar is loaded!

  // --- Method Data ---

  var METHODS = [
    {
      type: 'Object',
      sName: 'extended',
      message: 'Extended objects are now implemented as chainables, which can be created through the global object: Sugar.Object(obj)'
    },
    {
      type: 'Object',
      sName: 'watch,unwatch',
      message: 'Object.watch was removed as it was an overly simplistic solution to a difficult problem, and not fully compatible in all environments. There is no equivalent to this method. See general discussions around Object.observe, Proxies, and polling for more.'
    },
    {
      type: 'Object',
      sName: 'extend',
      check: noArguments,
      message: 'Object.extend() is now Sugar.Object.extend({ objectPrototype: true });',
      docs: 'Sugar/extend'
    },
    {
      type: 'Object',
      sName: 'equal',
      message: 'Object.equal was renamed to Object.isEqual.',
      docs: 'Object/isEqual'
    },
    {
      type: 'Object',
      sName: 'merge',
      check: hasResolveFunction,
      message: 'Resolve functions passed to Object.merge will now abort the merge if returning "undefined". For the previous behavior (continue merging as normal), return the "Sugar" global object instead. Additionally, any non-undefined value returned by the resolve function will now resolve the conflict completely. This means that in deep merges, Sugar will no longer continue traversing into the returned object. If a custom merge needs to be performed, then make a separate call to Object.merge with different options, otherwise return the Sugar global in this instance as well to simply continue merging as normal. Suppress this warning if you resolve function is working as intended.',
      docs: 'Object/merge'
    },
    {
      type: 'Object',
      sName: 'merge',
      call: getMergeOptions,
      check: thirdIsNotObject,
      message: 'Object.merge now takes an options object instead of a list of arguments. New equivalent: Object.merge(target, source, %{ deep: true, resolve: false }%).',
      docs: 'Object/merge'
    },
    {
      type: 'Object',
      sName: 'findAll',
      message: 'Object.findAll was replaced by Object.filter was now parallels Array#filter and returns a filtered object.',
      docs: 'Object/filter'
    },
    {
      type: 'Object',
      sName: 'toQueryString',
      check: toQueryStringIsDeep,
      message: 'Object.toQueryString no longer uses deep square bracket syntax by default. To enable this pass "deep" in the options object which is now the second argument to the function.',
      docs: 'Object/toQueryString'
    },
    {
      type: 'Object',
      sName: 'toQueryString',
      check: secondIsString,
      message: 'Object.toQueryString "namespace", which was previously the second argument is now "prefix" in an options object, which is the new second argument to the function.',
      docs: 'Object/toQueryString'
    },
    {
      type: 'Object',
      sName: 'fromQueryString',
      check: fromQueryStringMayBeSmart,
      message: 'Object.fromQueryString now performs "smart" conversion of numerals, booleans, and multiple keys by default. To turn this off, pass { smart: false } in the options object which is now the second argument to the function. Additionally, deep bracket syntax ([] in keys) is now off by defualt but can be enabled with { deep: true } in the same options object.',
      docs: 'Object/fromQueryString'
    },
    {
      type: 'Object',
      sName: 'select',
      check: secondIsObject,
      message: 'Object.select only checks for key existence now when passed an object as a matcher, not whether values also match or not. To do the "intersect" operation that was previously performed, use Object.intersect instead. Suppress this message if you are passing an object to check key existence.',
      docs: 'Object/intersect'
    },
    {
      type: 'Object',
      sName: 'reject',
      check: secondIsObject,
      message: 'Object.reject only checks for key existence now when passed an object as a matcher, not whether values also match or not. To do the "subtract" operation that was previously performed, use Object.subtract instead. Suppress this message if you are passing an object to check key existence.',
      docs: 'Object/subtract'
    },
    {
      type: 'Object',
      sName: 'map',
      check: 'missing',
      message: 'Object.map was moved to the Enumerable module from the Array module. If you were using a custom build you will have to include that module as well.',
      docs: 'Object/map'
    },
    {
      type: 'Object',
      sName: 'each',
      message: 'Object.each renamed to Object.forEach, and now passes the value as the first argument to the callback. Additionally, it no longer allows a return value to break the loop. Use Object.some instead for that functionality. Finally, the method was also moved to the Enumerable module from the Array module. If you were using a custom build you will have to include that module as well.',
      docs: 'Object/forEach'
    },
    {
      type: 'Object',
      sName: 'map,every,find,count,none,some,average,min,max,least,most',
      check: secondIsFunction,
      message: 'Object methods that accept a callback for iteration now pass the value as the first argument, and the key second. Suppress this message if your iteration callback is working as intended.',
      docs: 'Object/forEach'
    },
    {
      type: 'Object',
      sName: 'size',
      check: 'missing',
      message: 'Object.size was moved to the Object module from the Array module. If you were using a custom build you will have to include that module as well.',
      docs: 'Object/size'
    },
    {
      type: 'Object',
      sName: 'clone',
      check: firstIsNonBasicObject,
      message: 'Object.clone now clones non-enumerable properties if they exist and "get" and "set" attribute accessors. Suppress this message if this is intended.',
      docs: 'Object/clone'
    },
    {
      type: 'Object',
      sName: 'fromQueryString',
      message: 'Object.fromQueryString now returns a plain object. If you want previous extended object functionality, wrap the result in a chainable: Sugar.Object(...)',
      docs: 'Object/fromQueryString'
    },
    {
      type: 'Object',
      sName: 'isNaN',
      message: 'Object.isNaN was removed in favor of native Number.isNaN. Sugar provides a polyfill for this method.',
      docs: 'Number/isNaN'
    },
    {
      type: 'Object',
      sName: 'all',
      message: "Object.all alias was removed to align with native methods. This alias can easily be restored with: Sugar.Object.alias('all', 'every'), however when using a function callback, note that the key/value arguments have been reversed to pass the value as the first argument.",
      docs: 'Object/every'
    },
    {
      type: 'Object',
      sName: 'any',
      message: "Object.any alias was removed to align with native methods. This alias can easily be restored with: Sugar.Object.alias('any', 'some'), however when using a function callback, note that the key/value arguments have been reversed to pass the value as the first argument.",
      docs: 'Object/some'
    },
    {
      type: 'Object',
      sName: 'keys',
      check: moreThanOneArgument,
      message: "Object.keys no longer accepts a callback as a second argument. Use Object.forEach instead for iterating over an object's properties.",
      docs: 'Object/forEach'
    },
    {
      type: 'Object',
      sName: 'values',
      check: moreThanOneArgument,
      message: "Object.values no longer accepts a callback as a second argument. Use Object.forEach instead for iterating over an object's properties.",
      docs: 'Object/forEach'
    },
    {
      type: 'Object',
      sName: 'min,max,least,most',
      check: thirdIsBoolean,
      message: 'Object.min/max/least/most: The "all" argument is now an optional second argument, making the callback always last.',
      docs: 'Object/min'
    },
    {
      type: 'Date',
      sName: 'past',
      call: getDateArgs(),
      message: 'Date.past was removed. New equivalent: Date.create(%str, { past: true }%).',
      docs: 'Date/create'
    },
    {
      type: 'Date',
      sName: 'future',
      message: 'Date.future was removed. New equivalent: Date.create(%str, { future: true }%).',
      call: getDateArgs(true),
      docs: 'Date/create'
    },
    {
      type: 'Date.utc',
      sName: 'past',
      call: getDateArgs(false, true),
      message: 'Date.utc.past was removed. New equivalent: Date.create(%str, { past: true, fromUTC: true }%).',
      docs: 'Date/create'
    },
    {
      type: 'Date.utc',
      sName: 'future',
      call: getDateArgs(true, true),
      message: 'Date.utc.future was removed. New equivalent: Date.create(%str, { future: true, fromUTC: true }%).',
      docs: 'Date/create'
    },
    {
      type: 'Date',
      iName: 'utc',
      message: 'Date#utc was renamed to Date#setUTC, and requires an explicit boolean flag.',
      docs: 'Date/setUTC'
    },
    {
      type: 'Date',
      iName: 'reset',
      check: anyArguments,
      message: 'Date#reset now uses higher units to make more semantic sense. For example d.reset("day") now resets to "the beginning of the day" as opposed to "the first day of the month". Suppress this warning if functioning as intended.',
      docs: 'Date/reset'
    },
    {
      type: 'Date',
      iName: 'relative',
      check: dateRelativeArgsReversed,
      message: 'Date#relative arguments are now reversed (localeCode comes first).',
      docs: 'Date/reset'
    },
    {
      type: 'String',
      iName: 'has',
      message: 'String#has was renamed to String#includes for ES6 compliance. The native method only takes a string, however Sugar optionally enhances it to allow regexes.',
      docs: 'String/includes'
    },
    {
      type: 'String',
      iName: 'startsWith',
      check: firstIsRegExp,
      message: 'String#startsWith regex matching was removed for ES6 compliance. Use standard regex methods "match" or "test" here. Additionally, Sugar also optionally enhances String#includes to allow regexes, which simply calls "test" under the hood.',
      docs: 'String/includes'
    },
    {
      type: 'String',
      iName: 'endsWith',
      check: firstIsRegExp,
      message: 'String#endsWith regex matching was removed for ES6 compliance. Use standard regex methods "match" or "test" here. Additionally, Sugar also optionally enhances String#includes to allow regexes, which simply calls "test" under the hood.',
      docs: 'String/includes'
    },
    {
      type: 'String',
      iName: 'startsWith',
      check: thirdIsBoolean,
      message: 'String#startsWith Third "case" argument was removed for ES6 compliance. Use standard regex methods for case sensitivity. Additionally, Sugar also optionally enhances String#includes to allow regexes, which simply calls "test" under the hood.',
      docs: 'String/includes'
    },
    {
      type: 'String',
      iName: 'endsWith',
      check: thirdIsBoolean,
      message: 'String#endsWith Third "case" argument was removed for ES6 compliance. Use standard regex methods for case sensitivity. Additionally, Sugar also optionally enhances String#includes to allow regexes, which simply calls "test" under the hood.',
      docs: 'String/includes'
    },
    {
      type: 'String',
      iName: 'assign',
      message: 'String#assign was renamed to String#format.',
      docs: 'String/format'
    },
    {
      type: 'String',
      iName: 'assign',
      check: stringContextHasDigitTokens,
      message: 'Numeral tokens in String#assign (now String#format) are now zero based in String#format, so for example {1} should now be {0}.',
      docs: 'String/format'
    },
    {
      type: 'String',
      iName: 'assign',
      check: moreThanOneArgument,
      message: 'Multiple objects passed to String#assign (now String#format) will no longer be merged together. Instead, either access with new deep dot syntax ({0.name}, etc), or merge the object together with Object.merge.',
      docs: 'String/format'
    },
    {
      type: 'String',
      iName: 'capitalize',
      check: stringContextWillBeDowncased,
      message: 'String#capitalize now only capitalizes the first letter of the string by default. To downcase as well pass true for the second argument.',
      docs: 'String/capitalize'
    },
    {
      type: 'String',
      iName: 'add',
      message: 'String#add was removed and now only exists as String#insert, which was previously an alias.',
      docs: 'String/insert'
    },
    {
      type: 'String',
      iName: 'paragraphs',
      message: 'String#paragraphs was removed.',
      docs: 'String'
    },
    {
      type: 'Function',
      iName: 'after',
      check: firstIsZero,
      message: 'Function#after will no longer fire synchronously when 0 is passed, but instead will be the equivelent if setTimeout(..., 0). Suppress this warning if this is not an issue.',
      docs: 'Function/after'
    },
    {
      type: 'Function',
      iName: 'after',
      message: 'Function#after will now call every time after N (the numeric argument which it receives). Previously it would call every N times. For example if the number was 3 it would previously be called on the 3rd, 6th, 9th invocation, etc. Now it will be called on every invocation after 3. There is no equivalent for the previous behavior, however if you want to prevent subsequent calls then use Function#once in conjunction with this method. Suppress this warning if functionality is as intended.',
      docs: 'Function/after'
    },
    {
      type: 'Function',
      iName: 'fill',
      message: 'Function#fill was renamed to Function#partial.',
      docs: 'Function/partial'
    },
    {
      type: 'Function',
      iName: 'fill',
      check: anyArgumentIsNull,
      message: 'Function#fill (now Function#partial) no longer accepts null as a placeholder. Use undefined instead.',
      docs: 'Function/partial'
    },
    {
      type: 'Array',
      iName: 'randomize',
      message: 'Array#randomize was renamed to Array#shuffle.',
      docs: 'Array/shuffle'
    },
    {
      type: 'Array',
      sName: 'create',
      check: moreThanOneArgument,
      message: 'Array.create now only accepts a single argument. See the docs for more details.',
      docs: 'Array/create'
    },
    {
      type: 'Array',
      iName: 'add',
      message: 'Array#add is now non-destructive. To append to the array in place, use Array#append. Suppress this warning if you are using Array#add as intended.',
      docs: 'Array/add'
    },
    {
      type: 'Array',
      iName: 'sortBy',
      message: 'Array#sortBy is now destructive. If you need to a clone of the array, then use Array#clone or Array#concat on the array first. Suppress this warning if you are using Array#sortBy as intended.',
      docs: 'Array/sortBy'
    },
    {
      type: 'Array',
      iName: 'findAll',
      message: 'Array#findAll was replaced with Array#filterFromIndex in cases that require a start index. For cases without a start index, simply use native Array#filter. Additionally, the "index" and "loop" arguments now come before the callback.',
      docs: 'Array/filter'
    },
    {
      type: 'Array',
      iName: 'each',
      message: 'Array#each was replaced with Array#forEachFromIndex in cases that require a start index. For cases without a start index, simply use native Array#forEach. Additionally, the "index" and "loop" arguments now come before the callback. For iterating until a return value is passed, use Array#some.',
      docs: 'Array/forEach'
    },
    {
      type: 'Array',
      iName: 'findFrom',
      message: 'Array#findFrom was renamed to Array#findFromIndex, and the "index" and "loop" arguments now come before the callback..',
      docs: 'Array/findFromIndex'
    },
    {
      type: 'Array',
      iName: 'findIndexFrom',
      message: 'Array#findFromIndex was renamed to Array#findIndexFromIndex, and the "index" and "loop" arguments now come before the callback.',
      docs: 'Array/findIndexFromIndex'
    },
    {
      type: 'Array',
      iName: 'include',
      message: 'Array#include was replaced with Array#add, which is now non-destructive.',
      docs: 'Array/add'
    },
    {
      type: 'Array',
      iName: 'subtract',
      check: moreThanOneArgument,
      message: 'Array#subtract now no longer accepts an unlimited number of arguments.',
      docs: 'Array/subtract'
    },
    {
      type: 'Array',
      iName: 'union',
      check: moreThanOneArgument,
      message: 'Array#union now no longer accepts an unlimited number of arguments.',
      docs: 'Array/union'
    },
    {
      type: 'Array',
      iName: 'intersect',
      check: moreThanOneArgument,
      message: 'Array#intersect now no longer accepts an unlimited number of arguments.',
      docs: 'Array/intersect'
    },
    {
      type: 'Array',
      iName: 'all',
      message: "Array#all alias was removed to align with native Array#every. However, this alias can easily be restored with: Sugar.Array.alias('all', 'every').",
      docs: 'Array/every'
    },
    {
      type: 'Array',
      iName: 'any',
      message: "Array#any alias was removed to align with native Array#some. However, this alias can easily be restored with: Sugar.Array.alias('any', 'some').",
      docs: 'Array/some'
    },
    {
      type: 'Array',
      iName: 'min,max,least,most',
      check: secondIsBoolean,
      message: 'Array#min/max/least/most: The "all" argument is now an optional second argument, making the callback always last.',
      docs: 'Array/min'
    },
    {
      type: 'Date',
      iName: 'format',
      check: dateFormatShortcutCheck,
      message: 'Date#format shortcut formats ("short", "long", "full", or no argument) have significantly changed. See the docs for the new formats. Suppress this message if formatting is functioning as intended.',
      docs: 'Date/format'
    },
    {
      type: 'Date',
      iName: 'format',
      check: dateFormatDeprecatedTokenCheck,
      message: 'Date#format tokens "f", "fff", "izotz", and "ord" have been replaced with "S", "SSS", "Z", "do" respectively.',
      docs: 'Date/format'
    },
    {
      type: 'Date',
      iName: 'format',
      check: dateFormatLocaleTokenCheck,
      message: 'Date#format tokens "Dow" and "Mon" were previously always 3 characters and uppercased. Both of these are now locale dependent, as certain locales may prefer different casing or abbreviation length. Lowercased formats "dow" and "mon" are also locale-dependent in length, but always lowercased. Suppress this message if formatting is working as intended.',
      docs: 'Date/format'
    },
    {
      type: 'RegExp',
      iName: 'addFlag',
      message: 'RegExp#addFlag was renamed to RegExp#addFlags and works on multiple flags at once.',
      docs: 'RegExp/addFlags'
    },
    {
      type: 'RegExp',
      iName: 'removeFlag',
      message: 'RegExp#removeFlag was renamed to RegExp#removeFlags and works on multiple flags at once.',
      docs: 'RegExp/removeFlags'
    },
    {
      type: 'Number',
      iName: 'format',
      check: moreThanOneArgument,
      message: 'Number#format no longer accepts arguments for the thousands separator and decimal point. Instead these can now be set globally by calling "Sugar.Number.setOption("thousands")" and Sugar.Number.setOption("decimal"). These options will also be respected by Number#abbr, Number#metric, and Number#bytes as well.',
      docs: 'Number/setOption'
    },
    {
      type: 'Number',
      iName: 'metric',
      check: secondIsNumber,
      message: 'Number#metric now uses a "units" string instead of the previous "limit" argument, which allows a more flexible, intuitive way to define custom units and min/max ranges. Check the docs for more.',
      docs: 'Number/metric'
    },
    {
      type: 'Number',
      iName: 'upto',
      check: moreThanTwoArguments,
      message: 'The "step" argument to Number#upto is now the second argument and is optional.',
      docs: 'Number/upto'
    },
    {
      type: 'Number',
      iName: 'downto',
      check: moreThanTwoArguments,
      message: 'The "step" argument to Number#downto is now the second argument and is optional.',
      docs: 'Number/downto'
    },
    {
      type: 'String',
      iName: 'normalize',
      message: 'String#normalize was renamed to renamed to String#toAscii to comply with the ES6 spec.',
      docs: 'String/toAscii'
    },
    {
      type: 'Date',
      iName: 'beginningOfWeek',
      message: 'Date#beginningOfWeek is now locale dependent, as different locales have different definitions of the start of a week.',
      docs: 'String/toAscii'
    },
    {
      type: 'String',
      iName: 'at',
      check: moreThanOneArgument,
      message: 'String#at no longer accepts enumerated arguments. Pass an array instead.',
      docs: 'String/at'
    },
    {
      type: 'Array',
      iName: 'at',
      check: moreThanOneArgument,
      message: 'Array#at no longer accepts enumerated arguments. Pass an array instead.',
      docs: 'Array/at'
    },
    {
      type: 'String',
      iName: 'at',
      check: indexArgumentBeyondArrayBounds,
      message: 'String#at now does not loop past the ends of the array by default. Pass true as the second argument if you require this behavior.',
      docs: 'String/at'
    },
    {
      type: 'Array',
      iName: 'at',
      check: indexArgumentBeyondArrayBounds,
      message: 'Array#at now does not loop past the ends of the array by default. Pass true as the second argument if you require this behavior.',
      docs: 'Array/at'
    },
    {
      type: 'Array',
      iName: 'remove',
      check: moreThanOneArgument,
      message: 'Array#remove no longer accepts enumerated arguments. If the array contains strings, a regex can be passed. If the array contains numbers or objects, consider using Array#subtract (non-destructive) a function callback, or multiple separate calls to Array#remove, depending on your needs.',
      docs: 'Array/remove'
    },
    {
      type: 'Array',
      iName: 'exclude',
      check: moreThanOneArgument,
      message: 'Array#exclude no longer accepts enumerated arguments. If the array contains strings, a regex can be passed. If the array contains numbers or objects, use Array#subtract. Depending on your needs, a callback function or multiple calls may be a better solution.',
      docs: 'Array/exclude'
    },
    {
      type: 'Date',
      sName: 'create',
      check: secondIsNumber,
      message: 'Date.create no longer accepts enumerated arguments. Simply use the native Date constructor instead: new Date(2015, 5, 25).',
      docs: 'Date/create'
    },
    {
      type: 'Date',
      iName: 'set',
      check: dateSetObjectContainsMonths,
      message: 'Date#set now rewinds dates that have accidentally traversed into a new month, for example setting { month: 1 } when the date is January 31st. This behavior was previously only on Date#advance and Date#rewind. This is mostly an edge case - suppress this warning if not an issue.',
      docs: 'Date/set'
    },
    {
      type: 'Date',
      iName: 'yearsSince,monthsSince,weeksSince,daysSince,hoursSince,minutesSince,secondsSince,millisecondsSince',
      check: oneArgumentAndContextIsUTC,
      message: 'Date#unitsSince (Date#hoursSince, etc) now assume that the passed in format is UTC if the context date is also flagged as UTC (i.e. if you are using setUTC). This behavior can be overriden by passing an options object with { fromUTC: false } to Date#unitsSince. Suppress this message if this assumption is correct.',
      docs: 'Date/unitSince'
    },
    {
      type: 'Array',
      iName: 'isEmpty',
      check: arrayContextHasFalsy,
      message: 'Array#isEmpty now does a simple check if the length is zero. To also check if undefined, null, or NaN are present in the array, use Array#compact first.',
      docs: 'Array/isEmpty'
    },
    {
      type: 'Array',
      iName: 'map,min,max,least,most,unique,groupBy,sortBy',
      check: firstIsDeepAccessor,
      message: 'Array methods that accept a string as a shortcut to a mapping function will now treat any period character in the string as a deep property. If you are instead attempting to access shallow properties that contain periods in the key, you must now pass a function instead. Suppress this message if you are intentionally accessing deep properties.',
      docs: 'Array/map'
    },
    {
      type: 'Array',
      iName: 'groupBy',
      check: secondIsFunction,
      message: 'Callbacks passed to Array#groupBy to iterate over each group are now passed the group as the first argument, and the key as the second.',
      docs: 'Array/groupBy'
    },
    {
      type: 'String',
      iName: 'stripTags',
      check: moreThanOneArgument,
      message: 'String#stripTags no longer accept enumerated arguments. Simply pass an array of tags to remove multiple.',
      docs: 'String/stripTags'
    },
    {
      type: 'String',
      iName: 'removeTags',
      check: moreThanOneArgument,
      message: 'String#removeTags no longer accept enumerated arguments. Simply pass an array of tags to remove multiple.',
      docs: 'String/removeTags'
    },
    {
      type: 'String',
      iName: 'removeTags',
      check: removeTagsResultHasUnmatched,
      message: 'String#removeTags now removes unmatched opening or closing tags in malformed HTML.',
      docs: 'String/removeTags'
    },
    {
      type: 'String',
      iName: 'titleize',
      check: 'missing',
      message: 'String#titleize was moved from the Inflections module to String. If you were using a custom build you will have to include that module as well.',
      docs: 'String/titleize'
    },
    {
      type: 'String',
      iName: 'parameterize',
      check: 'missing',
      message: 'String#parameterize was moved from the Inflections module to String. If you were using a custom build you will have to include that module as well.',
      docs: 'String/parameterize'
    },
    {
      type: 'String',
      iName: 'hankaku,zenkaku',
      check: moreThanOneArgument,
      message: 'String#hankaku and String#zenkaku no longer take multiple arguments for modes. Simply concatenate the modes together as the first argument.',
      docs: 'String/hankaku'
    },
    {
      type: 'String',
      iName: 'each',
      message: 'String#each was renamed to String#forEach.',
      docs: 'String/forEach'
    },
    {
      type: 'Array',
      prop: 'AlphanumericSort',
      message: 'AlphanumericSort is now "sortCollate" and is set with Sugar.Array.setOption("sortCollate", value).',
      docs: 'Array/setOption'
    },
    {
      type: 'Array',
      prop: 'AlphanumericSortOrder',
      message: 'AlphanumericSortOrder is now "sortOrder" and is set with Sugar.Array.setOption("sortOrder", value).',
      docs: 'Array/setOption'
    },
    {
      type: 'Array',
      prop: 'AlphanumericSortIgnore',
      message: 'AlphanumericSortIgnore is now "sortIgnore" and is set with Sugar.Array.setOption("sortIgnore", value).',
      docs: 'Array/setOption'
    },
    {
      type: 'Array',
      prop: 'AlphanumericSortIgnoreCase',
      message: 'AlphanumericSortIgnoreCase is now "sortIgnoreCase" and is set with Sugar.Array.setOption("sortIgnoreCase", value).',
      docs: 'Array/setOption'
    },
    {
      type: 'Array',
      prop: 'AlphanumericSortNatural',
      message: 'AlphanumericSortNatural is now "sortNatural" and is set with Sugar.Array.setOption("sortNatural", value).',
      docs: 'Array/setOption'
    },
    {
      type: 'Array',
      prop: 'AlphanumericSortEquivalents',
      message: 'AlphanumericSortEquivalents is now "sortEquivalents" and is set with Sugar.Array.setOption("sortEquivalents", value).',
      docs: 'Array/setOption'
    },
    {
      type: 'Date',
      prop: 'SugarNewDate',
      message: 'SugarNewDate is now "newDateInternal" and is set with Sugar.Date.setOption("newDateInternal", value).',
      docs: 'Date/setOption'
    }
  ];


  // --- Argument/Context Checks ---

  function noArguments() {
    return arguments.length === 0;
  }

  function anyArguments() {
    return arguments.length > 0;
  }

  function moreThanOneArgument() {
    return arguments.length > 1;
  }

  function moreThanTwoArguments() {
    return arguments.length > 2;
  }

  function anyArgumentIsNull() {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] === null) {
        return true;
      }
    }
    return false;
  }

  function firstIsRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
  }

  function firstIsZero() {
    return arguments[0] === 0;
  }

  function firstIsDeepAccessor(arg1) {
    return typeof arg1 === 'string' && arg1.indexOf('.') !== -1;
  }

  function firstIsNonBasicObject() {
    var flag = false;
    if (Object.getOwnPropertyNames && Object.getOwnPropertyDescriptor) {
      var obj = arguments[0];
      Object.getOwnPropertyNames(obj).forEach(function(name) {
        var d = Object.getOwnPropertyDescriptor(obj, name);
        if (!d.enumerable || d.get || d.set) {
          flag = true;
        }
      });
    }
    return flag;
  }

  function secondIsFunction() {
    return typeof arguments[1] === 'function';
  }

  function secondIsString() {
    return typeof arguments[1] === 'string';
  }

  function secondIsObject() {
    return Object.prototype.toString.call(arguments[1]) === '[object Object]';
  }

  function secondIsNumber() {
    return typeof arguments[1] === 'number';
  }

  function secondIsBoolean() {
    return typeof arguments[1] === 'boolean';
  }

  function thirdIsBoolean() {
    return typeof arguments[2] === 'boolean';
  }

  function thirdIsNotObject() {
    return arguments.length > 2 && typeof arguments[2] !== 'object';
  }

  function stringContextHasDigitTokens() {
    return /\{\d+\}/.test(this);
  }

  function stringContextWillBeDowncased(downcase) {
    return /[A-Z]/.test(this.slice(1)) && !downcase;
  }

  function arrayContextHasFalsy() {
    for (var i = 0; i < this.length; i++) {
      var el = this[i];
      if (el == null || el !== el) {
        return true;
      }
    }
    return false;
  }

  function indexArgumentBeyondArrayBounds(indexes) {
    var arr = this;
    if (typeof indexes !== 'object') {
      indexes = [indexes];
    }
    for (var i = 0; i < indexes.length; i++) {
      var index = indexes[i];
      if (index >= arr.length || index <= -arr.length - 1) {
        return true;
      }
    }
    return false;
  }

  function dateSetObjectContainsMonths() {
    return typeof arguments[0] === 'object' && 'month' in arguments[0];
  }

  function dateFormatLocaleTokenCheck(f) {
    return /\{dow|mon\}/i.test(f);
  }

  function dateFormatDeprecatedTokenCheck(f) {
    return /\{f|fff|isotz|ord\}/.test(f);
  }

  function dateFormatShortcutCheck(f) {
    return f === 'short' || f === 'long' || f === 'full';
  }

  function dateRelativeArgsReversed() {
    return arguments.length === 2 && typeof arguments[0] === 'function';
  }

  function oneArgumentAndContextIsUTC() {
    return !!this._utc && arguments.length > 0;
  }

  function removeTagsResultHasUnmatched() {
    var removeAll = !arguments.length, removeMap = {};
    for (var i = 0; i < arguments.length; i++) {
      removeMap[arguments[i]] = true;
    }
    var result = this.replace(/<([\w-]+)[^>]*>.*<\/\1>/g, function(match, tag) {
      return removeAll || removeMap[tag] ? '' : match;
    });
    return result.indexOf('<') !== -1 || result.indexOf('>') !== -1;
  }

  function hasResolveFunction() {
    return (typeof arguments[2] === 'object' && typeof arguments[2].resolve === 'function') ||
           (arguments.length > 3 && typeof arguments[3] === 'function');
  }

  function fromQueryStringMayBeSmart(str) {
    var mayBeSmart = false;
    str.split('&').forEach(function(p) {
      var split = p.split('=');
      var key = split[0];
      var val = split[1];
      if (/[\[\]]/.test(key) || val === 'true' || val === 'false' || !isNaN(+val)) {
        mayBeSmart = true;
      }
    });
    return mayBeSmart && (typeof opts !== 'object' || opts.smart !== false);
  }

  function toQueryStringIsDeep(obj, opts) {
    var isDeep = false;
    for (var key in obj) {
      if(!obj.hasOwnProperty(key)) continue;
      if (typeof obj[key] === 'object') {
        isDeep = true;
      }
    }
    return isDeep && (typeof opts !== 'object' || !opts.deep);
  }

  // --- Helpers ---

  function getDateArgs(future, utc) {
    return function(f, localeCode) {
      var opts = [future ? 'future: true' : 'past: true'];
      if (utc) {
        opts.push('fromUTC: true');
      }
      if (localeCode) {
        opts.push('locale: "' + localeCode + '"');
      }
      return f + '", { ' + opts.join(', ') + ' }';
    };
  }

  function getMergeOptions(target, source, deep, resolve) {
    var opts = [];
    if (deep) {
      opts.push('deep: true');
    }
    if (typeof resolve === 'boolean') {
      opts.push('resolve: ' + resolve);
    }
    if (typeof resolve === 'function') {
      opts.push('resolve: [FUNCTION]');
    }
    return '{ ' + opts.join(', ') + ' }';
  }



  // -----------------------------
  //  Main script below this line
  // -----------------------------



  // --- Constants ---

  // Is node env?
  var NODE = typeof process !== 'undefined' && typeof module !== 'undefined';

  // Can define getter/setters.
  var DEFINE_PROPERTY_SUPPORT = Object.defineProperty && Object.defineProperties;

  // Uses ansi colors
  var ANSI = NODE && (process.platform === 'win32' ||
      'COLORTERM' in process.env ||
      /^xterm-256(?:color)?/.test(process.env.TERM) ||
      /^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM));

  // IE Edge has no "console.table" so this is a hacky way to check for styles
  var HAS_CONSOLE_STYLES = !NODE && !!console.table;

  // Beer time!
  var BEER = '\ud83c\udf7a';


  // --- Basic util ---

  function slice(str, len, fromLeft) {
    return fromLeft ? str.slice(-len) : str.slice(0, len);
  }

  function pad(s, len, fromLeft, chr) {
    if (!chr) {
      chr = typeof s === 'number' ? '0' : ' ';
    }
    var str = s.toString();
    var padding = new Array(Math.max(0, len - str.length + 1)).join(chr);
    return fromLeft ? padding + str : str + padding;
  }

  function dotFraction(n) {
    return String(n).replace(/^0\./, '.');
  }

  function getOneLine(left, right, offset) {
    var cols, rcols, lcols;
    cols  = NODE && process.stdout.columns || 160;
    rcols = Math.floor(cols * (1 - optionRatio()));
    lcols = cols - rcols - offset;
    return padOrTruncate(left, lcols) + padOrTruncate(right, rcols, true);
  }

  function padOrTruncate(str, cols, fromLeft) {
    var ellipsis = fromLeft ? '...' : '... ';
    if (str.length > cols) {
      cols -= ellipsis.length;
      str = slice(str, cols, fromLeft);
      str = fromLeft ? ellipsis + str : str + ellipsis;
    } else {
      str = pad(str, cols);
    }
    return str;
  }


  // --- Meta util ---

  var __dirname;

  function setCurrentFilename() {
    if (!__filename) {
      var scripts = document.getElementsByTagName('script');
      __filename = scripts[scripts.length - 1].src;
    }
    __dirname = __filename.replace(/[^/]+\.js$/, '');
  }

  function getCaller() {
    var stack = new Error().stack.split('\n'), i = 0, match, src;
    stack.shift();
    while (stack[i].match(__filename)) {
      i++;
    }
    match = stack[i].match(/[@ ]\(?(\S+):(\d+):(\d+)\)?$/);
    src = match[1].replace(__dirname, '');
    if (src.match(/sugar(-\d\.\d\.\d)?(\.min)?\.js/)) {
      // If the caller matches the distributed filenames, then this method
      // is likely being called internally. This can happen in cases where
      // a non-warned method is calling into a warned method and cannot be
      // prevented by the "isNotifying" check below, so simply return null.
      return null;
    }
    return {
      src:  src,
      line: match[2],
      char: match[3]
    };
  }

  // --- Storage util ---

  var storage = global['localStorage'];

  function storageRead(key, def, type) {

    if (storage) {
      var val = storage.getItem(key);
      if (type === 'boolean' && val) {
        val = !!+val;
      } else if (type === 'array') {
        val = val ? val.split(',') : [];
      }
    }
    if (val == null) {
      val = def;
    }
    return val;
  }

  function storageWrite(key, val, type) {
    if (storage) {
      if (type === 'boolean') {
        val = +val;
      } else if (type === 'array') {
        val = val.join(',');
      }
      storage.setItem(key, val);
    }
    return val;
  }

  function exportOption(name, val, type) {
    val = storageRead(name, val, type);
    function set(newVal) {
      if (typeof newVal !== 'undefined') {
        storageWrite(name, newVal, type);
        val = newVal;
        return newVal;
      }
      return val;
    }
    exports[name] = set;
    return set;
  }

  // --- Logging util ---

  function warnWithId(message, id) {
    var styles = [];
    if (id) {
      message = '%c' + id + '%c ' + message;
      styles.push('color: #cebd9f;');
      styles.push('');
    }
    logWithStyles(message, 'warn', styles);
  }

  function warn(message, styles) {
    if (ANSI) {
      message = '\x1b[33m' + message +'\x1b[0m';
    }
    logWithStyles(message, 'warn', styles);
  }

  function logWithStyles(str, level, styles) {
    if (!HAS_CONSOLE_STYLES) {
      str = str.replace(/%c/g, '');
      styles = [];
    }
    console[level].apply(console, [str].concat(styles || []));
  }


  // --- Notifying ---

  // Check to prevent internal methods from triggering notifications.
  var isNotifying;

  // Actual notified messages, modified at runtime.
  var notified = {};

  // Generic messages that have been encountered.
  var encountered = {};

  function notify(message, method) {
    var caller = getCaller(), full = optionFull();
    if (!caller) {
      // Don't notify if the caller is suspected of being Sugar itself.
      return;
    }
    if (full) {
      message = getFull(message, method, caller);
    } else {
      message = getOneLine(message, caller.src + ':' + caller.line + ':' + caller.char, method.pid.length + 1);
    }
    if (message in notified) {
      // Never show exact same codepoint, regardless of "unique" flag.
      return;
    }
    warnWithId(message, full ? null : method.pid);
    notified[message] = {
      method: method,
      full: full
    };
  }

  function getFull(message, method, caller) {
    message += '\n';
    if (caller) {
      message += '\n----------- File: ' + caller.src + ' ---------';
      message += '\n----------- Line: ' + caller.line + ' --------------';
      message += '\n----------- Char: ' + caller.char + ' --------------';
    }
    if (method.docs) {
      message += '\n----------- Docs: https://sugarjs.com/docs/#/' + method.docs + ' ---------';
    }
    message += '\n ';
    return message;
  }


  // --- Details ---

  function getIds(u) {
    return typeof u === 'object' ? u : u == null ? [] : [u];
  }

  function showDetails(d) {
    getIds(d).forEach(function(id) {
      var method = METHODS[id - 1];
      if (method) {
        warnWithId(getFull(method.clean, method));
      }
    });
  }

  function showSummary() {
    var count = 0, n;
    for (var msg in notified) {
      if(!notified.hasOwnProperty(msg)) continue;
      n = notified[msg];
      if (!METHODS[n.method.id - 1].suppressed) {
        warnWithId(msg, n.full ? null : n.method.pid);
        count++;
      }
    }
    if (count === 0) {
      var style1 = 'font-size:3.5em;line-height:2.8em;';
      var style2 = 'font-size:1.8em;color:#36c;';
      var message = '%c ' + BEER + '%c No warnings! Ready to upgrade?';
      logWithStyles(message, 'log', [style1, style2]);
    } else {
      var s = count === 1 ? '' : 's';
      var style = 'font-size:1.6em;color:#36c;line-height:1.8em;';
      logWithStyles('%c' + count + ' Total Warning' + s, 'log', [style]);
    }
  }


  // --- Suppressing ---

  function getOrSetSuppressed(s) {
    var suppressed;
    if (s) {
      setSuppressed(getIds(s));
      suppressed = getSuppressed();
      storageWrite('sugarUpgradeSuppressed', suppressed, 'array');
    } else {
      suppressed = getSuppressed();
    }
    return suppressed;
  }

  function getSuppressed() {
    var suppressed = [];
    METHODS.forEach(function(m, i) {
      if (m.suppressed) {
        suppressed.push(i + 1);
      }
    });
    return suppressed;
  }

  function setSuppressed(ids) {
    ids.forEach(function(id) {
      METHODS[id - 1].suppressed = true;
    });
  }

  function clearSuppressed() {
    METHODS.forEach(function(m) {
      m.suppressed = false;
    });
    storageWrite('sugarUpgradeSuppressed', [], 'array');
  }


  // --- Wrapping ---

  function initMethod(method, id) {

    function getNamespace(type) {
      return type.split('.').reduce(function(ns, name) {
        if (!ns[name]) {
          // Create missing namespaces.
          ns[name] = {};
        }
        return ns[name];
      }, global);
    }

    function canNotify(self, args) {
      var wasNotified = method.message in encountered, check;
      check = (!method.suppressed) &&
              (!optionUnique() || !wasNotified) &&
              (!method.check || method.check.apply(self, args));
      if (check) {
        encountered[method.message] = true;
      }
      return check;
    }

    function wrapMethod(target, name) {
      var fn = target[name];
      function withSugarNotification() {
        var message = method.message, result;

        function exec(self, args) {
          if (!fn) {
            var targetName = method.type + (self === target ? '' : '.prototype');
            throw new Error(['Method', name, 'does not exist on', targetName].join(' '));
          }
          return fn.apply(self, args);
        }

        if (method.call) {
          message = message.replace(/%.+%/g, method.call.apply(this, arguments));
        }

        if (!isNotifying && canNotify(this, arguments, id)) {
          // Preventing nested notifications means that we don't have to
          // worry about detecting Sugar in the call stack as any call other
          // than the main entry point must be Sugar calling itself.
          if (fn && fn.name !== 'withSugarNotification') {
            // Prevent internal Sugar calls from triggering notifications,
            // but only if methods are not multi-wrapped.
            isNotifying = true;
          }
          notify(message, method);
          result = exec(this, arguments);
          isNotifying = false;
          return result;
        }
        return exec(this, arguments);
      }
      if (method.check === 'missing') {
        if (fn) {
          method.check = function() {
            return false;
          };
        } else {
          delete method.check;
        }
      }
      target[name] = withSugarNotification;
    }

    function wrapProp(target) {
      var val = target[method.prop];
      Object.defineProperty(target, method.prop, {
        get: function() {
          notify(method.message, method);
          return val;
        },
        set: function(newVal) {
          notify(method.message, method);
          val = newVal;
        }
      });
    }

    var ns = getNamespace(method.type);

    if (method.sName) {
      method.sName.split(',').forEach(function(name) {
        wrapMethod(ns, name);
      });
    }
    if (method.iName) {
      method.iName.split(',').forEach(function(name) {
        wrapMethod(ns.prototype, name);
      });
    }
    if (method.prop && DEFINE_PROPERTY_SUPPORT) {
      wrapProp(ns);
    }

    method.clean = method.message.replace(/%/g, '');
    method.id = id;
    method.pid = pad(id, 2, true);
  }

  // --- Init ---

  function showWelcomeMessage() {
    var welcome = [
      '',
      '%cUpgrade to Sugar 2.0.0!%c',
      '',
      'This script will monitor your calls to Sugar methods, warn you about incompatibilities,',
      'and help you fix them! Just drop it in to get a general idea of what needs to change, or',
      'upgrade and fix as you go! Set options %OPT%:',
      '',
      'sugarUpgradeFull(Boolean)             Shows full metadata with docs link (currently '+ optionFull() +').',
      'sugarUpgradeUnique(Boolean)           Show same message only once (currently '+ optionUnique() +').',
      'sugarUpgradeWelcome(Boolean)          Show this message on load (currently '+ optionWelcome() +').',
      'sugarUpgradeRatio(Number)             Console column width ratio (currently '+ dotFraction(optionRatio()) +').',
      '',
      'sugarUpgradeDetails(Number|Array)     Show full details for a given warning.',
      'sugarUpgradeSupress(Number|Array)     Suppress a given warning.',
      'sugarUpgradeClear()                   Clears suppressed warnings.',
      'sugarUpgradeSummary()                 Shows a summary of warnings received so far.',
      '',
      'When upgrading note that prototypes now must be',
      'extended explicitly through the global in one of two ways:',
      '',
      'Sugar.extend();       %c// Extend all%c',
      'Sugar.Array.extend(); %c// Extend Array methods%c',
      '',
      'Lastly, note that some methods have moved to different modules in 2.0.0.',
      'Have a look at the docs if you are using a custom build and methods are missing.',
      ' '
    ].join('\n');

    welcome = welcome.replace(/%OPT%/, NODE ? 'with exported methods' : 'in the console');
    if (NODE) {
      welcome = welcome.replace(/^sugarUpgradeWelcome.+\n/m, '');
    }
    var h1 = 'font-size:1.4em;background-color:#5886b9;color:#ffffff;padding:2px 8px;border-radius:2px;';
    var p  = 'font-size:1.1em;line-height:1.6em;color:#333;';
    var c  = 'font-size:1.1em;line-height:1.6em;color:#999;';
    logWithStyles(welcome, 'log', [h1, p, c, p, c, p]);
  }

  function getExportToken(str) {
    return IS_BROWSER ? 'sugarUpgrade' + str : str.toLowerCase();
  }

  function init(Sugar, soft) {

    if (Sugar && Object.keys(Sugar).length === 0) {
      // User likely passed in the global object from < 2.0.0 which is
      // an empty object, so just bail here as should already have init.
      return;
    }

    var sugarFound = !!Object.SugarMethods || typeof Sugar !== 'undefined';

    if (!sugarFound && soft) {

      if (IS_BROWSER) {
        //  Sugar not loaded yet, so initialize again after page load...
        warn('Sugar not found! Will retry...');
        window.addEventListener('load', function() {
          init(global['Sugar'], false);
        });
      }
      return;
    } else if (!sugarFound && soft === false) {
      warn('Sugar still not found! Bailing...');
      return;
    }

    setCurrentFilename();
    setSuppressed(storageRead('sugarUpgradeSuppressed', [], 'array'));

    for (var i = 0; i < METHODS.length; i++) {
      initMethod(METHODS[i], i + 1);
    }

    if (optionWelcome()) {
      showWelcomeMessage();
    }

  }

  var optionRatio   = exportOption(getExportToken('Ratio'), .75, 'number');
  var optionFull    = exportOption(getExportToken('Full'), false, 'boolean');
  var optionUnique  = exportOption(getExportToken('Unique'), true, 'boolean');
  var optionWelcome = exportOption(getExportToken('Welcome'), true, 'boolean');

  exports[getExportToken('Init')]     = init;
  exports[getExportToken('Clear')]    = clearSuppressed;
  exports[getExportToken('Summary')]  = showSummary;
  exports[getExportToken('Details')]  = showDetails;
  exports[getExportToken('Suppress')] = getOrSetSuppressed;

  init(global['Sugar'], true);

})(this, typeof global !== 'undefined' ? global : this, typeof __filename !== 'undefined' ? __filename : null);
