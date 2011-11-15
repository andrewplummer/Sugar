
// Compatiblity index:
//
// 0 - Does not exist.
// 1 - Exists but does not support all functionality.
// 2 - Exists and supports all functionality.
// 3 - Exists and supports all functionality plus more.
//
var SugarPythonMethods = [
  {
    // Global namepace
    type: 'class',
    namespace: 'String',
    methods: [
      {
        name: 'capitalize',
        description: 'Capitalizes a string.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        sugar_enhancements: 'Sugar can additionally capitalize each word in the string by passing %true% as the second parameter.',
        js_code: 'str.charAt(0).toUpperCase() + str.slice(1);',
        sugar_code: 'str.capitalize();',
        original_code: 'str.capitalize()',
        ref: 'String/capitalize'
      },
      {
        name: 'center',
        description: 'Centers the string to a given length by padding it.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_code: "while(str.length < 8) { str = str.length % 2 == 0 ? '-' + str : str + '-'; }",
        sugar_code: "str.pad('-', (8 - str.length) / 2);",
        original_code: "str.center(8, '-');",
        ref: 'String/pad'
      },
      {
        name: 'count',
        description: 'Counts the number of occurrences of a substring within a string.',
        js_notes: 'String#match will return %null% if no match is made, which will throw an error when getting the length, so an extra step is needed here.',
        sugar_notes: 'In addition to running a callback on each match, String#each in Sugar will always return an array of matches, so we can leverage that here.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_code: "var match; match = str.slice(3, 10).match('h'); return match ? match.length : 0;",
        sugar_code: "str.slice(3, 10).each('h').length;
        original_code: "str.count('h', 3, 10)",
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
        sugar_compatibility: 1,
        js_code: "/ing$/.test(str); /ing$/.test(str.slice(2,6));",
        sugar_code: "str.endsWith('ing'); str.slice(2,6).endsWith('ing')",
        original_code:  "str.endsWith('ing'); str.endsWith('ing', 2, 6)"
        sugar_enhancements: 'Sugar can additionally specify case sensitivity (on by default).',
        ref: 'String/endsWith'
      },
      {
        name: 'find',
        description: 'Determine if a string contains a substring and returns the index.',
        js_compatibility: 1,
        sugar_compatibility: 0,
        js_code: "str.indexOf('h'); str.slice(2,6).indexOf('h')",
        original_code:  "str.find('h'); str.find('h', 2, 6)"
      },
      {
        name: 'index',
        description: 'Determine if a string contains a substring and returns the index. Raises an error if it does not exist.',
        js_notes: 'Javascript will not raise the error if the substring does not exist but instead return -1.',
        js_compatibility: 1,
        sugar_compatibility: 0,
        js_code: "str.indexOf('h'); str.slice(2,6).indexOf('h')",
        original_code:  "str.index('h'); str.index('h', 2, 6)"
      },
      {
        name: 'isalnum',
        description: 'Returns true if the string contains only alphabetic characters or digits.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_code: "/^[\w\d]+$/.test(str)",
        original_code:  "str.isalnum()"
      },
      {
        name: 'isalpha',
        description: 'Returns true if the string contains only alphabetic characters or digits.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_code: "/^\w+$/.test(str)",
        original_code:  "str.isalpha()"
      },
      {
        name: 'isdigit',
        description: 'Returns true if the string contains only digits.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_code: "/^\d+$/.test(str)",
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
        sugar_enhancements: "Javascript's interpretation of \"whitespace\" may vary. Sugar consolidates this behavior on the String#trim method and uses this to test whitespace, so the Sugar's behavior here will be consistent in different environments.",
        js_code: "/^\s+$/.test(str)",
        sugar_code: "str.isBlank()",
        original_code:  "str.isspace()"
      },
      {
        name: 'join',
        description: 'Uses the string as a separator in the sequence passed, and performs a join on it. Strings in Python are also sequences so this works on them too.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        js_notes: 'Although Array#join exists, String#join does not, so a string will have to first be split into an array.',
        sugar_notes: 'The Sugar#chars method returns an array of each character in the string and is a bit more readable.',
        js_code: "seq.join(','); str.split('').join(',')",
        sugar_code: "str.chars().join(',')",
        original_code:  "','.join(seq)"
      },
      {
        name: 'len',
        description: 'Returns the length of the string.',
        js_notes: 'Javascript strings and arrays both have a %length% property on them natively.',
        js_compatibility: 0,
        sugar_compatibility: 0,
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
        sugar_code: "str.padRight('-', 50 - str.length)"
      },
      {
        name: 'lower',
        description: 'Returns a copy of the string with all characters in lower case.',
        js_compatibility: 2,
        sugar_compatibility: 0,
        original_code:  "str.lower()",
        js_code: "str.toLowerCase()"
      },
      {
        name: 'lstrip',
        description: 'Returns a copy of the string with all leading characters (whitespace by default) removed.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "str.lstrip(); str.lstrip('f')",
        js_code: "str.replace(/^\s+/, ''); str.replace(/^8+/, '')"
        sugar_code: "str.trimLeft(); str.remove(/^f+/);",
        sugar_enhancements: "Javascript's interpretation of \"whitespace\" may vary. Sugar consolidates this behavior in String#trimLeft so that behavior will be consistent in different environments.',
        ref: 'String/trimLeft'

      },
      {
        name: 'replace',
        description: 'Returns a copy of a string with all occurrences of a replaced with b.',
        js_compatibility: 2,
        sugar_compatibility: 0,
        js_code: "str.replace('is', 'was')",
        original_code:  "str.replace('is', 'was');"
      },
      {
        name: 'rfind',
        description: 'Returns the last index where a substring is found.',
        js_compatibility: 1,
        sugar_compatibility: 0,
        js_code: "str.lastIndexOf('h'); str.slice(2,6).lastIndexOf('h')",
        original_code:  "str.rfind('h'); str.rfind('h', 2, 6)"
      },
      {
        name: 'rindex',
        description: 'Determine if a string contains a substring and returns the index. Raises an error if it does not exist.',
        js_notes: 'Javascript will not raise the error if the substring does not exist but instead return -1.',
        js_compatibility: 1,
        sugar_compatibility: 0,
        js_code: "str.lastIndexOf('h'); str.slice(2,6).lastIndexOf('h')",
        original_code:  "str.rindex('h'); str.rindex('h', 2, 6)"
      },
      {
        name: 'rjust',
        description: 'Expands the string to a given length by padding it on the left.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "str.rjust(50, '-')",
        js_code: "var padded = str; while(padded.length < 50) { str = '-' + str }",
        sugar_code: "str.padLeft('-', 50 - str.length)"
      },
      {
        name: 'rstrip',
        description: 'Returns a copy of the string with all trailing characters (whitespace by default) removed.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "str.rstrip(); str.rstrip('f')",
        js_code: "str.replace(/^\s+/, ''); str.replace(/^8+/, '')"
        sugar_code: "str.trimRight(); str.remove(/^f+/);",
        sugar_enhancements: "Javascript's interpretation of \"whitespace\" may vary. Sugar consolidates this behavior in String#trimRight so that behavior will be consistent in different environments.',
        ref: 'String/trimRight'

      },
      {
        name: 'split',
        description: 'Splits a string based on a token (all whitespace by default). Optionally limits the number of splits.',
        js_notes: 'Although String#split in Javascript has a %limit% option, it exhibits different behavior by including only up to %limit% in the array, whereas Python will include the remainder of the string. If this behavior is needed a more complex workaround is required.',
        js_compatibility: 1,
        sugar_compatibility: 0,
        original_code:  "str.split(','); str.split()",
        js_code: "str.split(','); str.split(/\s+/)"
        sugar_enhancements: "String#split is known to have some inconsistent behavior when splitting on a regex, which Sugar fixes.',
        ref: 'String/split'

      },
      {
        name: 'splitlines',
        description: 'Splits a string into lines, optionally including the newline character.',
        js_notes: 'Although String#split in Javascript has a %limit% option, it exhibits different behavior by including only up to %limit% in the array, whereas Python will include the remainder of the string. If this behavior is needed a more complex workaround is required.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "str.splitlines();",
        js_code: "str.split(/\n/);"
        sugar_enhancements: "String#split is known to have some inconsistent behavior when splitting on a regex, which Sugar fixes.',
        ref: 'String/split'

      },
      {
        name: 'startsWith',
        description: 'Returns true if the string starts with a substring.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        js_code: "/^ing/.test(str); /^ing/.test(str.slice(2,6));",
        sugar_code: "str.startsWith('ing'); str.slice(2,6).startsWith('ing')",
        original_code:  "str.startsWith('ing'); str.startsWith('ing', 2, 6);"
        sugar_enhancements: 'Sugar can additionally specify case sensitivity (on by default).',
        ref: 'String/startsWith'
      },
      {
        name: 'strip',
        description: 'Returns a copy of the string with all leading and trailing characters (whitespace by default) removed.',
        js_compatibility: 1,
        sugar_compatibility: 0,
        original_code:  "str.strip(); str.strip('f')",
        js_code: "str.replace(/^\s+|\s+$/g, ''); str.replace(/^f+|f+$/g, '')"
        es5_code: 'str.trim();',
        sugar_code: "str.trim(); str.remove(/^f+|f+$/g);",
        sugar_enhancements: "Javascript's interpretation of \"whitespace\" may vary. Sugar consolidates this behavior in String#trim so that behavior will be consistent in different environments.',
        ref: 'String/trim'
      },
      {
        name: 'swapcase',
        description: 'Swaps all lowercase strings to uppercase, and uppercase to lowercase.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "str.swapcase();",
        js_code: "str.replace(/[a-z]/gi, function(m) { return m.match(/[a-z]/) ? m.toUpperCase() : m.toLowerCase(); });"
      },
      {
        name: 'title',
        description: 'Returns a copy of the string with all words capitalized.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "str.title();",
        js_code: "str.replace(/\b[a-z]/g, function(m){ return m.toUpperCase(); });"
        sugar_code: "str.capitalize(true);"
      },
      {
        name: 'upper',
        description: 'Returns a copy of the string with all characters in upper case.',
        js_compatibility: 2,
        sugar_compatibility: 0,
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
        sugar_code: "str.padLeft('0', 50 - str.length)"
      }
    ]
  },
  {
    type: 'class',
    namespace: 'Number',
    methods: [
      {
        name: 'abs',
        description: 'Returns the absolute value of the number.',
        js_compatibility: false,
        sugar_compatibility: false,
        original_code:  "abs(num)",
        js_code: "Math.abs(num)",
        sugar_code: "num.abs()"
      }
    ]
  }
];
