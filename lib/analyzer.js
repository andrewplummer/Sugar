(function(context) {


  // BEGIN LIBS
//  Compatiblity index:
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


//  Compatiblity index:
//
//  0 - Does not exist.
//  1 - Exists but does not support all functionality.
//  2 - Exists and supports all functionality.
//  3 - Exists and supports all functionality plus more.

var SugarUnderscoreMethods = [
  {
  type: 'class',
  namespace: '_',
  methods: [
    {
    name: 'each',
    description: 'Iterates over an enumerable collection.',
    sugar_compatibility: 3,
    sugar_notes: '_.each exists natively on arrays in modern browsing engines as Array#forEach. Sugar provides this method when it is not supported. It also provides Array#each, which can break out of the loop, start from a given index, loop from the beginning, and intelligently handle sparse arrays. Sugar also provides Object.each for iterating over objects.',
    original_code: '_.each([1,2,3], function(element, index, array){})',
    sugar_code: '[1,2,3].forEach(function(element, index, array){})',
    ref: 'Array/each'
  },
  {
    name: 'map',
    description: 'Creates a new array by using the return value of a mapping function on each element.',
    sugar_compatibility: 3,
    sugar_notes: '_.map exists natively in modern browsing engines as Array#map. Sugar provides this method when it is not supported, and additionally augments it to allow passing a string as a shortcut.',
    original_code: '_.map([1,2,3], function(a){ return a * 2; })',
    sugar_code: '[1,2,3].map(function(a){ return a * 2; })',
    ref: 'Array/map'
  },
  {
    name: 'reduce',
    description: 'Boils down a list of values to a single value, optionally with a starting value.',
    sugar_compatibility: 2,
    sugar_notes: '_.reduce exists natively in modern browsing engines as Array#reduce. Sugar provides this method when it is not supported.',
    original_code: '_.reduce([1,2,3], function(m, a){ return m + a; })',
    sugar_code: '[1,2,3].reduce(function(m, a){ return m + a; })',
    ref: 'Array/reduce'
  },
  {
    name: 'reduceRight',
    description: 'Boils down a list of values to a single value starting from the last entry (the right), optionally with a starting value.',
    sugar_compatibility: 2,
    sugar_notes: '_.reduceRight exists natively in modern browsing engines as Array#reduceRight. Sugar provides this method when it is not supported.',
    original_code: '_.reduceRight([1,2,3], function(m, a){ return m + a; })',
    sugar_code: '[1,2,3].reduceRight(function(m, a){ return m + a; })',
    ref: 'Array/reduceRight'
  },
  {
    name: 'find',
    description: 'Finds the first value in the list for which the iterator returns true.',
    sugar_compatibility: 3,
    sugar_notes: '_.find exists in Sugar as Array#find, and additionally allows searching on primitives, deep objects, and testing against regexes.',
    original_code: '_.find([1,2,3], function(a){ return a == 1; })',
    sugar_code: '[1,2,3].find(1)',
    bind_context: true,
    ref: 'Array/find'
  },
  {
    name: 'filter',
    description: 'Finds all values in the list for which the iterator returns true.',
    sugar_compatibility: 3,
    sugar_notes: '_.filter exists natively in modern browsing engines as Array#filter. Sugar provides this method when it is not supported, and additionally augments it to allow search on primitives, deep objects, or against a regex. Sugar also provides Array#findAll which can start from a given index, loop from the beginning, and intelligently handles sparse arrays.',
    original_code: '_.filter([1,2,3], function(a){ return a % 2 == 0; })',
    sugar_code: '[1,2,3].reduceRight(function(a){ return a % 2 == 0; })',
    ref: 'Array/filter'
  },
  {
    name: 'reject',
    description: 'Returns all elements in the list for which the iterator does not return true. Opposite of filter.',
    sugar_compatibility: 3,
    sugar_notes: '_.reject exists in Sugar as Array#exclude. It additionally allows searching on primitives, deep objects, or against a regex. This method is non-destructive with a destructive reciprocal method: Array#remove.',
    original_code: '_.reject([1,2,3,4,5,6], function(a){ return a % 2 == 0; })',
    sugar_code: '[1,2,3,4,5,6].exclude(function(a){ return a % 2 == 0; })',
    ref: 'Array/exclude'
  },
  {
    name: 'all',
    description: 'Returns true if the iterator returns true for all elements in the list, false otherwise.',
    sugar_compatibility: 3,
    sugar_notes: '_.all exists natively in modern browsing engines as Array#every. Sugar provides this method when it is not supported, and addtionally augments it to search on primitives, deep objects, or against a regex. Sugar also has its own alias Array#all.',
    original_code: '_.all([1,2,3], function(a){ return a == 2; })',
    sugar_code: '[1,2,3].all(function(a){ return a % 2 == 0; })',
    ref: 'Array/all'
  },
  {
    name: 'any',
    description: 'Returns true if the iterator returns true for any elements in the list, false otherwise.',
    sugar_compatibility: 3,
    sugar_notes: '_.any exists natively in modern browsing engines as Array#some. Sugar provides this method when it is not supported, and addtionally augments it to search on primitives, deep objects, or against a regex. Sugar also has its own alias Array#any.',
    original_code: '_.any([1,2,3], function(a){ return a % 2 == 0; })',
    sugar_code: '[1,2,3].any(function(a){ return a % 2 == 0; })',
    ref: 'Array/any'
  },
  {
    name: 'include',
    description: 'Returns true if the value is present in the list.',
    sugar_compatibility: 3,
    sugar_notes: '_.include exists in Sugar as browser native Array#some, which it augments to search on primitive types, deep objects, or against regexes. Sugar also has its own alias Array#any, which has identical functionality.',
    original_code: '_.include([1,2,3], 3)',
    sugar_code: '[1,2,3].any(3)',
    ref: 'Array/any'
  },
  {
    name: 'invoke',
    description: 'Calls the passed method name for each value in the list.',
    sugar_compatibility: 2,
    sugar_notes: '_.invoke does not exist in Sugar. In most cases, invoking functions through standard methods is more readable. Array#map effectively provides an alias for this, however.',
    original_code: "_.invoke([5,1,7],[3,2,1], 'sort')",
    sugar_code: "[[5,1,7],[3,2,1]].map('sort')",
    ref: 'Array/map'
  },
  {
    name: 'pluck',
    description: 'Returns the property for each value in the list.',
    sugar_compatibility: 2,
    sugar_notes: '_.pluck exists in Sugar as browser native Array#map, which it augments to accept a string as a shortcut.',
    original_code: "_.pluck([{name:'moe'},{name:'larry'},{name:'curly'}], 'name')",
    sugar_code: "[{name:'moe'},{name:'larry'},{name:'curly'}].map('name')",
    ref: 'Array/map'
  },
  {
    name: 'max',
    description: 'Returns the maximum value in the list.',
    sugar_compatibility: 2,
    sugar_notes: '_.max exists in Sugar as Array#max, and can additionally return an array when more than one max values exist.',
    original_code: '_.max([1,2,3])',
    sugar_code: '[1,2,3].max()',
    ref: 'Array/max'
  },
  {
    name: 'min',
    description: 'Returns the minimum value in the list.',
    sugar_compatibility: 2,
    sugar_notes: '_.min exists in Sugar as Array#min, and can additionally return an array when more than one max values exist.',
    original_code: '_.min([1,2,3])',
    sugar_code: '[1,2,3].min()',
    ref: 'Array/min'
  },
  {
    name: 'sortBy',
    description: 'Returns a copy of the list sorted by the result of the iterator.',
    sugar_compatibility: 2,
    sugar_notes: '_.sortBy exists in Sugar as Array#sortBy. In addition to an iterating function, it will also accept a string as a shortcut to the property to sort by.',
    original_code: '_.sortBy([1,2,3], Math.sin)',
    sugar_code: '[1,2,3].sortBy(Math.sin)',
    ref: 'Array/sortBy'
  },
  {
    name: 'groupBy',
    description: 'Splits a collection into sets, grouping them by the result of running each value through the iterator.',
    sugar_compatibility: 3,
    sugar_notes: '_.groupBy exists in Sugar as Array#groupBy. It allows passing a string as a shortcut to a property and additionally allows an optional callback to be called for each group.',
    original_code: '_.groupBy([1,2,3,4], function(n){ return n > 2; })',
    sugar_code: '[1,2,3,4].groupBy(function(n){ return n > 2; })',
    ref: 'Array/groupBy'
  },
  {
    name: 'sortedIndex',
    description: 'Determine the index at which the value should be inserted into the list in order to maintain the sorted order.',
    sugar_compatibility: 0,
    sugar_notes: '_.sortedIndex does not exist in Sugar. Clever use of Array#reduce can achieve something similar, depending on the case.',
    original_code: '_.sortedIndex([1,2,3,5], 4)',
    sugar_code: '[1,2,3,5].reduce(function(a, b, i){ if(b > 4) return i - 1; })',
    ref: 'Array/reduce'
  },
  {
    name: 'shuffle',
    description: 'Returns a randomized copy of the list.',
    sugar_compatibility: 2,
    sugar_notes: '_.shuffle exists in Sugar as Array#randomize. Sugar also uses a Fisher-Yates algorithm.',
    original_code: '_.shuffle([1,2,3,4])',
    sugar_code: '[1,2,3,4].randomize()',
    ref: 'Array/randomize'
  },
  {
    name: 'toArray',
    description: 'Converts any enumerable object into an array.',
    sugar_compatibility: 3,
    sugar_notes: '_.toArray exists in Sugar as Array.create, which can accept multiple arguments.',
    original_code: '_.toArray(arguments)',
    sugar_code: 'Array.create(arguments)',
    ref: 'Array/create'
  },
  {
    name: 'size',
    description: 'Returns the number of values in the list.',
    sugar_compatibility: 0,
    sugar_notes: "_.size does not exist in Sugar. If you need to know the \"size\" of a hash, you can get the length of Object.keys, although in that case it's likely that you should be using an array in any case.",
    original_code: '_.size(obj)',
    sugar_code: 'Object.keys(obj).length',
    ref: 'Object/keys'
  },
  {
    name: 'first',
    description: 'Returns the first element(s) of the array.',
    sugar_compatibility: 2,
    sugar_notes: '_.first exists in Sugar as Array#first, and is identical.',
    original_code: '_.first([1,2,3])',
    sugar_code: '[1,2,3].first()',
    ref: 'Array/first'
  },
  {
    name: 'initial',
    description: 'Returns all but the last n entries of the array.',
    sugar_compatibility: 2,
    sugar_notes: '_.initial does not exist in Sugar. Use a negative value for Array#to for the same effect.',
    original_code: '_.initial([1,2,3], 2)',
    sugar_code: '[1,2,3].to(-2)',
    ref: 'Array/to'
  },
  {
    name: 'last',
    description: 'Returns the last n entries of the array.',
    sugar_compatibility: 2,
    sugar_notes: '_.last exists in Sugar as Array#last, and is identical.',
    original_code: '_.last([1,2,3])',
    sugar_code: '[1,2,3].last()',
    ref: 'Array/last'
  },
  {
    name: 'rest',
    description: 'Returns the rest of the entries from a given index.',
    sugar_compatibility: 2,
    sugar_notes: '_.rest exists in Sugar as Array#from.',
    original_code: '_.rest([1,2,3], 2)',
    sugar_code: '[1,2,3].from(2)',
    ref: 'Array/from'
  },
  {
    name: 'compact',
    description: 'Returns a copy of the array with all falsy values removed.',
    sugar_compatibility: 3,
    sugar_notes: '_.compact exists in Sugar as Array#compact. Note that only undefined, null, and NaN are removed by default. To remove all falsy values, pass true as the first argument.',
    original_code: '_.compact([1,0,3,null])',
    sugar_code: '[1,0,3,null].compact(true)',
    ref: 'Array/compact'
  },
  {
    name: 'flatten',
    description: 'Flattens a nested array.',
    sugar_compatibility: 3,
    sugar_notes: '_.flatten exists in Sugar as Array#flatten. Sugar can additionally flatten to any level of depth, specified in the first argument (all levels by default).',
    original_code: '_.flatten([1,[2,3]])',
    sugar_code: '[1,[2,3]].flatten()',
    ref: 'Array/flatten'
  },
  {
    name: 'without',
    description: 'Returns a copy of the array with all instances of the values passed removed.',
    sugar_compatibility: 3,
    sugar_notes: '_.without exists in Sugar as Array#exclude, and is identical.',
    original_code: '_.without([1,2,3], 1)',
    sugar_code: '[1,2,3].exclude(1)',
    ref: 'Array/exclude'
  },
  {
    name: 'union',
    description: 'Computes the union of the arrays, or the unique items present in all arrays.',
    sugar_compatibility: 2,
    sugar_notes: '_.union exists in Sugar as Array#union, and is identical.',
    original_code: '_.union([1,2,3], [3,4,5])',
    sugar_code: '[1,2,3].union([3,4,5])',
    ref: 'Array/union'
  },
  {
    name: 'intersection',
    description: 'Computes the intersection of the arrays, or the values that are common to all arrays.',
    sugar_compatibility: 2,
    sugar_notes: '_.intersection exists in Sugar as Array#intersect, and is identical.',
    original_code: '_.intersect([1,2,3], [3,4,5])',
    sugar_code: '[1,2,3].intersect([3,4,5])',
    ref: 'Array/intersect'
  },
  {
    name: 'difference',
    description: 'Returns the values in the array that are not present in the others.',
    sugar_compatibility: 2,
    sugar_notes: '_.difference exists in Sugar as Array#subtract, which can subtract an indefinite number of arrays.',
    original_code: '_.difference([1,2,3], [3,4,5])',
    sugar_code: '[1,2,3].subtract([3,4,5])',
    ref: 'Array/subtract'
  },
  {
    name: 'uniq',
    description: 'Returns a duplicate-free version of the array.',
    sugar_compatibility: 3,
    sugar_notes: '_.uniq exists in Sugar as Array#unique. In addition to accepting a function to transform (map) the property on which to unique, Sugar will also accept a string that is a shortcut to this function. This would most commonly be the unique key of a JSON object, etc.',
    original_code: '_.uniq([1,2,1,3,1,4])',
    sugar_code: '[1,2,1,3,1,4].unique()',
    ref: 'Array/unique'
  },
  {
    name: 'zip',
    description: 'Merges together multiple arrays, creating a multi-dimensional array as the result.',
    sugar_compatibility: 2,
    sugar_notes: '_.zip exists in Sugar as Array#zip and is identical.',
    original_code: '_.zip(arr1, arr2)',
    sugar_code: 'arr1.zip(arr2)',
    ref: 'Array/zip'
  },
  {
    name: 'indexOf',
    description: 'Returns the index of the first value that matches in the array or -1 if not present.',
    sugar_compatibility: 2,
    sugar_notes: '_.indexOf exists natively in modern browsing engines as Array#indexOf. Sugar provides this method when it is not supported. Sugar also provides Array#findIndex for more complex index finding operations.',
    original_code: '_.indexOf([1,2,3], 1)',
    sugar_code: '[1,2,3].indexOf(1)',
    ref: 'Array/indexOf'
  },
  {
    name: 'lastIndexOf',
    description: 'Returns the index of the last value that matches in the array or -1 if not present.',
    sugar_compatibility: 2,
    sugar_notes: '_.lastIndexOf exists natively in modern browsing engines as Array#lastIndexOf. Sugar provides this method when it is not supported. Sugar also provides Array#findIndex for more complex index finding operations.',
    original_code: '_.lastIndexOf([1,2,3], 1)',
    sugar_code: '[1,2,3].lastIndexOf(1)',
    ref: 'Array/lastIndexOf'
  },
  {
    name: 'range',
    description: 'Shortcut to quickly create lists of integers.',
    sugar_compatibility: 3,
    sugar_notes: 'Ranges exist in Sugar and are created with Number.range. They can then be iterated over with the method "every".',
    original_code: '_.range(0, 30, 5)',
    sugar_code: 'Number.range(0, 30)',
    ref: 'Number/upto'
  },
  {
    name: 'bind',
    description: 'Binds an object to a function, making that object its "this" argument when called.',
    sugar_compatibility: 2,
    sugar_notes: '_.bind exists natively in modern browsing engines as Function#bind. Sugar provides this method when it is not supported.',
    original_code: '_.bind(fn, obj, 1)',
    sugar_code: 'fn.bind(obj, 1)',
    ref: 'Function/bind'
  },
  {
    name: 'bindAll',
    description: 'Binds a number of methods on the object.',
    sugar_compatibility: 0,
    sugar_notes: '_.bindAll does not exist in Sugar. However, the same functionality can be achieved through a workaround.',
    original_code: '_.bindAll(obj)',
    sugar_code: 'Object.each(obj, function(key, val){ if(Object.isFunction(val)) obj[key] = val.bind(obj); })',
    ref: 'Function/bind'
  },
  {
    name: 'memoize',
    description: 'Memoizes a given function by caching the computed result. Useful for speeding up slow-running computations.',
    sugar_compatibility: 1,
    sugar_notes: '_.memoize exists in Sugar as Function#once. It does not have the optional [hashFunction] parameter.',
    original_code: '_.memoize(fn)',
    sugar_code: 'fn.once()',
    ref: 'Function/once'
  },
  {
    name: 'delay',
    description: 'Invokes the function after n milliseconds.',
    sugar_compatibility: 2,
    sugar_notes: '_.delay exists in Sugar as Function#delay, and is identical.',
    original_code: '_.delay(fn, 1000, 1)',
    sugar_code: 'fn.delay(1000, 1)',
    ref: 'Function/delay'
  },
  {
    name: 'defer',
    description: 'Invokes the function after the current stack has cleared.',
    sugar_compatibility: 2,
    sugar_notes: '_.defer exists in Sugar as Function#delay, called with no arguments.',
    original_code: '_.defer(fn)',
    sugar_code: 'fn.delay()',
    ref: 'Function/delay'
  },
  {
    name: 'throttle',
    description: 'Creates a throttled version of the function that when invoked will only call the function at most once per n milliseconds. Useful for rate-limiting events.',
    sugar_compatibility: 3,
    sugar_notes: '_.throttle exists in Sugar as Function#throttle. In addition, Function#lazy has other options like accepting an upper limit to the queue of functions waiting to execute or execute the first time immediately.',
    original_code: '_.throttle(fn, 100)',
    sugar_code: 'fn.throttle(100)',
    ref: 'Function/lazy'
  },
  {
    name: 'debounce',
    description: 'Returns a "debounced" version of the function that will only execute once after n milliseconds have passed.',
    sugar_compatibility: 3,
    sugar_notes: '_.debounce exists in Sugar as Function#debounce.',
    original_code: '_.debounce(fn, 100)',
    sugar_code: 'fn.debounce(100)',
    ref: 'Function/debounce'
  },
  {
    name: 'once',
    description: 'Returns a version of the function that will return the value of the original call if called repeated times.',
    sugar_compatibility: 2,
    sugar_notes: '_.once exists in Sugar as Function#once. In Sugar it is identical to the functionality of _.memoize.',
    original_code: '_.once(fn)',
    sugar_code: 'fn.once()',
    ref: 'Function/once'
  },
  {
    name: 'after',
    description: 'Returns a version of the function that will only be run after being called n times.',
    sugar_compatibility: 2,
    sugar_notes: '_.after exists in Sugar as Function#after. The final callback will be passed an array of all argument objects collected (converted to proper arrays).',
    original_code: '_.after(5, fn)',
    sugar_code: 'fn.after(5)',
    ref: 'Function/after'
  },
  {
    name: 'wrap',
    description: 'Wraps the first function inside of the wrapper function, passing it as the first argument.',
    sugar_compatibility: 0,
    sugar_notes: '_.wrap does not exist in Sugar. However, Function#bind can be used to achieve the same effect in a pinch.',
    original_code: "_.wrap(fn, function(fn){ return fn() + 3; })",
    sugar_code: "(function(fn){ return fn() + 3; }).bind(null, fn)",
    ref: 'Function/bind'
  },
  {
    name: 'compose',
    description: 'Returns the composition of a list of functions.',
    sugar_compatibility: 0,
    sugar_notes: '_.compose does not exist in Sugar. However, Function#bind can help to achieve the same effect in a pinch.',
    original_code: "_.compose(fn1, fn2, *)",
    sugar_code: "Array.prototype.compose = function(){ var i = 0, fn; while(i < arguments.length){ fn = (function(){ return this.apply(this, arguments); }).bind(arguments[i]); i++;  } return fn; } fn1.compose(fn2)",
    ref: 'Function/bind'
  },
  {
    name: 'keys',
    description: "Retrieves all the names of an object's properties.",
    sugar_compatibility: 3,
    sugar_notes: '_.keys exists natively in modern browsing engines as Object.keys. Sugar provides this method when it is not supported, and additionally allows a callback to be run against each key. Sugar can also create extended objects which have this method available as an instance method.',
    original_code: '_.keys(obj)',
    sugar_code: 'Object.keys(obj)',
    ref: 'Object/keys'
  },
  {
    name: 'values',
    description: "Retrieves all the values of an object's properties.",
    sugar_compatibility: 3,
    sugar_notes: '_.values exists in Sugar as Object.values, which can also accept a callback. Sugar can also create extended objects which have this method available as an instance method.',
    original_code: '_.values(obj)',
    sugar_code: 'Object.values(obj)',
    ref: 'Object/values'
  },
  {
    name: 'functions',
    description: 'Returns a sorted list of every method in the object.',
    sugar_compatibility: 0,
    sugar_notes: '_.functions does not exist in Sugar. However, Sugar makes it easy to reproduce the result.',
    original_code: '_.functions(obj)',
    sugar_code: 'Object.keys(obj).filter(function(key){ return Object.isFunction(obj[key]); })'
  },
  {
    name: 'extend',
    description: 'Copies all of the properties of the source object to the destination.',
    sugar_compatibility: 3,
    sugar_notes: "_.extend exists in Sugar as Object.merge. In the place of the ability to merge an unlimited number of objects, Sugar instead includes a parameter to determine how property conflicts should be resolved. However, extended objects can chain for the same effect.",
    original_code: '_.extend(obj1, obj2, obj3)',
    sugar_code: 'Object.extended(obj1).merge(obj2).merge(obj3)',
    ref: 'Object/merge'
  },
  {
    name: 'defaults',
    description: 'Fills in missing properties in the object with default values.',
    sugar_compatibility: 3,
    sugar_notes: "_.defaults can be achieved in Sugar by passing false as the last argument to Object.merge. This will indicate that conflicts should preserve the target object's properties. The third parameter is to indicate a shallow merge.",
    original_code: '_.defaults(obj, defaultProperties)',
    sugar_code: 'Object.merge(obj, defaultProperties, false, false)',
    ref: 'Object/merge'
  },
  {
    name: 'clone',
    description: 'Creates a shallow clone of the object.',
    sugar_compatibility: 3,
    sugar_notes: '_.clone exists in Sugar as Object.clone. Cloning is shallow by default but there is an option for deep cloning as well.',
    original_code: '_.clone(obj)',
    sugar_code: 'Object.clone(obj)',
    ref: 'Object/clone'
  },
  {
    name: 'tap',
    description: 'Invokes interceptor with the object, and then returns object. The primary purpose of this method is to "tap into" a method chain, in order to perform operations on intermediate results within the chain.',
    sugar_compatibility: 2,
    sugar_notes: '_.tap exists in Sugar as Object.tap. This method is mostly only useful when using extended objects or modifying the Object.prototype with Object.extend().',
    original_code: '_.tap(obj)',
    sugar_code: 'Object.tap(obj)',
    ref: 'Object/tap'
  },
  {
    name: 'isEqual',
    description: 'Performs a deep comparison between two objects to determine if they are equal.',
    sugar_compatibility: 2,
    sugar_notes: '_.isEqual exists in Sugar as Object.equal. Note also that in its instance method form the naming changes to "equals" for better readability.',
    original_code: '_.isEqual(obj1, obj2)',
    sugar_code: 'Object.equal(obj1, obj2)',
    ref: 'Object/equal'
  },
  {
    name: 'isElement',
    description: 'Returns true if the object is a DOM element.',
    sugar_compatibility: 0,
    sugar_notes: "_.isElement does not exist in Sugar, as it has no direct association with the DOM. However this functionality can be easily replicated (taken from Underscore's own implementation).",
    original_code: '_.isElement(obj1)',
    sugar_code: 'Object.isElement = function(obj){ return !!(obj && obj.nodeType == 1); }'
  },
  {
    name: 'isArray',
    description: 'Returns true if the object is an array.',
    sugar_compatibility: 2,
    sugar_notes: "_.isArray exists natively in modern browsing engines as Array.isArray. Sugar provides this when it is not supported and also implements it as Object.isArray to maintain a parallel with other type checking methods.",
    original_code: '_.isArray(obj)',
    sugar_code: 'Array.isArray(obj)',
    ref: 'Array/isArray'
  },
  {
    name: 'isArguments',
    description: 'Returns true if the object is an Arguments object.',
    sugar_compatibility: 2,
    sugar_notes: '_.isArguments does not exist in Sugar. A simple check of the "callee" parameter may be enough to simulate this (and is also cross-browser). Note that Sugar does have Array.create(), which will convert an arguments object into a standard array.',
    original_code: 'if(_.isArguments(obj))',
    sugar_code: 'if(obj.callee)'
  },
  {
    name: 'isFunction',
    description: 'Returns true if the object is a function.',
    sugar_compatibility: 2,
    sugar_notes: '_.isFunction exists as Object.isFunction and is identical.',
    original_code: '_.isFunction(obj)',
    sugar_code: 'Object.isFunction(obj)',
    ref: 'Object/isFunction'
  },
  {
    name: 'isString',
    description: 'Returns true if the object is a string.',
    sugar_compatibility: 2,
    sugar_notes: '_.isString exists as Object.isString and is identical.',
    original_code: '_.isString(obj)',
    sugar_code: 'Object.isString(obj)',
    ref: 'Object/isString'
  },
  {
    name: 'isNumber',
    description: 'Returns true if the object is a number or NaN.',
    sugar_compatibility: 2,
    sugar_notes: '_.isNumber exists as Object.isNumber and is identical.',
    original_code: '_.isNumber(obj)',
    sugar_code: 'Object.isNumber(obj)',
    ref: 'Object/isNumber'
  },
  {
    name: 'isBoolean',
    description: 'Returns true if the object is a boolean.',
    sugar_compatibility: 2,
    sugar_notes: '_.isBoolean exists as Object.isBoolean and is identical.',
    original_code: '_.isBoolean(obj)',
    sugar_code: 'Object.isBoolean(obj)',
    ref: 'Object/isBoolean'
  },
  {
    name: 'isDate',
    description: 'Returns true if the object is a date.',
    sugar_compatibility: 2,
    sugar_notes: '_.isDate exists as Object.isDate and is identical.',
    original_code: '_.isDate(obj)',
    sugar_code: 'Object.isDate(obj)',
    ref: 'Object/isDate'
  },
  {
    name: 'isRegExp',
    description: 'Returns true if the object is a RegExp.',
    sugar_compatibility: 2,
    sugar_notes: '_.isRegExp exists as Object.isRegExp and is identical.',
    original_code: '_.isRegExp(obj)',
    sugar_code: 'Object.isRegExp(obj)',
    ref: 'Object/isRegExp'
  },
  {
    name: 'isNaN',
    description: 'Returns true if the object is NaN.',
    sugar_compatibility: 2,
    sugar_notes: '_.isNaN exists as Object.isNaN and is identical.',
    original_code: '_.isNaN(obj)',
    sugar_code: 'Object.isNaN(obj)',
    ref: 'Object/isNaN'
  },
  {
    name: 'isNull',
    description: 'Returns true if the object is null.',
    sugar_compatibility: 0,
    sugar_notes: '_.isNull does not exist in Sugar. Just use a straight equality comparison.',
    original_code: '_.isNull(obj)',
    sugar_code: 'obj === null'
  },
  {
    name: 'isUndefined',
    description: 'Returns true if the object is undefined.',
    sugar_compatibility: 0,
    sugar_notes: '_.isUndefined does not exist in Sugar. Just use a straight equality comparison.',
    original_code: '_.isUndefined(obj)',
    sugar_code: 'obj === undefined'
  },
  {
    name: 'times',
    description: 'Invokes the passed iterator n times.',
    sugar_compatibility: 2,
    sugar_notes: '_.times exists in Sugar as Number#times and is identical.',
    original_code: '_.times(3, fn)',
    sugar_code: '(3).times(fn)',
    ref: 'Number/times'
  },
  {
    name: 'template',
    description: 'Compiles Javascript templates into functions that can be evaluated for rendering.',
    sugar_compatibility: 1,
    sugar_notes: '_.template exists in Sugar as String#assign with slightly different syntax. Although it does not have the complex "eval" functionality of Underscore, it can be useful for quickly assigning a value inside a string. String#assign will also accept numbers for arguments passed.',
    original_code: "_.template('hello: <%= name %>')({ name: 'joe' })",
    sugar_code: "'hello: {name}'.assign({ name: 'joe' })",
    ref: 'String/assign'
  }
  ]
}
];


  // END LIBS


  var URL_MATCH = /((?:https?|file):[^:]+(?::\d{4})?[^:]+):(\d+)(?::(\d+))?/;
  var warned = {};

  var warn = function(message, stackLevel, skipMeta, docs, logLevel) {
    var stack, files, match, file, line;
    if(SUGAR_ANALYZER_UNIQUE_MESSAGES && hasBeenWarned(message)) {
      return;
    }
    stack = new Error().stack;
    message = message.replace(/\t/g, TS);
    if(stack) {
      files = stack.match(new RegExp(URL_MATCH.source, 'g'));
      var isConsole = stack.match(/console|Object\._evaluateOn/);
      file = files[stackLevel];
      if(!isConsole && (!file || file.match(new RegExp('(' + baseExcludePackages.concat(SUGAR_ANALYZER_EXCLUDES).join('|') + ')[^\/]*\.js')))) {
        return;
      }
      warned[message] = true;
      if(!skipMeta) {
        message += '\n\n';
        if(isConsole) {
          message += '----------- File: Console ---------';
        } else {
          match = file.match(URL_MATCH);
          message += '----------- File: ' + match[1] + ' ---------';
          if(match[2]) message += '\n----------- Line: ' + match[2] + ' --------------';
          if(match[3]) message += '\n----------- Char: ' + match[3] + ' --------------';
        }
        if(docs){
          message += '\n----------- Docs: http://sugarjs.com/api/' + docs + ' ---------';
        }
      }
    }
    if(SUGAR_ANALYZER_FIRST_LINE_ONLY) {
      message = message.replace(/\n[\S\s]+$/gm, '');
    }
    console[logLevel || globalLogLevel](message);
  };


  var hasBeenWarned = function(message) {
    return message in warned;
  }

  var wrapAll = function(all) {
    for (var i = 0; i < all.length; i += 1) {
      wrapModule(all[i]);
    }
  }

  var wrapModule = function(module){
    var namespace = this;
    if(module.namespace) {
      if(!namespace[module.namespace]) {
        namespace[module.namespace] = function(){};
      }
      namespace = namespace[module.namespace];
    }
    if(namespace && module.type == 'instance') namespace = namespace.prototype;
    for (var i = 0; i < module.methods.length; i++) {
      wrapMethod(namespace, module.methods[i])
    }
  }

  var wrapMethod = function(namespace, method) {
    var fn = namespace[method.name] || function(){};
    namespace[method.name] = function() {
      var level, text = method.live_notes || method.sugar_notes;
      if(!method.hasOwnProperty('conflict')) method.conflict = true;
      var result = method.conflict && method.conflict.apply ? method.conflict.apply(this, arguments) : method.conflict;
      var cond = result && result.length ? result[0] : result;
      if(!cond && typeof method.conflict != 'function' && SUGAR_ANALYZER_INFO) {
        level = 'info';
        cond = true;
      }
      if(cond) {
        text = supplant(text, result);
        if(method.original_code && SUGAR_ANALYZER_SHOW_EXAMPLES){
          text += '\n\n';
          text += '\n'+library+':    ' + method.original_code;
          text += '\nSugar:        ' + method.sugar_code;
          text += '\n';
        }
        warn(text, 2, false, method.ref, level);
      }
      if(fn === PrototypeHash) {
        return new fn(arguments);
      } else {
        return fn.apply(this, arguments);
      }
    }
  };

  function supplant(str, obj) {
    var val;
    return  str.replace(/\{(.+?)\}/g, function(m, d) {
      val = obj[d];
      return val !== undefined ? jsonify(val) : m;
    });
  }

  function jsonify(o){
    if(typeof JSON != 'undefined') {
      return JSON.stringify(o);
    } else {
      return o.toString();
    }
  }

  function setDefault(name, defaultValue) {
    if(context[name] === undefined) {
      context[name] = defaultValue;
    }
  }


  var initialize = function(force) {
    var noneFound = true;
    if(typeof _ != 'undefined' || force) {
      noneFound = false;
      library = 'Underscore';
      globalLogLevel = 'info';
      wrapAll(SugarUnderscoreMethods);
    }
    if(typeof $A != 'undefined' || force) {
      noneFound = false;
      library = 'Prototype';
      globalLogLevel = 'warn';
      wrapAll(SugarPrototypeMethods);
    }

    if(noneFound) {
      // No libs found, try initializing again after page load...
      window.addEventListener('load', function() {
        initialize(true);
      });
      return;
    }

    var welcome =
      '### Welcome to the Sugar analyzer script! ###\n\n' +
      "As your program calls various methods, it will warn you about incompatibilities with Sugar, and give\n" +
      'suggestions about how to refactor. You can run this before refactoring to get a general idea about what needs to change\n' +
      'or you can immediately remove Prototype/Underscore for Sugar, let breakages happen, and fix as you go!' +
      '\n\nAnalyzer options (set these as globals):\n\n' +
      'SUGAR_ANALYZER_UNIQUE_MESSAGES    = true/false       |  Display each message only once (default is true)\n' +
      'SUGAR_ANALYZER_FIRST_LINE_ONLY    = true/false       |  Only display the first line of the message (default is false)\n' +
      'SUGAR_ANALYZER_SHOW_EXAMPLES      = true/false       |  Show usage examples inline (default is true)\n' +
      "SUGAR_ANALYZER_EXCLUDES           = ['a', 'b', ...]  |  Array of filenames to exclude messages from (default is [], can be partial match, leave off .js at the end)\n" +
      'SUGAR_ANALYZER_INFO               = true/false       |  Display messages even when methods do not conflict (default is true)';
    //welcome += '\n\n#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#';
    console.info(welcome + '\n\n\n');
    //console.info('-------------------------------------------------------------------------------------------------------------------');
  }

  var TS = '              ';
  var globalLogLevel;
  var library;
  var baseExcludePackages = ['prototype','underscore','analyzer'];
  var PrototypeHash = typeof Hash != 'undefined' ? Hash : null;

  setDefault('SUGAR_ANALYZER_FIRST_LINE_ONLY', false);
  setDefault('SUGAR_ANALYZER_SHOW_EXAMPLES', true);
  setDefault('SUGAR_ANALYZER_INFO', true);
  setDefault('SUGAR_ANALYZER_UNIQUE_MESSAGES', true);
  setDefault('SUGAR_ANALYZER_EXCLUDES', []);

  initialize();

})(this);
