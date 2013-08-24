//  Compatibility index:
//
//  0 - Does not exist.
//  1 - Exists but does not support all functionality.
//  2 - Exists and supports all functionality.
//  3 - Exists and supports all functionality plus more.

var SugarPrototypeMethods = [
  {
  // Global namespace
  type: 'class',
  namespace: 'Global',
  methods: [
    {
      name: 'Hash',
      description: 'Creates a hash object with methods specific to working with hashes.',
      sugar_compatibility: 1,
      sugar_notes: 'The Hash class does not exist in Sugar, however hash-like objects exist through Object.extended, which will return an extended object with instance methods on it similar to hashes in Prototype. Keep in mind, however, that the instance methods available to extended objects in Sugar do not 100% match those of Prototype.',
      original_code: "$H({ 0: 'a', 1: 'b', 2: 'c' })",
      sugar_code: "Object.extended({ 0: 'a', 1: 'b', 2: 'c' })",
      ref: 'Object/extended'
    },
    {
      name: '$A',
      description: 'Creates an array from an array-like collection',
      sugar_compatibility: 1,
      sugar_notes: '$A exists in Sugar as Array.create. Be aware, however, that when a Javascript primitive is passed, it will simply be added to the array. If, for example, you need a string to be split into the array, then use the standard String#split instead. The most common use of this method, converting an arguments object into an actual array, will work, however.',
      original_code: '$A(arguments)',
      sugar_code: 'Array.create(arguments)',
      ref: 'Array/create'
    },
    {
      name: '$H',
      description: 'Creates a hash object with methods specific to working with hashes.',
      sugar_compatibility: 1,
      sugar_notes: '$H exists in Sugar as Object.extended. This will return an extended object with instance methods on it similar to hashes in Prototype. Keep in mind, however, that the instance methods available to extended objects in Sugar do not 100% match those of Prototype.',
      original_code: "$H({ 0: 'a', 1: 'b', 2: 'c' })",
      sugar_code: "Object.extended({ 0: 'a', 1: 'b', 2: 'c' })",
      ref: 'Object/extended'
    },
    {
      name: '$R',
      description: 'Creates an ObjectRange object that represents a range of consecutive values.',
      sugar_compatibility: 0,
      sugar_notes: '$R exists in Sugar as ranges, which can be created via Number.range, Date.range, or String.range. Additionally Number#upto or Number#downto will return an array of numbers in that range.',
      original_code: "$R(0, 10)",
      sugar_code: "(0).upto(10)",
      ref: 'Number/upto'
    },
    {
      name: '$w',
      description: 'Splits a string into an array with all whitespace treated as a delimiter',
      sugar_compatibility: 0,
      sugar_notes: '$w does not exist in Sugar. Use native String#split instead.',
      original_code: "$w('apples and oranges')",
      sugar_code: "'apples and oranges'.split(' ')"
    }
  ]
},
{
  namespace: 'Number',
  type: 'instance',
  methods: [
    {
    name: 'succ',
    description: 'Returns the successor (+1) of the current number.',
    sugar_compatibility: 0,
    sugar_notes: 'Number#succ does not exist in Sugar. This is often done with the + operator :)',
    original_code: "num.succ()",
    sugar_code: "num + 1"
  },
  {
    name: 'times',
    description: 'Calls the passed iterator n times, where n is the number.',
    sugar_compatibility: 1,
    sugar_notes: 'Number#times exists in Sugar but does not take a context argument. Use Function#bind for this purpose instead.',
    original_code: "(8).times(function(){}, 'barf')",
    sugar_code: "(8).times(function(){}.bind('barf'))",
    live_notes: 'Number#times does not accept a second argument, but found {1}. If you need to bind context, use Function#bind instead.',
    conflict: function() {
      var type = typeof arguments[1];
      return [arguments.length > 1 && type != 'number', arguments[1]];
    },
    ref: 'Function/bind'
  },
  {
    name: 'toColorPart',
    description: 'Returns a 2 digit hexadecimal representation of the number.',
    sugar_compatibility: 2,
    sugar_notes: 'Number#toColorPart exists in Sugar as Number#hex (pad to 2 places).',
    original_code: "(255).toColorPart()",
    sugar_code: "(255).hex(2)",
    ref: 'Number/hex'
  },
  {
    name: 'toPaddedString',
    description: 'Returns a string representation of the number padded with zeros.',
    sugar_compatibility: 2,
    sugar_notes: 'Number#toPaddedString exists in Sugar as Number#pad. Note that in Sugar, the radix is the third argument, as the second is to force the sign.',
    original_code: "(20).toPaddedString(4, 2)",
    sugar_code: "(20).pad(4, false, 2)",
    ref: 'Number/pad'
  },
  {
    name: 'abs',
    description: 'Returns the absolute value of the number.',
    sugar_compatibility: 2,
    sugar_notes: 'Number#abs exists in Sugar and is identical.',
    conflict: false,
    ref: 'Number/abs'
  },
  {
    name: 'ceil',
    description: 'Rounds then number up.',
    sugar_compatibility: 3,
    sugar_notes: 'Number#ceil exists in Sugar. It can additionally round to a precision, specified in the first argument.',
    conflict: false,
    ref: 'Number/ceil'
  },
  {
    name: 'floor',
    description: 'Rounds then number down.',
    sugar_compatibility: 3,
    sugar_notes: 'Number#floor exists in Sugar. It can additionally round to a precision, specified in the first argument.',
    conflict: false,
    ref: 'Number/floor'
  },
  {
    name: 'round',
    description: 'Rounds then number.',
    sugar_compatibility: 3,
    sugar_notes: 'Number#round exists in Sugar. It can additionally round to a precision, specified in the first argument.',
    conflict: false,
    ref: 'Number/round'
  }
  ]
},
{
  namespace: 'String',
  type: 'class',
  methods: [
    {
    name: 'interpret',
    description: 'Coerces the value into a string.',
    sugar_compatibility: 0,
    sugar_notes: 'String.interpret does not exist in Sugar. Use String() instead. Note, however that this will not convert null/undefined into a blank string, as is the case with String.interpret.',
    original_code: "String.interpret(156)",
    sugar_code: "String(156)"
  }
  ]
},
{
  namespace: 'String',
  type: 'instance',
  methods: [
    {
    name: 'blank',
    description: 'Checks if the string is empty or contains only whitespace.',
    sugar_compatibility: 2,
    sugar_notes: 'String#blank exists in Sugar as String#isBlank.',
    original_code: "'hello'.blank()",
    sugar_code: "'hello'.isBlank()",
    ref: 'String/isBlank'
  },
  {
    name: 'camelize',
    description: 'Converts a string to its camelCase equivalent.',
    sugar_compatibility: 3,
    sugar_notes: 'String#camelize exists and will also operate on whitespace and underscores as well as dashes.',
    live_notes: 'String#camelize found white space or underscores! Note that #camelize in Sugar will remove whitespace and operate on underscores the same as dashes.',
    conflict: function() {
      return /[ _]/.test(this);
    },
    ref: 'String/camelize'
  },
  {
    name: 'dasherize',
    description: 'Replaces underscores with dashes.',
    sugar_compatibility: 3,
    sugar_notes: 'Sugar#dasherize will also remove whitespace and convert camelCase as well.',
    conflict: function() {
      return /[A-Z\s]/.test(this);
    },
    live_notes: 'String#dasherize found white space or capital letters! Note that #dasherize in Sugar will remove whitespace and operate on capital letters the same as underscores.',
    ref: 'String/dasherize'
  },
  {
    name: 'empty',
    description: 'Checks if the string is empty.',
    sugar_compatibility: 0,
    sugar_notes: 'String#empty does not exist in Sugar. Use a straight comparison instead.',
    original_code: "str.empty()",
    sugar_code: "str === ''"
  },
  {
    name: 'evalJSON',
    description: 'Evaluates the string as JSON and returns the resulting object.',
    sugar_compatibility: 0,
    sugar_notes: 'String#evalJSON does not exist in Sugar. JSON.parse may work as an alternative, but it is not available in all browsers. If you absolutely require JSON support, consider adding in a separate library such as: https://github.com/douglascrockford/JSON-js',
    original_code: "str.evalJSON()",
    sugar_code: "JSON.parse(str)"
  },
  {
    name: 'evalScripts',
    description: 'Evaluates the content of any <script> block in the string.',
    sugar_compatibility: 0,
    sugar_notes: "String#evalScripts does not exist in Sugar. It's highly unlikely that you should be doing something like this anyway, (and even if you are, libraries like jQuery should perform this automatically), but if you really need to in a pinch, something like this may work:",
    original_code: "str.evalScripts()",
    sugar_code: "str.match(/<script.*?>.+?<\/script>/g).map(function(m){\n  return eval(m.replace(/<\\/?script.*?>/g, ''));\n})"
  },
  {
    name: 'extractScripts',
    description: 'Extracts <script> blocks in the string and returns them as an array.',
    sugar_compatibility: 0,
    sugar_notes: 'String#extractScripts does not exist in Sugar. If you really need to do this, then in a pinch something like this may work.',
    original_code: "str.extractScripts()",
    sugar_code: "str.match(/<script.*?>.+?<\/script>/g).map(function(m){\n  return m.replace(/<\\/?script.*?>/g, '');\n})"
  },
  {
    name: 'gsub',
    description: 'Returns the string with every occurrence of the passed regex replaced.',
    sugar_compatibility: 0,
    sugar_notes: 'String#gsub does not exist in Sugar. Just use the native .replace function instead. Note that Javascript allows functions to be passed to .replace just like gsub.',
    original_code: "'Image: (img.png)'.gsub(/Image: \(.+\)/, function(match, src) {\n  return '<img src=\"' + src + '\" />';\n})",
    sugar_code: "'Image: (img.png)'.replace(/Image: \(.+\)/, function(match, src) {\n  return '<img src=\"' + src + '\" />';\n})"
  },
  {
    name: 'include',
    description: 'Checks if the string contains the substring.',
    sugar_compatibility: 2,
    sugar_notes: 'String#include exists in Sugar as String#has.',
    original_code: "'foobar'.include('bar')",
    sugar_code: "'foobar'.has('bar')",
    ref: 'String/has'
  },
  {
    name: 'inspect',
    description: 'Returns a debug oriented version of the string.',
    sugar_compatibility: 0,
    sugar_notes: 'String#inspect does not exist in Sugar. Consider using JSON.stringify(str) instead. The JSON global does not exist in all implementations but should be enough to get you through a debug session.',
    original_code: "'foofa'.inspect()",
    sugar_code: "JSON.stringify('foofa')"
  },
  {
    name: 'interpolate',
    description: 'Fills the string with properties of an object, using the syntax #{}.',
    sugar_compatibility: 3,
    sugar_notes: 'String#interpolate exists in Sugar as String#assign, with a slightly different syntax.',
    original_code: "'i like #{fruit}'.interpolate({ fruit: 'peaches' })",
    sugar_code: "'i like {fruit}'.assign({ fruit: 'peaches' })",
    ref: 'String/assign'
  },
  {
    name: 'isJSON',
    description: 'Checks if the string is valid JSON.',
    sugar_compatibility: 0,
    sugar_notes: 'String#isJSON does not exist in Sugar. The simplest way of determining if a value is JSON or not is to attempt parsing and catch errors. If you absolutely require full JSON support, consider adding in a separate library such as: https://github.com/douglascrockford/JSON-js',
    original_code: "valid = str.isJSON()",
    sugar_code: "try { JSON.parse(str); valid = true; } catch(e){ valid = false; }"
  },
  {
    name: 'scan',
    description: 'Iterates over every occurrence of the passed regex pattern.',
    sugar_compatibility: 3,
    sugar_notes: 'String#scan exists in Sugar as String#each. It additionally returns an array of the matched patterns.',
    original_code: "'apple, pear & orange'.scan(/\w+/, console.log)",
    sugar_code: "'apple, pear & orange'.each(/\w+/, console.log)",
    ref: 'String/each'
  },
  {
    name: 'strip',
    description: 'Removes leading and trailing whitespace from the string.',
    sugar_compatibility: 2,
    sugar_notes: 'String#strip exists in Sugar as String#trim. This is an ES5 standard method that Sugar provides a shim for when unavailable.',
    original_code: "'    howdy   '.strip()",
    sugar_code: "'    howdy   '.trim()",
    ref: 'String/trim'
  },
  {
    name: 'stripScripts',
    description: 'Strips HTML <script> tags from the string.',
    sugar_compatibility: 3,
    sugar_notes: 'String#stripScripts can be achieved in Sugar with String#removeTags.',
    original_code: "'<script>doEvilStuff();</script>'.stripScripts()",
    sugar_code: "'<script>doEvilStuff();</script>'.removeTags('script')",
    ref: 'String/removeTags'
  },
  {
    name: 'stripTags',
    description: 'Strips the string of any HTML tags.',
    sugar_notes: 'String#stripTags exists in Sugar and will additionally strip tags like <xsl:template>.',
    sugar_compatibility: 3,
    live_notes: 'String#stripTags found namespaced tags such as <xsl:template>. Be aware that Sugar will strip these tags too!',
    conflict: function() {
      return arguments.length == 0 && /<.*?:.*?>/.test(this);
    },
    ref: 'String/stripTags'
  },
  {
    name: 'sub',
    description: 'Returns a string with the first occurrence of the regex pattern replaced.',
    sugar_compatibility: 0,
    sugar_notes: 'String#sub does not exist in Sugar. Standard Javascript .replace is the closest approximation. If you need to replace more than one occurrence of a pattern (but not all), your best bet is to set a counter and test against it.',
    original_code: "'one two three four'.sub(' ', ', ', 2)",
    sugar_code: "var c = 0; 'one two three four'.replace(/\s/g, function(m, i){ c++; return c < 3 ? ', ' : ' '; })"
  },
  {
    name: 'succ',
    description: 'Returns the next character in the Unicode table.',
    sugar_compatibility: 3,
    sugar_notes: 'String#succ exists in Sugar as String#shift, which can move up or down the Unicode range by a number which is the first argument passed.',
    original_code: "'a'.succ()",
    sugar_code: "'a'.shift(1);",
    ref: 'String/shift'
  },
  {
    name: 'times',
    description: 'Concatenates the string n times, where n is the first argument.',
    sugar_compatibility: 2,
    sugar_notes: 'String#times exists in Sugar as String#repeat.',
    original_code: "'echo '.times(3)",
    sugar_code: "'echo '.repeat(3);",
    ref: 'String/repeat'
  },
  {
    name: 'toArray',
    description: 'Returns the string as an array of characters.',
    sugar_compatibility: 3,
    sugar_notes: 'String#toArray exists in Sugar as String#chars, which can also run a function against each character.',
    original_code: "'howdy'.toArray()",
    sugar_code: "'howdy'.chars();",
    ref: 'String/chars'
  },
  {
    name: 'toQueryParams',
    description: 'Parses a URI-like query string and returns an object of key/value pairs.',
    sugar_compatibility: 3,
    sugar_notes: 'String#toQueryParams exists in Sugar but from an inverted perspective as Object.fromQueryString. Note that by default this will also parse out nested params with the non-standard "[]" syntax, however this can be turned off.',
    original_code: "'section=blog&id=45'.toQueryParams()",
    sugar_code: "Object.fromQueryString('section=blog&id=45')",
    ref: 'Object/fromQueryString'
  },
  {
    name: 'truncate',
    description: 'Truncates a string to the given length and adds a suffix to it.',
    sugar_compatibility: 3,
    sugar_notes: 'String#truncate exists in Sugar and additionally allows truncating from the left or middle. Also, String#truncateOnWord will do the same as truncate but not split words.',
    original_code: "longString.truncate(10)",
    sugar_code: "longString.truncate(10)",
    ref: 'String/truncate'
  },
  {
    name: 'underscore',
    description: 'Converts a camelized string into words separated by an underscore.',
    sugar_compatibility: 3,
    sugar_notes: 'String#underscore exists in Sugar and will additionally remove all white space.',
    conflict: function() {
      return /\s/.test(this);
    },
    live_notes: 'String#underscore found white space! Note that underscore in Sugar will remove all whitespace.',
    ref: 'String/underscore'
  },
  {
    name: 'unfilterJSON',
    description: 'Strips comment delimiters around Ajax JSON or Javascript responses.',
    sugar_compatibility: 0,
    sugar_notes: 'String#unfilterJSON does not exist in Sugar.'
  },
  {
    name: 'capitalize',
    description: 'Capitalizes the first letter of the string and downcases the others.',
    sugar_compatibility: 3,
    sugar_notes: 'String#capitalize exists in Sugar. Passing true as the first argument will additionally capitalize all words.',
    conflict: false,
    ref: 'String/capitalize'
  },
  {
    name: 'startsWith',
    description: 'Checks if the string starts with the passed substring.',
    sugar_compatibility: 3,
    sugar_notes: 'String#startsWith exists in Sugar and additionally accepts an argument for case sensitivity (default is true).',
    conflict: false,
    ref: 'String/startsWith'
  },
  {
    name: 'endsWith',
    description: 'Checks if the string ends with the passed substring.',
    sugar_compatibility: 3,
    sugar_notes: 'String#endsWith exists in Sugar and additionally accepts an argument for case sensitivity (default is true).',
    conflict: false,
    ref: 'String/endsWith'
  },
  {
    name: 'escapeHTML',
    description: 'Converts HTML special characters to their entity equivalents.',
    sugar_compatibility: 2,
    sugar_notes: 'String#escapeHTML exists in Sugar is identical.',
    conflict: false,
    ref: 'String/escapeHTML'
  },
  {
    name: 'unescapeHTML',
    description: 'Converts HTML entities to their normal form.',
    sugar_compatibility: 2,
    sugar_notes: 'String#unescapeHTML exists in Sugar is identical.',
    ref: 'String/unescapeHTML'
  }
  ]
},
{
  namespace: 'Hash',
  type: 'instance',
  methods: [
    {
    name: 'each',
    description: 'Iterates over each key/value entry in the hash.',
    sugar_notes: 'Extended objects in Sugar function like hashes and have an identical each method.',
    sugar_compatibility: 2,
    conflict: function() {
      var type = typeof arguments[1];
      return [arguments.length > 1 && type != 'number', arguments[1]];
    },
    live_notes: 'Second argument to .each found. If you need to bind context, use Function#bind instead.',
    original_code: "new Hash().each(function(){}, 'context')",
    sugar_code: "Object.extended().each(function(){}.bind('context'))",
    ref: 'Object/each'
  },
  {
    name: 'get',
    description: 'Retrieves the hash value for the given key.',
    sugar_notes: 'Sugar extended objects do not have a "get" method. Simply access the property as you would a normal object literal.',
    sugar_compatibility: 0,
    original_code: "var h = new Hash({ foo: 'bar' }); h.get('foo')",
    sugar_code: "var h = Object.extended({ foo: 'bar' }); h['foo']",
    ref: 'Object/extended'
  },
  {
    name: 'index',
    description: 'Returns the first key in the hash whose value matches the passed value.',
    sugar_compatibility: 0,
    sugar_notes: 'Sugar extended objects do not have an "index" method. Object.keys can provide help to get this.',
    original_code: "var key = new Hash({ foo: 'bar' }).index('bar')",
    sugar_code: "var key; Object.extended({ foo: 'bar' }).keys(function(k){ if(this[k] == 'bar') key = k; })"
  },
  {
    name: 'inspect',
    description: 'Returns a debug-oriented string representation of the hash.',
    sugar_compatibility: 0,
    sugar_notes: 'Sugar extended objects do not have an "inspect" method. Consider using JSON.stringify() instead. The JSON global does not exist in all implementations but should be enough to get you through a debug session.',
    original_code: "new Hash({ foo: 'bar' }).inspect()",
    sugar_code: "JSON.stringify(Object.extended({ foo: 'bar' }))"
  },
  {
    name: 'merge',
    description: "Returns a new hash with the passed object's key/value pairs merged in.",
    sugar_compatibility: 3,
    sugar_notes: 'Sugar extended objects have a "merge" method, and have additional functionality such as specifying deep/shallow merges and resolution of conflicts. Unlike prototype they will modify the object. If you need to create a clone, use the "clone" method first.',
    original_code: "new Hash({ foo: 'bar' }).merge({ moo: 'car' })",
    sugar_code: "Object.extended({ foo: 'bar' }).clone().merge({ moo: 'car' })",
    ref: 'Object/merge'
  },
  {
    name: 'set',
    description: 'Sets a value in the hash for the given key.',
    sugar_compatibility: 0,
    sugar_notes: 'Sugar extended objects do not have a "set" method. Simply set the property as you would a normal object literal.',
    original_code: "var h = new Hash({ foo: 'bar' }); h.set('moo', 'car')",
    sugar_code: "var h = Object.extended({ foo: 'bar' }); h['moo'] = 'car'",
    ref: 'Object/extended'
  },
  {
    name: 'toJSON',
    description: 'Returns a JSON representation of the hash.',
    sugar_compatibility: 0,
    sugar_notes: 'Sugar extended objects do not have a "toJSON" method.  JSON.stringify may work as an alternative, but it is not available in all browsers. If you absolutely require JSON support, consider adding in a separate library such as: https://github.com/douglascrockford/JSON-js',
    original_code: "Object.toJSON(obj)",
    sugar_code: "JSON.stringify(obj)"
  },
  {
    name: 'toObject',
    description: 'Returns a cloned, vanilla object with the same properties as the hash.',
    sugar_compatibility: 0,
    sugar_notes: 'Sugar extended objects do not have a "toObject" method, as they already behave like vanilla objects.',
    ref: 'Object/extended'
  },
  {
    name: 'toTemplateReplacements',
    description: 'Returns a vanilla object, alias of Hash#toObject.',
    sugar_compatibility: 0,
    sugar_notes: 'Sugar extended objects do not have a "toTemplateReplacements" method. This method is not necessary as extended objects already behave like vanilla objects.',
    ref: 'Object/extended'
  },
  {
    name: 'unset',
    description: 'Deletes the property in the hash for the given key.',
    sugar_compatibility: 0,
    sugar_notes: 'Sugar extended objects do not have an "unset" method. Simply delete the property as you would a normal object literal.',
    original_code: "var h = new Hash({ foo: 'bar' }); h.unset('foo')",
    sugar_code: "var h = Object.extended({ foo: 'bar' }); delete h.foo",
    ref: 'Object/extended'
  },
  {
    name: 'update',
    description: 'Updates the hash in place by merging in the passed object.',
    sugar_compatibility: 2,
    sugar_notes: 'Hash#update exists in Sugar as "merge" on extended objects.',
    original_code: "new Hash({ foo: 'bar' }).merge({ moo: 'car' })",
    sugar_code: "Object.extended({ foo: 'bar' }).merge({ moo: 'car' })",
    ref: 'Object/merge'
  },
  {
    name: 'clone',
    description: 'Returns a clone of the hash.',
    sugar_compatibility: 2,
    sugar_notes: 'Hash#clone exists on Sugar extended objects, and is identical.',
    original_code: "new Hash({ foo: 'bar' }).clone()",
    sugar_code: "Object.extended({ foo: 'bar' }).clone()",
    conflict: false,
    ref: 'Object/clone'
  },
  {
    name: 'keys',
    description: 'Returns an array of all keys defined on the hash.',
    sugar_compatibility: 2,
    sugar_notes: 'Hash#keys exists on Sugar extended objects, and is identical.',
    original_code: "new Hash({ foo: 'bar' }).keys()",
    sugar_code: "Object.extended({ foo: 'bar' }).keys()",
    conflict: false,
    ref: 'Object/keys'
  },
  {
    name: 'values',
    description: 'Returns an array of all values in the hash.',
    sugar_compatibility: 2,
    sugar_notes: 'Hash#values exists on Sugar extended objects, and is identical.',
    original_code: "new Hash({ foo: 'bar' }).values()",
    sugar_code: "Object.extended({ foo: 'bar' }).values()",
    conflict: false,
    ref: 'Object/values'
  },
  {
    name: 'toQueryString',
    description: 'Returns a URL-encoded string representing the contents of the hash.',
    sugar_compatibility: 0,
    sugar_notes: 'Hash#toQueryString exists in Sugar as Object.toQueryString.',
    original_code: "hash.toQueryString()",
    sugar_code: "Object.toQueryString(obj);"
  }
  ]
},
{
  namespace: 'Object',
  type: 'class',
  methods: [
    {
    name: 'clone',
    description: 'Returns a shallow copy of the object.',
    sugar_compatibility: 3,
    sugar_notes: 'Object.clone exists in Sugar and additionally can create deep clones as well.',
    conflict: false,
    ref: 'Object/clone'
  },
  {
    name: 'extend',
    description: 'Copies all properties from the source to the destination object.',
    sugar_compatibility: 3,
    sugar_notes: 'Object.extend exists in Sugar as Object.merge. It can optionally do deep merges as well as intelligent conflict resolution.',
    original_code: "Object.extend({ a: 1 }, { b: 2 })",
    sugar_code: "Object.merge({ a: 1 }, { b: 2 })",
    ref: 'Object/merge'
  },
  {
    name: 'inspect',
    description: 'Returns a debug-oriented representation of the object.',
    sugar_compatibility: 0,
    sugar_notes: 'Object.inspect does not exist in Sugar. Consider using JSON.stringify(object) instead. The JSON global does not exist in all implementations but should be enough to get you through a debug session.',
    original_code: "Object.inspect([1,2,3])",
    sugar_code: "JSON.stringify([1,2,3])"
  },
  {
    name: 'isHash',
    description: 'Returns true if the object is a hash.',
    sugar_compatibility: 2,
    sugar_notes: 'Object.isHash does not exist in Sugar. Use Object.isObject instead.',
    original_code: "Object.isHash({ a: 1 })",
    sugar_code: "Object.isObject({ a: 1 })",
    ref: 'Object/isObject'
  },
  {
    name: 'isUndefined',
    description: 'Returns true if the object is undefined.',
    sugar_compatibility: 0,
    sugar_notes: 'Object.isUndefined does not exist in Sugar. Use straight Javascript instead.',
    original_code: "Object.isUndefined(obj)",
    sugar_code: "obj === undefined"
  },
  {
    name: 'toJSON',
    description: 'Returns a JSON representation of the object.',
    sugar_compatibility: 0,
    sugar_notes: 'Object.toJSON does not exist in Sugar. JSON.stringify may work as an alternative, but it is not available in all browsers. If you absolutely require JSON support, consider adding in a separate library such as: https://github.com/douglascrockford/JSON-js',
    original_code: "Object.toJSON(obj)",
    sugar_code: "JSON.stringify(obj)"
  },
  {
    name: 'isArray',
    description: 'Returns true if the object is an array.',
    sugar_compatibility: 2,
    sugar_notes: 'Object.isArray and is an alias of browser native Array.isArray, which is shimmed if it does not exist.',
    conflict: false,
    ref: 'Object/isArray'
  },
  {
    name: 'isDate',
    description: 'Returns true if the object is a date.',
    sugar_compatibility: 2,
    sugar_notes: 'Object.isDate exists in Sugar and is identical.',
    conflict: false,
    ref: 'Object/isDate'
  },
  {
    name: 'isFunction',
    description: 'Returns true if the object is a function.',
    sugar_compatibility: 2,
    sugar_notes: 'Object.isFunction exists in Sugar and is identical.',
    conflict: false,
    ref: 'Object/isFunction'
  },
  {
    name: 'isNumber',
    description: 'Returns true if the object is a number.',
    sugar_compatibility: 2,
    sugar_notes: 'Object.isNumber exists in Sugar and is identical.',
    conflict: false,
    ref: 'Object/isNumber'
  },
  {
    name: 'isString',
    description: 'Returns true if the object is a string.',
    sugar_compatibility: 2,
    sugar_notes: 'Object.isString exists in Sugar and is identical.',
    conflict: false,
    ref: 'Object/isString'
  },
  {
    name: 'keys',
    description: 'Returns an array of the keys in the object.',
    sugar_compatibility: 2,
    sugar_notes: 'Object.keys is a browser native method, which Sugar provides a shim for if it does not exist.',
    conflict: false,
    ref: 'Object/keys'
  },
  {
    name: 'values',
    description: 'Returns an array of the values in the object.',
    sugar_compatibility: 2,
    sugar_notes: 'Object.values exists in Sugar and is identical.',
    conflict: false,
    ref: 'Object/values'
  },
  {
    name: 'isElement',
    description: 'Returns true if the object is a DOM element.',
    sugar_compatibility: 0,
    sugar_notes: "Sugar, which has no direct association with the DOM, does not provide this method. However, this functionality can be easily replicated (taken from Prototype's own implementation).",
    original_code: 'Object.isElement(obj)',
    sugar_code: 'Object.extend({ isElement: function(obj){ return !!(obj && obj.nodeType == 1); }}, false, false);'
  },
  {
    name: 'toHTML',
    description: 'Returns an HTML representation of the object.',
    sugar_compatibility: 0,
    sugar_notes: "Object.toHTML does not exist in Sugar. You'll have to define this one yourself!"
  },
  {
    name: 'toQueryString',
    description: 'Returns a URL-encoded string representing the contents of the object.',
    sugar_compatibility: 0,
    sugar_notes: 'Object.toQueryString exists in Sugar and additionally allows a parameter to namespace deep params.',
    original_code: "Object.toQueryString(obj)",
    sugar_code: "Object.toQueryString(obj);"
  }
  ]
},
{
  namespace: 'Array',
  type: 'class',
  methods: [
    {
    name: 'from',
    description: 'Creates an array from an array-like collection.',
    sugar_compatibility: 2,
    sugar_notes: 'Array.from exists in Sugar as Array.create. Be aware, however, that when a Javascript primitive is passed, it will simply be added to the array. If, for example, you need a string to be split into the array, then use the standard String#split instead. The most common use of this method, converting an arguments object into an actual array, will work, however.',
    original_code: "Array.from(arguments)",
    sugar_code: "Array.create(arguments)",
    ref: 'Array.create'
  }
  ]
},
{
  namespace: 'Array',
  type: 'instance',
  methods: [
    {
    name: 'collect',
    description: 'Returns the result of applying an iterator to the array.',
    sugar_compatibility: 3,
    sugar_notes: 'Enumerable#collect exists Sugar as Array#map, and can additionally pass a shortcut string for a function that returns a property of the same name.',
    original_code: "[1,2,3].collect(function(n){ return n * 2; })",
    sugar_code: "[1,2,3].map(function(n){ return n * 2; })",
    ref: 'Array/map'
  },
  {
    name: 'detect',
    description: 'Returns the first element for which the iterator returns a truthy value.',
    sugar_compatibility: 3,
    sugar_notes: 'Enumerable#detect exists in Sugar as Array#find, and is identical.',
    original_code: "[1,2,3].detect(function(n){ return n > 1; })",
    sugar_code: "[1,2,3].find(function(n){ return n > 1; })",
    ref: 'Array/find'
  },
  {
    name: 'each',
    description: 'Iterates over the key/value pairs in the hash.',
    sugar_compatibility: 3,
    sugar_notes: 'Array#each exists in Sugar and can additionally pass a starting index and loop from the beginning of the array. If context needs to be bound, use Function#bind instead.',
    conflict: function() {
      var type = typeof arguments[1];
      return [arguments.length > 1 && type != 'number', arguments[1]];
    },
    live_notes: 'Second argument to .each should be a number but instead was {1}. If you need to bind context, use Function#bind instead.',
    original_code: "['a','b','c'].each(function(){}, 'context')",
    sugar_code: "['a','b','c'].each(function(){}.bind('context'))",
    ref: 'Array/each'
  },
  {
    name: 'eachSlice',
    description: 'Groups array elements into chunks of a given size and iterates over them.',
    sugar_compatibility: 2,
    sugar_notes: 'Enumerable#eachSlice exists in Sugar as Array#inGroupsOf instead.',
    original_code: "[1,2,3,4].eachSlice(2, function(){})",
    sugar_code: "[1,2,3,4].inGroupsOf(2).each(function(){})",
    ref: 'Array/inGroupsOf'
  },
  {
    name: 'entries',
    description: 'alias of enumerable#toarray.',
    sugar_compatibility: 2,
    sugar_notes: 'Enumerable#entries is not necessary in Sugar, but its behavior of effectively cloning the array can be achieved with Array#clone.',
    original_code: "[1,2,3].entries()",
    sugar_code: "[1,2,3].clone()",
    ref: 'Array/clone'
  },
  {
    name: 'find',
    description: 'Returns the first element for which the iterator returns a truthy value.',
    sugar_notes: 'Array#find also exists in Sugar and is identical.',
    sugar_compatibility: 3,
    conflict: function() {
      var type = typeof arguments[1];
      return [arguments.length > 1 && type != 'number', arguments[1]];
    },
    live_notes: 'Second argument to Array#find should be a number but instead was {1}. If you need to bind context, use Function#bind instead.',
    original_code: "['a','b','c'].find(function(){}, 'context')",
    sugar_code: "['a','b','c'].find(function(){}.bind('context'))",
    ref: 'Function/bind'
  },
  {
    name: 'findAll',
    description: 'Returns all elements for which the iterator returns a truthy value.',
    sugar_notes: 'Array#findAll also exists in Sugar. Some semantic differences exist including the ability to pass a starting index in the place of in-line context binding.',
    sugar_compatibility: 3,
    conflict: function() {
      var type = typeof arguments[1];
      return [arguments.length > 1 && type != 'number', arguments[1]];
    },
    live_notes: 'Second argument to Array#findAll should be a number but instead was {1}. If you need to bind context, use Function#bind instead.',
    original_code: "['a','b','c'].findAll(function(){}, 'context')",
    sugar_code: "['a','b','c'].findAll(function(){}.bind('context'))",
    ref: 'Function/bind'
  },
  {
    name: 'grep',
    description: 'Returns all elements for which the passed regex matches.',
    sugar_compatibility: 3,
    sugar_notes: 'Enumerable#grep exists in Sugar as Array#findAll with slightly different semantics.',
    original_code: "['a','b','c'].grep(/[ab]/)",
    sugar_code: "['a','b','c'].findAll(/[ab]/)",
    ref: 'Array/findAll'
  },
  {
    name: 'include',
    description: 'Returns true if the array contains the given element.',
    sugar_compatibility: 3,
    sugar_notes: 'Enumerable#include exists in Javascript as native Array#some, or the Sugar alias Array#any. Array#include in Sugar instead the passed argument to the array without modifying it. Array#include is a reciprocal of Array#exclude, and a non-destructive version of Array#add.',
    conflict: function(f) {
      return typeof f !== 'object' && arguments.length == 1;
    },
    original_code: "[1,2,3].include(1)",
    sugar_code: "[1,2,3].any(1)",
    ref: 'Array/has'
  },
  {
    name: 'inject',
    description: 'Incrementally builds a return value by successively iterating over the array.',
    sugar_compatibility: 2,
    sugar_notes: 'Enumerable#inject in Javascript as native Array#reduce. Sugar provides a shim for this method when it does not exist.',
    original_code: '[1,2,3,4].inject(100, function(a, b){ return a + b; });',
    sugar_code: '[1,2,3,4].reduce(function(a, b){ return a + b; }, 100);'
  },
  {
    name: 'invoke',
    description: 'Invokes the same method for each element in the array.',
    sugar_compatibility: 2,
    sugar_notes: 'Sugar allows a string shortcut to be passed to Array#map, which achieves the same effect as Array#invoke.',
    original_code: "['hello','world'].invoke('toUpperCase')",
    sugar_code: "['hello','world'].map('toUpperCase')",
    ref: 'Array/map'
  },
  {
    name: 'max',
    description: 'Returns the element of the array with the highest value.',
    sugar_compatibility: 2,
    sugar_notes: 'Array#max exists in Sugar and additionally has the ability to return all the maximum values, as more than one may exist. Sugar also returns the actual array element instead of the return value of the iterator. Sugar also does not allow a context parameter, use Function#bind instead.',
    live_notes: 'Use caution when using Enumerable#max:  (1) Sugar will return an array of maximum values (as there can be more than one), where Prototype only returns the first value. (2) When using iterators, Prototype will return the value compared, where Sugar will return the actual array element itself. (3) Finally, Sugar does not allow a context to be passed. Use Function#bind instead to bind context.',
    original_code: "[{ a: 5 },{ a: 10 }].max(function(el){ return el['a']; }, 'context')",
    sugar_code: "[{ a: 5 },{ a: 10 }].max(function(el){ return el['a']; }.bind('context')).first().a",
    ref: 'Array/max'
  },
  {
    name: 'member',
    description: 'Returns true if the array contains the given element. Alias of Enumerable#include.',
    sugar_compatibility: 2,
    sugar_notes: 'Enumerable#member exists in Javascript as Array#some or the Sugar alias Array#any.',
    original_code: "[1,2,3].member(1)",
    sugar_code: "[1,2,3].any(1)",
    ref: 'Array/has'
  },
  {
    name: 'min',
    description: 'Returns the element of the array with the lowest value.',
    sugar_compatibility: 2,
    sugar_notes: 'Array#min exists in Sugar and additionally has the ability to return all the minimum values, as more than one may exist. Sugar also returns the actual array element instead of the return value of the iterator. Sugar also does not allow a context parameter, use Function#bind instead.',
    live_notes: 'Use caution when using Enumerable#min:  (1) Sugar will return an array of minimum values (as there can be more than one), where Prototype only returns the first value. (2) When using iterators, Prototype will return the value compared, where Sugar will return the actual array element itself. (3) Finally, Sugar does not allow a context to be passed.',
    original_code: "[{ a: 5 },{ a: 10 }].min(function(el){ return el['a']; }, 'context')",
    sugar_code: "[{ a: 5 },{ a: 10 }].min(function(el){ return el['a']; }.bind('context')).first().a",
    ref: 'Array/min'
  },
  {
    name: 'partition',
    description: 'Partitions the array into two groups, one for which the iterator passed returns true, and one for which the iterator returns false.',
    sugar_compatibility: 3,
    sugar_notes: "Enumerable#partition does not exist in Sugar. Array#groupBy however has similar functionality, and may be a suitable alternative. It will create a hash with keys based on the return values of the iterator, with each grouping as the value. Instead of accessing the split array, you can access the hash by these keys. This method has the added advantage that it can also split into more than two groups.",
    original_code: "[1,2,3,4,5,6].partition(function(n){ return n % 2 === 0; })",
    sugar_code: "[1,2,3,4,5,6].group(function(n){ return n % 2 === 0 ? 'even' : 'odd'; })",
    ref: 'Array/groupBy'
  },
  {
    name: 'pluck',
    description: 'Returns a mapped array of the same property of each element in the array.',
    sugar_compatibility: 2,
    sugar_notes: 'Sugar allows a string shortcut to Array#map, making it effectively identical to Enumerable#pluck.',
    original_code: "['hello','world'].pluck('length')",
    sugar_code: "['hello','world'].map('length')",
    ref: 'Array/map'
  },
  {
    name: 'reject',
    description: 'Returns all elements for which the iterator returns a falsy value.',
    sugar_compatibility: 3,
    sugar_notes: "Enumerable#reject does not exist in Sugar. Its equivalent is Array#exclude. This is a non-destructive way to remove elements from an array. If you want a destructive version, use Array#remove instead. Also note these methods' reciprocals: Array#include and Array#add.",
    original_code: "[1,2,3].reject(function(n){ n < 3; })",
    sugar_code: "[1,2,3].exclude(function(n){ n < 3; })",
    ref: 'Array/exclude'
  },
  {
    name: 'select',
    description: 'Returns all elements for which the iterator returns a truthy value. Alias of Enumerable#findAll.',
    sugar_compatibility: 3,
    sugar_notes: 'Enumerable#select exists in Sugar as Array#findAll.',
    original_code: "[1,2,3].select(function(n){ n < 3; })",
    sugar_code: "[1,2,3].findAll(function(n){ n < 3; })",
    ref: 'Array/findAll'
  },
  {
    name: 'sortBy',
    description: 'Returns an array sorted on the value returned by the iterator.',
    sugar_compatibility: 3,
    sugar_notes: 'Array#sortBy in Sugar additionally allows a flag for descending order and also has a mechanism for intelligent alphanumeric sorting of string properties. For binding of context, use Function#bind instead.',
    conflict: function(f, scope) {
      var type = typeof arguments[1];
      return [arguments.length > 1 && type != 'boolean', arguments[1]];
    },
    live_notes: 'Second argument to .sortBy should be a boolean but instead was {1}. If you need to bind context, use Function#bind instead.',
    original_code: "[{ a: 5 },{ a: 10 }].sortBy(function(el){ return el['a']; })",
    sugar_code: "[{ a: 5 },{ a: 10 }].sortBy(function(el){ return el['a']; }.bind('context'))",
    ref: 'Function/bind'
  },
  {
    name: 'size',
    description: 'Returns the length of the array.',
    sugar_compatibility: 2,
    sugar_notes: 'Enumerable#size does not exist in Sugar. Just use array.length!',
    original_code: "[1,2,3].size()",
    sugar_code: "[1,2,3].length"
  },
  {
    name: 'toArray',
    description: 'Returns a clone of the array.',
    sugar_compatibility: 2,
    sugar_notes: 'Enumerable#toArray does not exist in Sugar. Use Array#clone instead.',
    original_code: "[1,2,3].toArray()",
    sugar_code: "[1,2,3].clone()",
    ref: 'Array/clone'
  },
  {
    name: 'zip',
    description: '"zips" together multiple arrays into a single multi-dimensional array.',
    sugar_compatibility: 2,
    sugar_notes: 'Enumerable#zip exists in Sugar and is identical.',
    original_code: "firstNames.zip(lastNames)",
    sugar_code: "firstNames.zip(lastNames)",
    ref: 'Array/zip'
  },
  {
    name: 'compact',
    description: 'Returns a copy of the array with all undefined and null values removed.',
    sugar_compatibility: 3,
    sugar_notes: 'Array#compact exists and is nearly identical except that it will also remove any values which are NaN from the array as well. It additionally has a flag to remove all falsy values.',
    conflict: function() {
      for(var i = 0; i < this.length; i++){
        if(isNaN(this[i])) return true;
      }
      return false;
    },
    live_notes: 'Caution: Array#compact was called on an array that contains NaN values. Sugar will remove these from the array while Prototype leaves them alone.',
    ref: 'Array/compact'
  },
  {
    name: 'clear',
    description: 'Removes all elements from the array.',
    sugar_compatibility: 0,
    sugar_notes: 'Array#clear does not exist in Sugar. Use array.length = 0 or simply set array = [] instead.',
    original_code: "f.clear()",
    sugar_code: "f = []"
  },
  {
    name: 'inspect',
    description: 'Returns a debug-oriented string representing the array.',
    sugar_compatibility: 0,
    sugar_notes: 'Array#inspect does not exist in Sugar. Consider using JSON.stringify(array) instead. The JSON global does not exist in all implementations but should be enough to get you through a debug session.',
    original_code: "[1,2,3].inspect()",
    sugar_code: "JSON.stringify([1,2,3])"
  },
  {
    name: 'reverse',
    description: 'Reverses the arrays contents.',
    sugar_compatibility: 2,
    conflict: function(inline) {
      return inline === false;
    },
    sugar_notes: 'Array#reverse exists in native Javascript, but is destructive. For a non-destructive version use Array#clone first.',
    original_code: "array.reverse(false)",
    sugar_code: "array.clone().reverse()",
    ref: 'Array.clone'
  },
  {
    name: 'uniq',
    description: 'Returns a new array without duplicates.',
    sugar_compatibility: 3,
    sugar_notes: 'Array#uniq exists in Sugar as Array#unique and can also operate on arrays of objects. Additionally it accepts a mapping function to indicate the field to uniquify on.',
    original_code: "[1,1,1].uniq()",
    sugar_code: "[1,1,1].unique()",
    ref: 'Array/unique'
  },
  {
    name: 'without',
    description: 'Creates a new array that does not contain the specified values.',
    sugar_compatibility: 3,
    sugar_notes: 'Array#without exists in Sugar as Array#exclude.',
    original_code: "[1,2,3].without(3)",
    sugar_code: "[1,2,3].exclude(3)",
    ref: 'Array/exclude'
  },
  {
    name: 'indexOf',
    description: 'Returns the index of the first occurence of the item in the array.',
    sugar_compatibility: 2,
    sugar_notes: 'Array#indexOf exists natively in modern browsing engines. Sugar provides this method when it is not supported.',
    conflict: false,
    ref: 'Array/indexOf'
  },
  {
    name: 'lastIndexOf',
    description: 'Returns the index of the last occurence of the item in the array.',
    sugar_compatibility: 2,
    sugar_notes: 'Array#lastIndexOf exists natively in modern browsing engines. Sugar provides this method when it is not supported.',
    conflict: false,
    ref: 'Array/lastIndexOf'
  },
  {
    name: 'all',
    description: 'Returns true if the passed iterator returns a truthy value for all elements in the array.',
    sugar_compatibility: 3,
    sugar_notes: 'Array#all exists in Sugar as an alias to native Array#every (for which it adds a shim for browsers without support), and is identical.',
    conflict: false,
    ref: 'Array/all'
  },
  {
    name: 'any',
    description: 'Returns true if the passed iterator returns a truthy value for any elements in the array.',
    sugar_compatibility: 2,
    sugar_notes: 'Array#any exists in Sugar as an alias to native Array#some (for which it adds a shim for browsers without support).',
    conflict: false,
    ref: 'Array/any'
  },
  {
    name: 'map',
    description: 'Returns the result of applying an iterator to the array. Alias of Enumerable#collect.',
    sugar_compatibility: 2,
    sugar_notes: 'Array#map exists natively in modern browsing engines. Sugar provides this method when it is not supported, and additionally augments it to handle string shortcuts.',
    conflict: false,
    ref: 'Array/map'
  },
  {
    name: 'every',
    description: 'Returns true if the passed iterator returns a truthy value for all elements in the array.',
    sugar_compatibility: 3,
    sugar_notes: 'Array#every exists natively in modern browsing engines. Sugar provides this method when it is not supported, and additionally augments it to handle strings, numbers, regexes, and deep objects.',
    conflict: false,
    ref: 'Array/every'
  },
  {
    name: 'filter',
    description: 'Returns all elements for which the iterator returns a truthy value.',
    sugar_compatibility: 3,
    sugar_notes: 'Array#filter exists natively in modern browsing engines. Sugar provides this method when it is not supported, and additionally augments it to handle strings, numbers, regexes, and deep objects.',
    conflict: false,
    ref: 'Array/filter'
  },
  {
    name: 'some',
    description: 'Returns true if the passed iterator returns a truthy value for any elements in the array.',
    sugar_compatibility: 3,
    sugar_notes: 'Array#some exists natively in modern browsing engines. Sugar provides this method when it is not supported, and additionally augments it to handle strings, numbers, regexes, and deep objects.',
    conflict: false,
    ref: 'Array/some'
  },
  {
    name: 'inGroupsOf',
    description: 'Splits the array into groups of n elements, where n is the number passed.',
    sugar_compatibility: 2,
    sugar_notes: 'Array#inGroupsOf exists in Sugar and is identical.',
    conflict: false,
    ref: 'Array/inGroupsOf'
  },
  {
    name: 'clone',
    description: 'Returns a copy of the array.',
    sugar_compatibility: 2,
    sugar_notes: 'Array#clone exists in Sugar and is identical.',
    conflict: false,
    ref: 'Array/clone'
  },
  {
    name: 'first',
    description: 'Returns the first element in the array.',
    sugar_compatibility: 3,
    sugar_notes: 'Array#first exists in Sugar, and can additionally get the first n elements.',
    conflict: false,
    ref: 'Array/first'
  },
  {
    name: 'last',
    description: 'Returns the last element in the array.',
    sugar_compatibility: 3,
    sugar_notes: 'Array#last exists in Sugar, and can additionally get the last n elements.',
    conflict: false,
    ref: 'Array/last'
  },
  {
    name: 'flatten',
    description: 'Returns a one-dimensional copy of the array.',
    sugar_compatibility: 3,
    sugar_notes: 'Array#flatten exists in Sugar, and can additionally flatten an array to any level.',
    conflict: false,
    ref: 'Array/flatten'
  },
  {
    name: 'intersect',
    description: 'Returns an array containing every item that that is shared between the passed arrays.',
    sugar_compatibility: 3,
    sugar_notes: 'Array#intersect exists in Sugar, and can additionally get the intersection of any number of arrays passed in.',
    conflict: false,
    ref: 'Array/intersect'
  }
  ]
},
{
  namespace: 'Function',
  type: 'instance',
  methods: [
    {
    name: 'bind',
    description: 'Binds the function to the given context.',
    sugar_compatibility: 2,
    sugar_notes: 'Function#bind exists natively in modern browsing engines. Sugar provides this method when it is not supported.',
    conflict: false,
    ref: 'Function/bind'
  },
  {
    name: 'argumentNames',
    description: 'Returns an array of the argument names as stated in the function definition.',
    sugar_compatibility: 0,
    sugar_notes: 'Function#argumentNames does not exist in Sugar.'

  },
  {
    name: 'bindAsEventListener',
    description: 'An event specific version Function#bind. Will allow an event object to be passed as the first argument to the bound function.',
    sugar_compatibility: 0,
    sugar_notes: 'Function#bindAsEventListener does not exist in Sugar, but can be easily approximated with an undefined space for the event in the arguments using Function#fill. Keep in mind, however, that this is only necessary if you are also currying arguments as well. If you are just trying to bind context, then Function#bind alone is enough.',
    original_code: "(function(event, one) { this == \"bound\", one == 1; }).bindAsEventListener('bound', 1) ",
    sugar_code: "(function(event, one) { this == \"bound\", one == 1; }).fill('bound', undefined, 1)",
    ref: 'Function/bind'
  },
  {
    name: 'curry',
    description: 'Burns-in arguments to a function and returns a new function.',
    sugar_compatibility: 3,
    sugar_notes: 'Function#curry exists in Sugar as Function#fill. When passing undefined to Function#fill it will additionally serve as a placeholder where arguments to the original function will be allowed in.',
    original_code: "fn.curry('one','two')",
    sugar_code: "fn.fill('one', 'two')",
    ref: 'Function/fill'
  },
  {
    name: 'defer',
    description: 'Schedules the function to run as soon as the interpreter is idle.',
    sugar_compatibility: 2,
    sugar_notes: 'Function#defer exists in Sugar as Function#delay. When no params are passed it will behave precisely the same as calling the function with a timeout of 1 ms (as with defer).',
    original_code: "fn.defer()",
    sugar_code: "fn.delay()",
    ref: 'Function/delay'
  },
  {
    name: 'delay',
    description: 'Schedules the function to run after a specified amount of time.',
    sugar_compatibility: 1,
    sugar_notes: 'Function#delay exists in Sugar, but is slightly different. First, the delay is passed in milliseconds, not seconds. Second, delay will return a reference to the function instead of an integer to clear the timeout. If you need to cancel the timeout, instead use Function#cancel. Arguments passed after the timeout are still curried like Prototype.',
    original_code: "var t = fn.delay(2) clearTimeout(t) ",
    sugar_code: "fn.delay(2000) fn.cancel()",
    ref: 'Function/delay'
  },
  {
    name: 'methodize',
    description: 'Wraps the function inside another function that pushes the object it is called on as the first argument.',
    sugar_compatibility: 0,
    sugar_notes: 'Function#methodize does not exist in Sugar. No direct equivalent exists, but in a pinch the following code will achieve the same effect.',
    original_code: "obj.method = fn.methodize()",
    sugar_code: "obj.method = function(){ fn.apply(null, [this].concat(Array.prototype.slice.call(arguments))); }"
  },
  {
    name: 'wrap',
    description: 'Returns a function wrapped around the original function.',
    sugar_compatibility: 0,
    sugar_notes: 'Function#wrap does not exist in Sugar. No direct equivalent exists, but Function#bind can be used to achieve the same effect in a pinch.',
    original_code: "fn = fn.wrap(function(original){ return original() + 3; })",
    sugar_code: "fn = (function(original){ return original() + 3; }).bind(null, fn);"
  }
  ]
},
{
  namespace: 'Date',
  type: 'instance',
  methods: [
    {
    name: 'toISOString',
    description: 'Returns an ISO8601 representation of the date.',
    sugar_compatibility: 2,
    sugar_notes: 'Date#toISOString exists natively in modern browsing engines. Sugar provides this method when it is not supported.',
    conflict: false,
    ref: 'Date/toISOString'
  },
  {
    name: 'toJSON',
    description: 'Returns an ISO8601 representation of the date, identical to Date#toISOString.',
    sugar_compatibility: 2,
    sugar_notes: 'Date#toJSON exists natively in modern browsing engines. Sugar provides this method when it is not supported.',
    conflict: false,
    ref: 'Date/toJSON'
  }
  ]
}
];

