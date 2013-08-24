
//  Compatibility index:
//
//  0 - Does not exist.
//  1 - Exists but does not support all functionality.
//  2 - Exists and supports all functionality.
//  3 - Exists and supports all functionality plus more.

var SugarPythonMethods = [
  {
    // Global namespace
    type: 'instance',
    namespace: 'String',
    methods: [
      {
        name: 'capitalize',
        description: 'Capitalizes a string.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code: 'str.capitalize()',
        js_code: 'str.charAt(0).toUpperCase() + str.slice(1);',
        sugar_code: 'str.capitalize();',
        sugar_notes: 'Sugar can additionally capitalize each word in the string by passing %true% as the second parameter.',
        ref: 'String/capitalize'
      },
      {
        name: 'center',
        description: 'Centers the string to a given length by padding it.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code: "str.center(8, '-');",
        js_code: "while(str.length < 8) { str = str.length % 2 == 0 ? '-' + str : str + '-'; }",
        sugar_code: "str.pad(8, '-');",
        sugar_notes: 'String#pad exist in Sugar and is identical.',
        ref: 'String/pad'
      },
      {
        name: 'count',
        description: 'Counts the number of occurrences of a substring within a string.',
        js_notes: 'String#match will return %null% if no match is made, which will throw an error when getting the length, so an extra step is needed here.',
        sugar_notes: 'In addition to running a callback on each match, String#each in Sugar will always return an array of matches, so we can leverage that here.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code: "str.count('h', 3, 10)",
        js_code: "var match; match = str.slice(3, 10).match('h'); return match ? match.length : 0;",
        sugar_code: "str.slice(3, 10).each('h').length;",
        ref: 'String/each'
      },
      {
        name: 'encode',
        description: 'Encodes the character with a given encoding.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_notes: "Character encoding/decoding doesn't exist in native Javascript. Javascript is internally Unicode compliant and web pages can specify their encoding to browsers, so this is usually not an issue."
      },
      {
        name: 'decode',
        description: 'Decodes the character with a given encoding.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_notes: "Character encoding/decoding doesn't exist in native Javascript. Javascript is internally Unicode compliant and web pages can specify their encoding to browsers, so this is usually not an issue."
      },
      {
        name: 'endsWith',
        description: 'Returns true if the string ends with a substring.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "str.endsWith('ing'); str.endsWith('ing', 2, 6)",
        js_code: "/ing$/.test(str); /ing$/.test(str.slice(2,6));",
        sugar_code: "str.endsWith('ing'); str.slice(2,6).endsWith('ing')",
        sugar_notes: 'Sugar can additionally specify case sensitivity (on by default).',
        ref: 'String/endsWith'
      },
      {
        name: 'find',
        description: 'Determine if a string contains a substring and returns the index.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "str.find('h'); str.find('h', 2, 6)",
        js_code: "str.indexOf('h'); str.slice(2,6).indexOf('h');"
      },
      {
        name: 'index',
        description: 'Determine if a string contains a substring and returns the index. Raises an error if it does not exist.',
        js_notes: 'Javascript will not raise the error if the substring does not exist but instead return -1.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        js_code: "str.indexOf('h'); str.slice(2,6).indexOf('h')",
        original_code:  "str.index('h'); str.index('h', 2, 6)"
      },
      {
        name: 'isalnum',
        description: 'Returns true if the string contains only alphabetic characters or digits.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_code: "/^[\\w\\d]+$/.test(str)",
        original_code:  "str.isalnum()"
      },
      {
        name: 'isalpha',
        description: 'Returns true if the string contains only alphabetic characters or digits.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_code: "/^\\w+$/.test(str)",
        original_code:  "str.isalpha()"
      },
      {
        name: 'isdigit',
        description: 'Returns true if the string contains only digits.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_code: "/^\\d+$/.test(str)",
        original_code:  "str.isdigit()"
      },
      {
        name: 'islower',
        description: 'Returns true if the string contains only lower-case alphabetic characters.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_code: "/^[a-z]+$/.test(str)",
        original_code:  "str.islower()"
      },
      {
        name: 'isupper',
        description: 'Returns true if the string contains only upper-case alphabetic characters.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_code: "/^[A-Z]+$/.test(str)",
        original_code:  "str.isupper()"
      },
      {
        name: 'isspace',
        description: 'Returns true if the string contains only whitespace characters.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "str.isspace()",
        js_code: "/^\s+$/.test(str)",
        sugar_code: "str.isBlank()",
        sugar_notes: "Javascript's interpretation of \"whitespace\" may vary. Sugar consolidates this behavior on the String#trim method and uses this to test whitespace, so the Sugar's behavior here will be consistent in different environments."
      },
      {
        name: 'join',
        description: 'Uses the string as a separator in the sequence passed, and performs a join on it. Strings in Python are also sequences so this works on them too.',
        js_compatibility: 1,
        sugar_compatibility: 1,
        js_notes: 'Although Array#join exists, String#join does not, so a string will have to first be split into an array.',
        sugar_notes: 'The Sugar#chars method returns an array of each character in the string and is a bit more readable.',
        js_code: "arr.join(','); str.split('').join(',');",
        sugar_code: "str.chars().join(',');",
        original_code:  "','.join(seq)"
      },
      {
        name: 'len',
        description: 'Returns the length of the string.',
        js_notes: 'Javascript strings and arrays both have a %length% property on them natively.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        js_code: "str.length",
        original_code:  "len(str)"
      },
      {
        name: 'ljust',
        description: 'Expands the string to a given length by padding it on the right.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "str.ljust(50, '-')",
        js_code: "var padded = str; while(padded.length < 50) { str += '-' }",
        sugar_code: "str.padRight(50, '-')"
      },
      {
        name: 'lower',
        description: 'Returns a copy of the string with all characters in lower case.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "str.lower()",
        js_code: "str.toLowerCase()"
      },
      {
        name: 'lstrip',
        description: 'Returns a copy of the string with all leading characters (whitespace by default) removed.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "str.lstrip(); str.lstrip('f')",
        js_code: "str.replace(/^\\s+/, ''); str.replace(/^f+/, '')",
        sugar_code: "str.trimLeft(); str.remove(/^f+/);",
        sugar_notes: "Javascript's interpretation of \"whitespace\" may vary. Sugar consolidates this behavior in String#trimLeft so that behavior will be consistent in different environments.",
        ref: 'String/trimLeft'

      },
      {
        name: 'replace',
        description: 'Returns a copy of a string with all occurrences of %a% replaced with %b%.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "str.replace('is', 'was');",
        js_code: "str.replace(/is/g, 'was')"
      },
      {
        name: 'rfind',
        description: 'Returns the last index where a substring is found.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "str.rfind('h'); str.rfind('h', 2, 6)",
        js_code: "str.lastIndexOf('h'); str.slice(2,6).lastIndexOf('h')"
      },
      {
        name: 'rindex',
        description: 'Determine if a string contains a substring and returns the index. Raises an error if it does not exist.',
        js_notes: 'Javascript will not raise the error if the substring does not exist but instead return -1.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "str.rindex('h'); str.rindex('h', 2, 6)",
        js_code: "str.lastIndexOf('h'); str.slice(2,6).lastIndexOf('h')"
      },
      {
        name: 'rjust',
        description: 'Expands the string to a given length by padding it on the left.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "str.rjust(50, '-')",
        js_code: "var padded = str; while(padded.length < 50) { str = '-' + str }",
        sugar_code: "str.padLeft(50, '-')"
      },
      {
        name: 'rstrip',
        description: 'Returns a copy of the string with all trailing characters (whitespace by default) removed.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "str.rstrip(); str.rstrip('f')",
        js_code: "str.replace(/^\\s+/, ''); str.replace(/^f+/, '')",
        sugar_code: "str.trimRight(); str.remove(/^f+/);",
        sugar_notes: "Javascript's interpretation of \"whitespace\" may vary. Sugar consolidates this behavior in String#trimRight so that behavior will be consistent in different environments.",
        ref: 'String/trimRight'

      },
      {
        name: 'split',
        description: 'Splits a string based on a token (all whitespace by default). Optionally limits the number of splits.',
        js_notes: 'Although String#split in Javascript has a %limit% option, it exhibits different behavior by including only up to %limit% in the array, whereas Python will include the remainder of the string. If this behavior is needed a more complex workaround is required.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "str.split(','); str.split()",
        js_code: "str.split(','); str.split(/\s+/)",
        sugar_notes: "String#split is known to have some inconsistent behavior when splitting on a regex.",
        ref: 'String/split'

      },
      {
        name: 'splitlines',
        description: 'Splits a string into lines, optionally including the newline character.',
        js_notes: 'Although String#split in Javascript has a %limit% option, it exhibits different behavior by including only up to %limit% in the array, whereas Python will include the remainder of the string. If this behavior is needed a more complex workaround is required.',
        js_compatibility: 1,
        sugar_compatibility: 1,
        original_code:  "str.splitlines();",
        js_code: "str.split(/\\n/);",
        sugar_notes: "String#split is known to have some inconsistent behavior when splitting on a regex.",
        ref: 'String/split'

      },
      {
        name: 'startsWith',
        description: 'Returns true if the string starts with a substring.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "str.startsWith('ing'); str.startsWith('ing', 2, 6);",
        js_code: "/^ing/.test(str); /^ing/.test(str.slice(2,6));",
        sugar_code: "str.startsWith('ing'); str.slice(2,6).startsWith('ing')",
        sugar_notes: 'Sugar can additionally specify case sensitivity (on by default).',
        ref: 'String/startsWith'
      },
      {
        name: 'strip',
        description: 'Returns a copy of the string with all leading and trailing characters (whitespace by default) removed.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "str.strip(); str.strip('f')",
        js_code: "str.replace(/^\\s+|\\s+$/g, ''); str.replace(/^f+|f+$/g, '')",
        es5_code: 'str.trim();',
        sugar_code: "str.trim(); str.remove(/^f+|f+$/g);",
        sugar_notes: "Javascript's interpretation of \"whitespace\" may vary. Sugar consolidates this behavior in String#trim so that behavior will be consistent in different environments.",
        ref: 'String/trim'
      },
      {
        name: 'swapcase',
        description: 'Swaps all lowercase strings to uppercase, and uppercase to lowercase.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "str.swapcase();",
        js_code: "str.replace(/[a-z]/gi, function(m) { var match =  m.match(/[a-z]/); return match ? m.toUpperCase() : m.toLowerCase(); });"
      },
      {
        name: 'title',
        description: 'Returns a copy of the string with all words capitalized.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "str.title();",
        js_code: "str.replace(/\\b[a-z]/g, function(m){ return m.toUpperCase(); });",
        sugar_code: "str.capitalize(true);"
      },
      {
        name: 'upper',
        description: 'Returns a copy of the string with all characters in upper case.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "str.upper();",
        js_code: "str.toUpperCase();"
      },
      {
        name: 'zfill',
        description: 'Pads the string with zeros on the left.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "str.zfill(50)",
        js_code: "var padded = str; while(padded.length < 50) { str = '0' + str; }",
        sugar_code: "str.padLeft(50, '0')"
      }
    ]
  },
  {
    type: 'built-in',
    namespace: 'Built-in',
    methods: [
      {
        name: 'abs',
        description: 'Returns the absolute value of the number.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "abs(num)",
        js_code: "Math.abs(num)",
        sugar_code: "num.abs()",
        ref: 'Number/abs'
      },
      {
        name: 'all',
        description: 'Returns true if all elements in the iterable are true.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "all(el == 8 for el in arr)",
        js_code: "for(var i = 0; i < arr.length; i++) { if(arr[i] != 8) { return false; } } return true;",
        es5_code: "arr.every(function(el) { return el == 8; });",
        sugar_code: "arr.all(function(el) { return el == 8; });",
        sugar_notes: 'Sugar additionally allows strings that will resolve to a function returning a property of that name.',
        ref: 'Array/all'
      },
      {
        name: 'any',
        description: 'Returns true if any elements in the iterable are true',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "any(el == 8 for el in arr)",
        js_code: "for(var i = 0; i < arr.length; i++) { if(arr[i] == 8) { return true; } } return false;",
        es5_code: "arr.some(function(el) { return el == 8; });",
        sugar_code: "arr.any(function(el) { return el == 8; });",
        sugar_notes: 'Sugar additionally allows strings that will resolve to a function returning a property of that name.',
        ref: 'Array/all'
      },
      {
        name: 'bin',
        description: 'Converts an integer into a string binary representation.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "bin(8)",
        js_code: "(8).toString(2)",
        js_notes: "%toString% can accept a number which is the radix for conversion. Note that the resulting string will not be prepended with \"0b\" as in Python"
      },
      {
        name: 'bool',
        description: 'Converts a value to a Boolean.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "bool(val)",
        js_code: "Boolean(val) or simply !!val"
      },
      {
        name: 'bytearray',
        description: 'Returns an array of bytes.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "bytearray(str)",
        js_code: "var result = []; for(var i = 0; i < str.length; i++) { result.push(str.charCodeAt(i)); }",
        sugar_code: "str.codes()",
        sugar_notes: "Sugar's version will only work on strings. However it will accept any character, including those outside ascii range.",
        ref: 'String/codes'
      },
      {
        name: 'unichr',
        description: 'Returns a string at the code point of the number.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "chr(97)",
        js_code:  "String.fromCharCode(97)",
        sugar_code: "(97).chr()",
        ref: 'Number/chr'
      },
      {
        name: 'cmp',
        description: 'Compares two objects and returns the outcome as an integer.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "cmp(x, y)",
        js_code: "if(x < y) return -1; if(x == y) return 0; if(x > y) return 1;",
      },
      {
        name: 'filter',
        description: 'Creates a list of elements in an iterable for which a function returns true.',
        js_compatibility: 1,
        sugar_compatibility: 3,
        original_code:  "filter(lambda x: x % 3 == 0, arr)",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { if(arr[i] % 3 == 0) { result.push(arr[i]); } } return result;",
        es5_code: "arr.filter(function(el) { return el % 3 == 0; });",
        sugar_code: "arr.findAll(function(el) { return el % 3 == 0; });",
        sugar_notes: "Sugar's %findAll% method has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
        ref: 'Array/findAll'
      },
      {
        name: 'float',
        description: 'Convert a string or number into a floating point decimal.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "float('3.14')",
        js_code: "parseFloat('3.14')",
        js_notes: "Integers and floats are both of class \"Number\" to Javascript and so can be used interchangeably. Only strings need to be parsed."
      },
      {
        name: 'format',
        description: 'Converts a value to a formatted representation.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "format(18.4)",
        js_code: "(18.4).toString()",
        js_notes: "%toString% will only convert decimals if they exist. Use %toFixed% to have a fixed decimal representation.",
        sugar_code: "(18.4).format()",
        sugar_notes: "Sugar's %format% method wraps Javascript %toString% when no decimal is specified, and %toFixed% when one is. Additionally the characters for both the thousands and decimal separator can be indicated.",
        ref: 'Number/format'
      },
      {
        name: 'hex',
        description: 'Converts an integer into a hexidecimal string.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "hex(8)",
        js_code: "(8).toString(16)",
        js_notes: "%toString% can accept a number which is the radix for conversion. Note that the resulting string will not be prepended with \"0x\" as in Python",
        sugar_code: "(8).hex()",
        sugar_notes: "Sugar can also accept a parameter to pad the resulting string to %n% places.",
        ref: 'Number/hex'
      },
      {
        name: 'int',
        description: 'Convert a string or number into an integer.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "int('8', 10)",
        js_code: "parseInt('8', 10)",
        js_notes: "Integers and floats are both of class \"Number\" to Javascript and so can be used interchangeably. Only strings need to be parsed. Second parameter is the radix."
      },
      {
        name: 'isinstance',
        description: 'Returns true if the first argument is an instance of the second argument',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "isinstance('string', str)",
        js_code: "'string' instanceof String",
        js_notes: "Note that %instanceof% has some quirks, including not working across iframes.",
        sugar_code: "Object.isString('string')",
        sugar_notes: 'Sugar adds methods that do robust checking of instances of built-in classes and are useful when checking objects of these types.',
        ref: 'Object/isString'
      },
      {
        name: 'len',
        description: 'Returns the length of an object.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "len(list)",
        js_code: "list.length",
        sugar_code: "Object.keys(obj).length",
        sugar_notes: "The length property exists only on arrays, not objects. %Object.keys%, which is browser native, (Sugar adds this method when not available) can work to get the number of properties in an object.",
        ref: 'Object/keys'
      },
      {
        name: 'list',
        description: 'Returns a list with the same items as the passed argument. When run on lists, simply clones the list.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "list(list)",
        js_code: "list.concat()",
        sugar_code: "list.clone()",
        ref: 'Array/clone'
      },
      {
        name: 'map',
        description: 'Creates a list from another via a mapping function.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "map(lambda x: x * 3, arr)",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { result.push(arr[i] * 3); } return result;",
        es5_code: "arr.map(function(el) { return el * 3; });",
        sugar_code: "arr.map('id');",
        sugar_notes: "Sugar enhances the %map% method to allow a string shortcut.",
        ref: 'Array/map'
      },
      {
        name: 'max',
        description: 'Returns the largest item in the iterable argument.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "max(len(l) for l in ['one','two','three'])",
        js_code: "var result; for(var i = 0; i < arr.length; i++) { if(arr[i].length > result) result = arr[i].length; } return result;",
        es5_code: "arr.reduce(function(a, b){ return a.length > b.length ? a.length : b.length; })",
        sugar_code: "arr.max('length').length;",
        sugar_notes: "Sugar's %max% method allows a function to transform the property to be checked, as well as a string shortcut to that property. Additionally, it returns the original array element, not the mapped property.",
        ref: 'Array/max'
      },
      {
        name: 'min',
        description: 'Returns the smallest item in the iterable argument.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "min(len(l) for l in ['one','two','three'])",
        js_code: "var result; for(var i = 0; i < arr.length; i++) { if(arr[i].length < result) result = arr[i].length; } return result;",
        es5_code: "arr.reduce(function(a, b){ return a.length < b.length ? a.length : b.length; })",
        sugar_code: "arr.min('length').length;",
        sugar_notes: "Sugar's %min% method allows a function to transform the property to be checked, as well as a string shortcut to that property. Additionally, it returns the original array element, not the mapped property.",
        ref: 'Array/min'
      },
      {
        name: 'oct',
        description: 'Converts an integer into a octal string.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "oct(44)",
        js_code: "(44).toString(8)",
        js_notes: "%toString% can accept a number which is the radix for conversion. Note that the resulting string will not be prepended with \"0x\" as in Python"
      },
      {
        name: 'ord',
        description: 'Returns the Unicode code point of a string of length == 1.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "ord('a')",
        js_code: "'a'.charCodeAt(0)",
        sugar_code: "'a'.codes().first()",
        ref: 'String/codes'
      },
      {
        name: 'pow',
        description: 'Returns x to the power of y, where x and y are the first 2 arguments.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "pow(2,8)",
        js_code: "Math.pow(2,8);",
        sugar_code: "(2).pow(8);",
        ref: 'Number/pow'
      },
      {
        name: 'range',
        description: 'Creates a list with a numeric progression.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "range(2, 10, 2)",
        js_code: "var result = [], i = 2, step = 2; while(i < 5) { result.push(i); i += 2; } return result;",
        sugar_code: "Number.range(2, 10);",
        sugar_notes: 'Sugar has ranges that can be accessed with %Number.range%',
        ref: 'Range'
      },
      {
        name: 'reduce',
        description: 'Apply a function to the items of the iterable to reduce it to a single value.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "reduce(lambda x,y: x + y, arr, 0)",
        js_code: "var result = 0; for(var i = 0; i < arr.length; i++) { return result + arr[i]; } return result;",
        es5_code: "arr.reduce(function(x, y) { return x + y; });",
        sugar_code: "arr.reduce(function(x, y) { return x + y; });",
        ref: 'Array/reduce'
      },
      {
        name: 'reversed',
        description: 'Returns a reversed iterator of a sequence.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code: "reversed(arr)",
        js_code: "arr.reverse();",
        js_notes: "There is no concept of \"iterators\" in Javascript, so you simply reverse the array with this standard method."
      },
      {
        name: 'round',
        description: 'Rounds a floating point value.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code: "round(n, 2)",
        js_code: "Math.round(n * 100) / 100;",
        sugar_code: "n.round(2);",
        ref: 'Number/round'
      },
      {
        name: 'sorted',
        description: 'Returns a new sorted list from an iterable.',
        js_compatibility: 1,
        sugar_compatibility: 3,
        original_code: "sorted(arr, lambda a,b:  a - b); sorted(arr, key=str.lower)",
        js_code: "arr.sort(); arr.sort(function() { a = a.toLowerCase(); b = b.toLowerCase(); if(a == b) { return 0; } else { return a < b ? -1 : 1 });",
        sugar_code: "arr.sort(); arr.sortBy('toLowerCase');",
        sugar_notes: "In addition to allow sorting on a property or method of any type (numeric, string, etc). Sugar's %Array#Sortby% method has a flag to allow descending order.",
        ref: 'Array/sortBy'
      },
      {
        name: 'str',
        description: 'Returns a string representation of the object.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code: "str(obj)",
        js_code: "String(obj)"
      },
      {
        name: 'sum',
        description: 'Returns the sum of all elements in the iterable.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "sum(arr)",
        js_code: "var result = 0; for(var i = 0; i < arr.length; i++) { result += arr[i]; } return result;",
        es5_code: "arr.reduce(function(a, b){ return a + b; }, 0)",
        sugar_code: "arr.sum()",
        ref: 'Array/sum'
      },
      {
        name: 'type',
        description: 'Returns the type of the argument passed.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "type(obj)",
        js_code: "typeof(obj)",
        js_notes: "Note that %typeof% has some quirks, such as returning %object% for %null%.",
        sugar_code: "Object.isString(obj); Object.isNumber(obj); Object.isArray(obj);",
        sugar_notes: "For built-in Javascript types, Sugar provides more robust testing methods that provides more consistent results than either %typeof% or %instanceof%.",
        ref: 'Array/isType'
      },
      {
        name: 'zip',
        description: 'Zips up iterables into a larger iterable containing tuples of every nth element.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "zip(arr1, arr2)",
        js_code: "var result = []; for(var i = 0; i < arr1.length; i++) { result.push([arr1[i], arr2[i] || null]); } return result;",
        sugar_code: "arr1.zip(arr2);",
        ref: 'Array/zip'
      }
    ]
  },
  {
    type: 'class',
    namespace: 'Itertools',
    methods: [
      {
        name: 'chain',
        description: 'Chains iterables together.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "chain(arr1, arr2)",
        js_code: "arr1.concat(arr2)"
      },
      {
        name: 'dropwhile',
        description: 'Drops elements from the iterable while the function resolves to true.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "dropwhile(lambda x: x < 5, arr)",
        js_code: "var result = [], drop = true; for(var i = 0; i < arr.length; i++) { if(arr[i] < 5 && drop) { result.push(arr[i]); } else { drop = false; } } return result;",
        sugar_code: "var drop = true; arr.exclude(function(el){ if(el < 5 && drop) { return true; } else { return drop = false; }});",
        sugar_info: "%exclude% is non-destructive. For a destructive alias use %remove%",
        ref: 'Array/exclude'
      },
      {
        name: 'groupby',
        description: 'Returns an iterator that contains groups of iterables grouped by a key.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "groupby(arr, lambda x: x['id'])",
        js_code: "var result = {}; for(var i = 0; i < arr.length; i++) { var key = arr[i]['id']; if(!result[key]) { result[key] = []; } result[key].push(arr[i]); } return result;",
        sugar_code: "arr.groupBy('id')",
        sugar_info: "The result of %groupBy% is a standard object that can be iterated over using %Object.each%. %groupBy% can also accept a 2nd parameter which is an iterating function that is called on each group.",
        ref: 'Array/groupBy'
      },
      {
        name: 'ifilter',
        description: 'Creates a list of elements in an iterable for which a function returns true.',
        js_compatibility: 1,
        sugar_compatibility: 3,
        original_code:  "ifilter(lambda x: x % 3 == 0, arr)",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { if(arr[i] % 3 == 0) { result.push(arr[i]); } } return result;",
        es5_code: "arr.filter(function(el) { return el % 3 == 0; });",
        sugar_code: "arr.findAll(function(el) { return el % 3 == 0; });",
        sugar_notes: "Sugar's %findAll% method has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
        ref: 'Array/findAll'
      },
      {
        name: 'ifilterfalse',
        description: 'Creates a list of elements in an iterable for which a function returns false. The reverse of %ifilter%.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "ifilterfalse(lambda x: x % 3 == 0, arr)",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { if(arr[i] % 3 != 0) { result.push(arr[i]); } } return result;",
        es5_code: "arr.filter(function(el) { return el % 3 != 0; });",
        sugar_code: "arr.findAll(function(el) { return el % 3 != 0; });",
        sugar_notes: "Sugar's %findAll% method has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
        ref: 'Array/findAll'
      },
      {
        name: 'islice',
        description: 'Returns in iterator that contains selected elements.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "islice(arr, 2, 5)",
        js_code: "arr.slice(2,5)"
      },
      {
        name: 'imap',
        description: 'Creates an iterable from another via a mapping function.',
        js_compatibility: 1,
        sugar_compatibility: 3,
        original_code:  "imap(lambda x: x * 3, arr)",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { result.push(arr[i] * 3); } return result;",
        es5_code: "arr.map(function(el) { return el * 3; });",
        sugar_code: "arr.map(function(el) { return el * 3; });",
        sugar_notes: "Sugar enhances the %map% method to allow a string shortcut.",
        ref: 'Array/map'
      },
      {
        name: 'takewhile',
        description: 'Returns an iterable with elements taken from the source as long as the function returns true.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "takewhile(lambda x: x % 3 == 0, arr)",
        js_code: "arr.filter(function(x) { return x % 3 === 0; });",
        ref: 'Array/filter'
      },
      {
        name: 'izip',
        description: 'Zips up iterables into a larger iterable containing tuples of every nth element.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "izip(arr1, arr2)",
        js_code: "var result = []; for(var i = 0; i < arr1.length; i++) { if(i in arr[2]) result.push([arr1[i], arr2[i]]); } return result;",
        sugar_code: "arr1.zip(arr2);",
        sugar_notes: "%zip% will always use the length of the first array and fill other values with %null%. In this way the behavior more closely matches %izip_longest%.",
        ref: 'Array/zip'
      },
      {
        name: 'izip_longest',
        description: 'Zips up iterables into a larger iterable containing tuples of every nth element. Fills arrays of uneven length with %None%.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "izip(arr1, arr2)",
        js_code: "var result = []; for(var i = 0; i < arr1.length; i++) { result.push([arr1[i], arr2[i] || null]); } return result;",
        sugar_code: "arr1.zip(arr2);",
        ref: 'Array/zip'
      },
      {
        name: 'count',
        description: 'Creates an iterator that counts up from a starting number.',
        original_code:  "count(10, 2)",
        js_compatibility: 0,
        sugar_compatibility: 2,
        js_code: "for(var i = 0; i < n; i += 2) {}",
        js_notes: "In general terms, functionality of a %count% iterator is captured by simply using a standard %for% loop. Other uses may depend on the context in which they're used.",
        sugar_code: "(4).upto(n, function() {})",
        sugar_notes: "%upto% and %downto% can caputure one of the uses of %count% and can additionally run a callback on each number in the sequence.",
        ref: 'Number/upto'
      },
      {
        name: 'cycle',
        description: 'Returns an iterable that will cycle over another iterable.',
        original_code:  "c = cycle(arr); [c.next() for i in range(10)]",
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_code: "var result = []; for(var i = 0; i < 10; i++) { result.push(arr[i % arr.length]); }",
        js_notes: "Using the modulo operator can reproduce the functionality of Python's %cycle% by finding an element at any index, even those that have gone off the end of the array.",
        sugar_code: "var result = []; (0).upto(9, function(n) { result.push(arr.at(n)); });",
        sugar_notes: "Sugar encapsulates the standard syntax with %at%, which by default will return elements at any index, effectively cycling through the array.",
        ref: 'Number/times'
      },
      {
        name: 'repeat',
        description: 'Creates an iterable that repeats %n% times.',
        original_code:  "for x in repeat('a', 3); fn();",
        js_compatibility: 0,
        sugar_compatibility: 2,
        js_code: "for(var i = 0; i < 3; i++) { fn(); }",
        js_notes: "%repeat% iterators are genearally expressed simply as a %for% loop.",
        sugar_code: "(3).times(fn);",
        sugar_notes: "Sugar encapsulates repeating an action %n% times with the %repeat% method on the Number class.",
        ref: 'Array/at'
      }
    ]
  },
  {
    type: 'class',
    namespace: 'Functools',
    methods: [
      {
        name: 'partial',
        description: 'Creates a "partial" object which will behave like a function with some of its arguments pre-filled.',
        original_code:  "fromBinary = partial(int, base=2); fromBinary('0010');",
        js_compatibility: 0,
        sugar_compatibility: 2,
        js_code: "var fromBinary = function(n) { return parseInt(n, 2); }; fromBinary('0010');",
        sugar_code: "var fromBinary = parseInt.fill(undefined, 2); fromBinary('0010');",
        sugar_notes: "%fill% acts similarly to %partial% in that it pre-fills arguments that will be passed later when the new function is called. If %undefined% is passed then that argument will be allowed through in the new function allowing arguments in awkward end positions to be pre-filled as well.",
        ref: 'Array/at'
      }
    ]
  }
];
