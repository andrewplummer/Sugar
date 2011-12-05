
//  Compatiblity index:
//
//  0 - Does not exist.
//  1 - Exists but does not support all functionality.
//  2 - Exists and supports all functionality.
//  3 - Exists and supports all functionality plus more.

var SugarRubyMethods = [
  {
    type: 'instance',
    namespace: 'String',
    methods: [
      {
        name: '<<',
        description: 'Appends to the end of the string.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code: "str << 'hello'",
        js_code: "str += 'hello';",
        js_notes: 'There is no %<<% operator in Javascript. Simply use the %+% string concatenation operator instead.'
      },
      {
        name: '<=>',
        description: 'Compares two strings.',
        js_compatibility: 0,
        original_code: "str1 <=> str2",
        js_code: "if(str1 == str2) return 0; else if(str1 < str2) return -1; else return 1;",
        js_notes: 'There are no comparison functions built in to Javascript, so straight comparison code needs to be used instead.'
      },
      {
        name: '=~',
        description: 'Performs a match on a RegExp.',
        js_compatibility: 2,
        original_code: "str =~ /[a-f]/",
        js_code: "str.match(/[a-f]/)"
      },
      {
        name: '[]',
        description: 'Returns a substring of the string.',
        js_compatibility: 1,
        sugar_compatibility: 1,
        original_code: "str[2]; str[1..2]; str[/[aeiou]+/]; str['lo'];",
        js_code: "str.charAt(2); str.slice(1,2); str.match(/[aeiou]/); str.match('lo');",
        js_notes: "Note that although Javascript does allow array-style access to strings (%[]%), this will break in IE8 and below, so it's best to use %charAt% instead. Sugar patches this method this and more with %at%. For a range of indexes, use %slice%. Javascript native %match% will return an array of matches instead of a substring, but will be %null% if there is no match, which can cause problems. Sugar's %each% method is essentially the same but will guarantee an empty array when no match occurs.",
        ref: 'String/at'
      },
      {
        name: '[]=',
        description: 'Replaces part of a string.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str[3] = 'h'",
        js_code: "str.slice(0,2) + 'h' + str.slice(4);",
        js_notes: "As Javascript string primitives are not passed by reference, changing an index of a string will not do anything. A new string instead needs to be concatenated together.",
        sugar_code: "str.insert('h',3);",
        sugar_notes: "%insert% allows a simple, readable syntax to concatenate a string inside another. This method is an alias of %add%, which does the same thing, but reads better when doing a simple concatenation on a string."
      },
      {
        name: '*',
        description: 'Returns a string repeated %n% times.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str * 3",
        js_code: "str + str + str",
        js_notes: "No such method exists in native Javascript, so straight concatenation or a for loop must be used.",
        sugar_code: "str.repeat(3)"
      },
      {
        name: '%',
        description: 'Uses the string as a format and applies an argument to it.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "'Hello Mr. %s' % name",
        js_code: "'Hello Mr. %s'.replace(/%s/, name);",
        js_notes: "No string formatting methods exist in Javascript, so RegExp replacement must be used here instead.",
        sugar_code: "'Hello Mr. {1}'.assign(name);",
        sugar_notes: "The %assign% method allows a variable to be insterted into a string via a simple format. Both named and numbers tokens are supported."
      },
      {
        name: '+',
        description: 'Concatenates one string to another.',
        js_compatibility: 2,
        original_code: "str + 'hello'",
        js_code: "str + 'hello';"
      },
      {
        name: 'bytes',
        description: 'Passes each byte into a block and returns an enumerable.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.bytes; str.bytes { |byte| }",
        js_code: "for(var i = 0; i < str.length; i++) { str.charCodeAt(i); }",
        sugar_code: "str.codes(); str.codes(function(code){ });",
        ref: 'String/codes'
      },
      {
        name: 'capitalize',
        description: 'Returns a copy of the string with the first character in upper case an the rest in lower case.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code: "str.capitalize",
        js_code: "str = str.slice(0,1).toUpperCase() + str.slice(1).toLowerCase();",
        sugar_code: "str.capitalize();",
        sugar_enhancements: "Sugar can also optionally capitalize all words in the string."
      },
      {
        name: 'center',
        description: 'Centers the string to a given length by padding it.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        js_code: "while(str.length < 8) { str = str.length % 2 == 0 ? '-' + str : str + '-'; }",
        sugar_code: "str.pad('-', (8 - str.length) / 2);",
        original_code: "str.center(8, '-');",
        ref: 'String/pad'
      },
      {
        name: 'chars',
        description: 'Returns an enumerable with all characters in the string passing them to an optional block.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.chars; str.chars { |char| }",
        js_code: "for(var i = 0; i < str.length; i++) { str.charAt(i); }",
        sugar_code: "str.chars(); str.chars(function(ch){ });",
        ref: 'String/chars'
      },
      {
        name: 'chomp',
        description: 'Returns a string with carriage return characters at the end of the string removed.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code: "str.chomp",
        js_code: "str.replace(/\r?\n$/m, '')",
      },
      {
        name: 'chop',
        description: 'Returns a string with the last character removed.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code: "str.chop",
        js_code: "str.replace(/\r?[\s\S]$/m, '')",
      },
      {
        name: 'count',
        description: 'Counts the number of occurrences of each character within a substring in the string.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code: "str.count('lo')",
        js_code: "var match; match = str.match(/[lo]/g); return match ? match.length : 0;",
        js_notes: 'String#match will return %null% if no match is made, which will throw an error when getting the length, so an extra step is needed here.',
        sugar_code: "str.each(/[lo]/g).length;",
        sugar_notes: 'In addition to running a callback on each match, String#each in Sugar will always return an array of matches which can be leveraged here.',
        ref: 'String/each'
      },
      {
        name: 'delete',
        description: 'Returns a copy of the string with the intersection of its arguments deleted.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code: "str.delete('lo')",
        js_code: "str.replace(/[lo]/g, '')",
        sugar_code: "str.remove(/[lo]/g);",
        ref: 'String/remove'
      },
      {
        name: 'downcase',
        description: 'Returns a copy of the string with all upper case letters converted to lower case.',
        js_compatibility: 2,
        original_code: "str.downcase",
        js_code: "str.toLowerCase()"
      },
      {
        name: 'each_byte',
        description: 'Passes each byte into a block and returns an enumerable.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.each_byte { |byte| }",
        js_code: "for(var i = 0; i < str.length; i++) { str.charCodeAt(i); }",
        sugar_code: "str.codes(function(code){ });",
        ref: 'String/codes'
      },
      {
        name: 'each_char',
        description: 'Returns an enumerable with all characters in the string passing them to an optional block.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.each_char { |char| }",
        js_code: "for(var i = 0; i < str.length; i++) { str.charAt(i); }",
        sugar_code: "str.chars(function(ch){ });",
        ref: 'String/chars'
      },
      {
        name: 'each_line',
        description: 'Passes each line of a string into a block.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.each_line { |line| }",
        js_code: "var lines = str.split('\n'); for(var i = 0; i < lines.length; i++) { }",
        sugar_code: "str.lines(function(line){ });",
        ref: 'String/lines'
      },
      {
        name: 'empty?',
        description: 'Returns true if string has a length of 0.',
        js_compatibility: 0,
        original_code: "str.empty?",
        js_code: "str === ''"
      },
      {
        name: 'end_with?',
        description: 'Returns true if the string ends with the passed substring.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code: "str.end_with?('h')",
        js_code: "/h$/.test(str)",
        sugar_code: "str.endsWith('h')",
        sugar_enhancements: "Sugar can also optionally turn off case sensitivity."
      },
      {
        name: 'gsub',
        description: 'Replaces a pattern in a string with another pattern.',
        js_compatibility: 2,
        original_code: "str.gsub('foo', 'bar'); str.gsub!('foo', 'bar');",
        js_code: "str.replace(/foo/g, 'bar'); str = str.replace(/foo/g, 'bar');",
        js_notes: "For global substitutions in Javascript, simply set the global flag. Javascript strings are never passed by reference so there is no %gsub!% method, simply set the reference."
      },
      {
        name: 'hex',
        description: 'Treats the string as a hexadecimal digit and returns a decimal number.',
        js_compatibility: 2,
        original_code: "str.hex",
        js_code: "parseInt(str, 16)",
      },
      {
        name: 'include?',
        description: 'Returns true if the string contains the passed substring.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code: "str.include?('foo')",
        js_code: "!!str.match('foo')",
        sugar_code: "str.has('foo')",
        ref: 'String/has'
      },
      {
        name: 'index',
        description: 'Returns the index of the first occurrence of the passed substring within the string. Returns nil if not found.',
        js_compatibility: 1,
        original_code: "str.index('foo')",
        js_code: "str.search('foo')",
        js_notes: "Note that Javascript native %search% returns %-1% if the pattern is not found."
      },
      {
        name: 'insert',
        description: 'Inserts a substring inside the string at the given index (may be negative).',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.insert(2, 'c')",
        js_code: "str.slice(0,2) + 'c' + str.slice(2);",
        sugar_code: "str.insert('c', 2);",
        ref: 'String/insert'
      },
      {
        name: 'lines',
        description: 'Passes each line of a string into a block.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.lines; str.lines { |line| }",
        js_code: "var lines = str.split('\n'); for(var i = 0; i < lines.length; i++) { }",
        sugar_code: "str.lines(); str.lines(function(line){ });",
        ref: 'String/lines'
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
        name: 'lstrip',
        description: 'Returns a copy of the string with all leading characters removed.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "str.lstrip();",
        js_code: "str.replace(/^\s+/, '');",
        sugar_code: "str.trimLeft();",
        sugar_enhancements: "Javascript's interpretation of \"whitespace\" may vary. Sugar consolidates this behavior in String#trimLeft so that behavior will be consistent in different environments.",
        ref: 'String/trimLeft'

      },
      {
        name: 'match',
        description: "Converts the passed argument to a Regexp if it isn't already, and invokes it against the string, returning the match data.",
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "str.match(/foo/); str.match(/foo/) { |m| }",
        js_code: "str.match(/foo/);",
        sugar_code: "str.each(/foo/, function(m) {});",
        sugar_notes: "Sugar's String#each function will additionally run a callback if a match is made, and more closely matches Ruby's %match% method"
      },
      {
        name: 'oct',
        description: 'Treats the string as a octal digit and returns a decimal number.',
        js_compatibility: 2,
        original_code: "str.oct",
        js_code: "parseInt(str, 8)",
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
        name: 'partition',
        description: 'Finds the pattern in the string and returns the part before it, the match, and the part after it.',
        js_compatibility: 0,
        original_code:  "part = str.partition('l')",
        js_code: "var part, match = str.match(/^(.*?)(l)(.*)$/); part = match ? match.slice(1) : [str, '', ''];"
      },
      {
        name: 'replace',
        description: 'Replaces the content of the string with another.',
        js_compatibility: 0,
        original_code:  "str.replace('new string')",
        js_code: "str = 'new string';",
        js_notes: "Javascript strings are not passed by reference, so simply set the variable to a new string. %replace% in Javascript is instead the same as %gsub%."
      },
      {
        name: 'reverse',
        description: 'Reverses the string.',
        js_compatibility: 2,
        original_code:  "str.reverse()",
        js_code: "str.reverse()"
      },
      {
        name: 'rindex',
        description: 'Determine if a string contains a substring and returns the index. Returns nil if the substring does not exist.',
        js_notes: 'Javascript will return -1 if the substring does not exist.',
        js_compatibility: 1,
        original_code:  "str.rindex('h');",
        js_code: "str.lastIndexOf('h');"
      },
      {
        name: 'rjust',
        description: 'Expands the string to a given length by padding it on the left.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "str.rjust(50, '-')",
        js_code: "var padded = str; while(padded.length < 50) { str += '-' }",
        sugar_code: "str.padLeft('-', 50 - str.length)"
      },
      {
        name: 'rpartition',
        description: 'Finds the last pattern in the string and returns the part before it, the match, and the part after it.',
        js_compatibility: 0,
        original_code:  "part = str.rpartition('l')",
        js_code: "var part, match = str.match(/^(.*)(l)(.*)$/); part = match ? match.slice(1) : [str, '', ''];"
      },
      {
        name: 'rstrip',
        description: 'Returns a copy of the string with all leading characters removed.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "str.rstrip();",
        js_code: "str.replace(/^\s+/, '');",
        sugar_code: "str.trimRight();",
        sugar_enhancements: "Javascript's interpretation of \"whitespace\" may vary. Sugar consolidates this behavior in String#trimRight so that behavior will be consistent in different environments.",
        ref: 'String/trimRight'
      },
      {
        name: 'scan',
        description: "Iterates over the string matching the passed regex pattern against it. Returns an array of matches and runs an optional block against each match.",
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "str.scan(/foo/); str.scan(/foo/) { |m| }",
        js_code: "str.scan(/foo/);",
        js_notes: "%scan% in Javascript is simply a matter of adding a global flag to the regex passed for %match%.",
        sugar_code: "str.each(/foo/, function(m) {});",
        sugar_notes: "Sugar's String#each function will additionally run a callback if a match is made, and more closely matches Ruby's %scan% method"
      },
      {
        name: 'size',
        description: "Returns the length of the string.",
        js_compatibility: 2,
        original_code:  "str.size()",
        js_code: "str.length;"
      },
      {
        name: 'slice',
        description: "Returns a slice of the string at the given indexes.",
        js_compatibility: 2,
        original_code:  "str.slice(1,3)",
        js_code: "str.slice(1,3);"
      },
      {
        name: 'split',
        description: "Splits the string into an array on a delimiter token (can be a regexp).",
        js_compatibility: 1,
        original_code:  "str.split(','); str.split(/(?=f)/);",
        js_code: "str.split(',');",
        sugar_code: "str.split(/(?=f)/);",
        sugar_notes: "Although Javascript can split on RegExps natively the results can be unpredictable across browsers. Sugar patches this method to provide consistent results here."
      },
      {
        name: 'squeeze',
        description: 'Returns a new string that has certain repeating characters "squeezed" into one, whitespace by default.',
        js_compatibility: 0,
        original_code:  "str.squeeze()",
        js_code: "str.replace(/(\S)(\s)*/, '$1$2')",
        sugar_code: "str.compact();"
      },
      {
        name: 'start_with?',
        description: 'Returns true if the string starts with the passed substring.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code: "str.start_with?('h')",
        js_code: "/h$/.test(str)",
        sugar_code: "str.startsWith('h')",
        sugar_enhancements: "Sugar can also optionally turn off case sensitivity."
      },
      {
        name: 'strip',
        description: 'Returns a copy of the string with all leading and trailing characters removed.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "str.strip();",
        js_code: "str.replace(/^\s+/, '');",
        es5_code: "str.trim();",
        sugar_code: "str.trim();",
        sugar_enhancements: "Javascript's interpretation of \"whitespace\" may vary. Sugar consolidates this behavior in String#trim so that behavior will be consistent in different environments.",
        ref: 'String/trim'

      },
      {
        name: 'sub',
        description: 'Replaces a pattern in a string with another pattern.',
        js_compatibility: 2,
        original_code: "str.sub(/foo/, 'bar'); str.sub!(/foo/, 'bar');",
        js_code: "str.replace(/foo/, 'bar'); str = str.replace(/foo/, 'bar');",
        js_notes: "For non-global substitutions in Javascript, simply do not set the global flat. Javascript strings are never passed by reference so there is no %sub!% method, simply set the reference."
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
        name: 'to_f',
        description: 'Interprets the leading characters of the string as a floating point number.',
        js_compatibility: 2,
        original_code:  "str.to_f",
        js_code: "parseFloat(str);",
        sugar_code: "str.toNumber();",
        sugar_notes: "Sugar provides some simple syntax sugar here."
      },
      {
        name: 'to_i',
        description: 'Interprets the leading characters of the string as an integer.',
        js_compatibility: 2,
        original_code:  "str.to_i",
        js_code: "parseInt(str);",
        sugar_code: "str.toNumber();",
        sugar_notes: "Sugar provides some simple syntax sugar here."
      },
      {
        name: 'to_s',
        description: 'String simply returns itself.',
        js_compatibility: 2,
        original_code:  "str.to_s",
        js_code: "str.toString();"
      },
      {
        name: 'to_str',
        description: 'String simply returns itself.',
        js_compatibility: 2,
        original_code:  "str.to_str",
        js_code: "str.toString();"
      },
      {
        name: 'to_sym',
        description: 'Returns the symbol corresponding to the string.',
        js_compatibility: 0,
        original_code:  "str.to_sym",
        js_code: "str",
        js_notes: "Javascript doesn't have symbols, baby! Only strings..."
      },
      {
        name: 'tr',
        description: 'Returns a copy of the string with the characters in the first argument replaced with the corresponding characters in the second argument.',
        js_compatibility: 1,
        original_code:  "str.tr('aeiou', '*'); str.tr('el', 'ip');",
        js_code: "str.replace(/[aeiou]/, '*'); str.replace(/[el]/, function(m){ return m == 'e' ? 'i' : 'p'; });",
        js_notes: "Duplicating the exact functionality of %tr% depends on different syntaxes. Creative use of %replace% is recommended for most cases."
      },
      {
        name: 'upcase',
        description: 'Returns a copy of the string with all lower case letters converted to upper case.',
        js_compatibility: 2,
        original_code: "str.upcase",
        js_code: "str.toUpperCase()"
      },
      // Begin rails methods
      {
        name: 'at',
        description: 'Returns the character at the passed index.',
        js_compatibility: 1,
        sugar_compatibility: 3,
        original_code: "str.at(1)",
        js_code: "str.slice(0,1);",
        sugar_code: "str.at(1);",
        sugar_notes: "Sugar's %at% method has some enhanced functionality including passing multiple indexes as well as looping past the end of the index range to allow cycling through the string."
      },
      {
        name: 'blank?',
        description: 'Returns true if the string contains only whitespace.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.blank?",
        js_code: "str.replace(/\s/g, '').length === 0;",
        es5_code: "str.trim().length === 0",
        js_notes: "Javascript's interpretation of \"whitespace\" may vary. Sugar consolidates this behavior in String#trimLeft so that behavior will be consistent in different environments.",
        sugar_code: "str.isBlank();",
      },
      {
        name: 'camelize',
        description: 'Converts strings to camel case (first letter is upper case by default).',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.camelize; str.camelize(:lower);",
        sugar_code: "str.camelize(); str.camelize(false);",
        sugar_notes: "Sugar also camelizes dasherized strings."
      },
      {
        name: 'dasherize',
        description: 'Replaces underscores with dashes in the string.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.dasherize;",
        sugar_code: "str.dasherize();",
        sugar_notes: "Note that Sugar also dasherizes camelized strings."
      },
      {
        name: 'first',
        description: 'Returns the first n characters of the string (1 by default).',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.first;",
        js_code: "str.slice(0,1);",
        sugar_code: "str.first();"
      },
      {
        name: 'from',
        description: 'Returns the remainder of the string from the passed index.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.from(3);",
        js_code: "str.slice(3);",
        sugar_code: "str.from(3);"
      },
      {
        name: 'humanize',
        description: 'Creates prettified, human-readable output.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.humanize",
        sugar_code: "str.spacify().capitalize(true);",
        sugar_notes: "A similar effect can be achieved by converting underscores and dashes to spaces (%spacify%), then capitalizing the string (%capitalize%)."
      },
      {
        name: 'last',
        description: 'Returns the last n characters of the string (1 by default).',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.last(3)",
        js_code: "str.slice(-3);",
        sugar_code: "str.last(3);"
      },
      {
        name: 'parameterize',
        description: 'Swaps out special characters in a string so that it maybe used in a pretty URL.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code: "str.parameterize",
        js_code: "str.replace(/\W+/, function(match, index, str) { return index + match.length == str.length ? '' : '-';  });"
      },
      {
        name: 'squish',
        description: 'Removes all whitespace on the ends of the string and compacts consecutive whitespace group into a single space.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.squish",
        sugar_code: "str.compact()"
      },
      {
        name: 'titleize',
        description: 'Capitalizes all words in the string.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.titleize",
        sugar_code: "str.capitalize(true)"
      },
      {
        name: 'to',
        description: 'Returns the beginning of the string up to the passed index.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.to(3);",
        js_code: "str.slice(0,3);",
        sugar_code: "str.to(3);"
      },
      {
        name: 'to_date',
        description: 'Converts the string into a date.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.to_date",
        sugar_code: "str.toDate();"
      },
      {
        name: 'truncate',
        description: 'Truncates the string if it is longer than a given length.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.truncate",
        sugar_code: "str.truncate();",
        sugar_notes: "Sugar will not split words by default."
      },
      {
        name: 'underscore',
        description: 'Replaces camel case and dasherized text with underscores.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.underscore",
        sugar_code: "str.underscore();"
      },
    ]
  },
  {
    type: 'instance',
    namespace: 'Numeric',
    methods: [
      {
        name: '<=>',
        description: 'Compares two numbers.',
        js_compatibility: 0,
        original_code: "num1 <=> num2",
        js_code: "num1 - num2",
        js_notes: 'There are no comparison functions built in to Javascript, so straight comparison code needs to be used instead. For numbers, this can be a straight subtraction operation.'
      },
      {
        name: '**',
        description: 'Raises the number to the specified power.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num ** 5",
        js_code: "Math.pow(num, 5);",
        sugar_code: "(num).pow(5);",
        ref: 'Number/pow'
      },
      {
        name: 'abs',
        description: 'Returns the absolute value of the number.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num.abs",
        js_code: "Math.abs(num);",
        sugar_code: "num.abs();"
      },
      {
        name: 'ago',
        description: 'Shortcut for creating a time from a number that represents seconds ago.',
        sugar_compatibility: 2,
        original_code: "num.days.ago",
        sugar_code: "num.daysAgo();",
        sugar_notes: "Javascript, which requires parentheses doesn't read as neatly as Ruby, so each %ago% method is mapped with its individual unit for better readability. Additionally Javascript's date objects are based in milliseconds, making %millisecondsAgo% the Sugar equivalent to ActiveSupport to %ago%."
      },
      {
        name: 'chr',
        description: 'Returns a character at the code point of the number.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num.chr",
        js_code: "String.fromCharCode();",
        sugar_code: "num.chr();"
      },
      {
        name: 'ceil',
        description: 'Rounds the number up.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num.ceil",
        js_code: "Math.ceil(num);",
        sugar_code: "(num).ceil();"
      },
      {
        name: 'days',
        description: 'Allows time calculations by taking the number as days and returing seconds.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num.days",
        sugar_code: "num.days();",
        sugar_notes: "Sugar uses milliseconds as the base, as all Javascript times are derived from milliseconds. %day% is also available."
      },
      {
        name: 'downto',
        description: 'Runs a block decreasing the passed value from the number down to the passed number.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "5.downto(2)",
        js_code: "for(var i = 5; i >= 2; i--) { fn(i); }",
        sugar_code: "(5).downto(2, fn);"
      },
      {
        name: 'even?',
        description: 'Returns true if the number is even.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num.even?",
        js_code: "num % 2 == 0;",
        sugar_code: "num.isEven();"
      },
      {
        name: 'floor',
        description: 'Rounds the number up.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num.floor",
        js_code: "Math.floor(num);",
        sugar_code: "(num).floor();"
      },
      {
        name: 'fromNow',
        description: 'Shortcut for creating a time from a number that represents seconds from now.',
        sugar_compatibility: 2,
        original_code: "num.days.from_now",
        sugar_code: "num.daysFromNow();",
        sugar_notes: "Javascript, which requires parentheses doesn't read as neatly as Ruby, so each %from_now% method is mapped with its individual unit for better readability. Additionally Javascript's date objects are based in milliseconds, making %millisecondsFromNow% the Sugar equivalent to ActiveSupport to %from_now%."
      },
      {
        name: 'hours',
        description: 'Allows time calculations by taking the number as hours and returing seconds.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num.hours",
        sugar_code: "num.hours();",
        sugar_notes: "Sugar uses milliseconds as the base, as all Javascript times are derived from milliseconds. %hour% is also available."
      },
      {
        name: 'minutes',
        description: 'Allows time calculations by taking the number as minutes and returing seconds.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num.minutes",
        sugar_code: "num.minutes();",
        sugar_notes: "Sugar uses milliseconds as the base, as all Javascript times are derived from milliseconds. %minute% is also available."
      },
      {
        name: 'months',
        description: 'Allows time calculations by taking the number as months and returing seconds.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num.months",
        sugar_code: "num.months();",
        sugar_notes: "Sugar uses milliseconds as the base, as all Javascript times are derived from milliseconds. %month% is also available."
      },
      {
        name: 'multiple_of?',
        description: 'Checks if the number is evenly divisible by the argument.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num1.multiple_of?(num2)",
        js_code: "num1 % num2 == 0;",
        sugar_code: "num1.multipleOf(num2);"
      },
      {
        name: 'nan?',
        description: 'Returns true if the number is invalid.',
        js_compatibility: 2,
        original_code: "num.nan?",
        js_code: "isNaN(num);"
      },
      {
        name: 'odd?',
        description: 'Returns true if the number is odd.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num.odd?",
        js_code: "num % 2 == 1;",
        sugar_code: "num.isOdd();"
      },
      {
        name: 'ordinalize',
        description: 'Converts the number into an ordinalized English string denoting position.',
        sugar_compatibility: 2,
        original_code: "num.ordinalize",
        sugar_code: "num.ordinalize();"
      },
      {
        name: 'round',
        description: 'Rounds the number.',
        js_compatibility: 0,
        original_code: "num.round; num.round(2)",
        js_code: "Math.round(num); Math.round(num * 100) / 100;",
        js_notes: "Native Javascript does not allow for precision in rounding.",
        sugar_code: "num.round(); num.round(2);"
      },
      {
        name: 'seconds',
        description: 'Allows time calculations by taking the number as seconds and returing seconds.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num.seconds",
        sugar_code: "num.seconds();",
        sugar_notes: "Sugar uses milliseconds as the base, as all Javascript times are derived from milliseconds. %second% is also available."
      },
      {
        name: 'since',
        description: 'Shortcut for creating a time from a number that represents seconds since a certain other time.',
        sugar_compatibility: 2,
        original_code: "num.minutes.since(time)",
        sugar_code: "num.minutesSince(time);",
        sugar_notes: "Javascript, which requires parentheses doesn't read as neatly as Ruby, so each %since% method is mapped with its individual unit for better readability. Additionally Javascript's date objects are based in milliseconds, making %millisecondsSince% the Sugar equivalent to ActiveSupport to %since%."
      },
      {
        name: 'step',
        description: 'Runs a block stepping from the number to the passed value in multiples of the step value passed.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code: "1.step(10, 2)",
        js_code: "for(var i = 1; i <= 10; i += 2) { fn(i); }",
        sugar_code: "(1).upto(10, fn, 2);"
      },
      {
        name: 'times',
        description: 'Runs a block n number of times, where n is equal to the number.',
        sugar_compatibility: 0,
        js_compatibility: 2,
        original_code: "num.times { |n| }",
        js_code: "for(var i = 0; i < num; i++) { fn(i); }",
        sugar_code: "num.times(fn)",
      },
      {
        name: 'to_s',
        description: 'Converts the number to a string.',
        js_compatibility: 2,
        original_code: "num.to_s",
        js_code: "num.toString()",
        js_notes: "The second parameter to %toString% is the radix to use when converting the number to a string.",
      },
      {
        name: 'until',
        description: 'Shortcut for creating a time from a number that represents seconds until a certain other time.',
        sugar_compatibility: 2,
        original_code: "num.minutes.until(time)",
        sugar_code: "num.minutesUntil(time);",
        sugar_notes: "Javascript, which requires parentheses doesn't read as neatly as Ruby, so each %until% method is mapped with its individual unit for better readability. Additionally Javascript's date objects are based in milliseconds, making %millisecondsUntil% the Sugar equivalent to ActiveSupport to %until%."
      },
      {
        name: 'upto',
        description: 'Runs a block increasing the passed value from the number up to the passed number.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "2.upto(5)",
        js_code: "for(var i = 2; i <= 5; i++) { fn(i); }",
        sugar_code: "(2).upto(5, fn);"
      },
      {
        name: 'weeks',
        description: 'Allows time calculations by taking the number as weeks and returing seconds.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num.weeks",
        sugar_code: "num.weeks();",
        sugar_notes: "Sugar uses milliseconds as the base, as all Javascript times are derived from milliseconds. %week% is also available."
      },
      {
        name: 'years',
        description: 'Allows time calculations by taking the number as years and returing seconds.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "num.years",
        sugar_code: "num.years();",
        sugar_notes: "Sugar uses milliseconds as the base, as all Javascript times are derived from milliseconds. %year% is also available."
      },
    ]
  },
  {
    type: 'instance',
    namespace: 'Enumerable',
    methods: [
      {
        name: 'all?',
        description: 'Returns true if all elements in the iterable are true',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "arr.all? { |el| el == 8 }",
        js_code: "for(var i = 0; i < arr.length; i++) { if(arr[i] != 8) { return false; } } return true;",
        es5_code: "arr.every(function(el) { return el == 8; });",
        sugar_code: "arr.all(function(el) { return el == 8; });",
        sugar_enhancements: 'Sugar additionally allows strings that will resolve to a function returning a property of that name.',
        ref: 'Array/all'
      },
      {
        name: 'any?',
        description: 'Returns true if all elements in the iterable are true',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "arr.any? { |el| el == 8 }",
        js_code: "for(var i = 0; i < arr.length; i++) { if(arr[i] == 8) { return true; } } return false;",
        es5_code: "arr.some(function(el) { return el == 8; });",
        sugar_code: "arr.any(function(el) { return el == 8; });",
        sugar_enhancements: 'Sugar additionally allows strings that will resolve to a function returning a property of that name.',
        ref: 'Array/all'
      },
      {
        name: 'collect',
        description: 'Creates an array from another via a mapping function.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.collect { |x| x * 3 }",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { result.push(arr[i] * 3); } return result;",
        es5_code: "arr.map(function(el) { return el * 3; });",
        sugar_code: "arr.map(function(el) { return el * 3; });",
        sugar_enhancements: "Sugar enhances the %map% method to allow a string shortcut.",
        ref: 'Array/map'
      },
      {
        name: 'count',
        description: 'Returns the number of occurrences in the array where either the passed argument exists or the block returns true.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "arr.count { |n| n == 3 }",
        js_code: "var result = 0; for(var i = 0; i < arr.length; i++) { if(n == 3) result ++; } return result;",
        sugar_code: "arr.count(function(n){ return n == 3; })",
        ref: 'Array/count'
      },
      {
        name: 'cycle',
        description: 'Calls a block on each element of the enumberable n times, where n is the number passed.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "arr.cycle(100) { |x| puts x }",
        js_code: "for(var i = 0; i < 100; i++) { console.log(arr[i % arr.length]); };",
        sugar_code: "(100).times(function(n){ console.log(arr.at(n)); });",
        ref: 'Array/at'
      },
      {
        name: 'detect',
        description: 'Returns the first element for which the block is not false.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.detect { |n| n % 3 == 0 }",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { if(arr[i] % 3 == 0) { return arr[i]; } };",
        sugar_code: "arr.find(function(el) { return el % 3 == 0; });",
        sugar_enhancements: "Sugar's %find% method has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
        ref: 'Array/find'
      },
      {
        name: 'drop',
        description: 'Drops the first n elements of the array and returns the rest.',
        js_compatibility: 1,
        sugar_compatibility: 3,
        original_code:  "arr.drop(3)",
        js_code: "arr.slice(3);",
        sugar_code: "arr.from(3);",
        ref: 'Array/from'
      },
      {
        name: 'drop_while',
        description: 'Drops elements up to, but not including, the first element for which the block returns nil or false.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "arr.drop_while { |n| n < 5 }",
        js_code: "var result; for(var i = 0; i < arr.length; i++) { if(arr[i] >= 5) { result = arr.slice(i); break; } }; return result;",
        sugar_code: "var drop = true; arr.remove(function(n) { if(n < 5) { return drop; } else { return drop = false; }});",
        ref: 'Array/remove'
      },
      {
        name: 'each_cons',
        description: 'Iterates the block for each consecutive array of n elements.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "arr.each_cons(3, &fn)",
        js_code: "for(var i = 0; i < arr.length; i++) { var slice = arr.slice(i, i + 3); if(slice.length == 3) { fn(slice); }};",
        sugar_code: "arr.each(function() { var slice = arr.slice(i, i + 3); if(slice.length == 3) { fn(slice); }});",
        ref: 'Array/each'
      },
      {
        name: 'each_slice',
        description: 'Iterates the block for each slice of n elements.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "arr.each_slice(3, &fn)",
        js_code: "for(var i = 0; i < arr.length; i += n) { fn(arr.slice(i, i + n)); };",
        sugar_code: "arr.inGroupsOf(3).each(fn);",
        sugar_notes: "Sugar will pad each group (%null% by default) to always be n elements.",
        ref: 'Array/inGroupsOf'
      },
      {
        name: 'each_with_index',
        description: 'Calls a block with two arguments, the element and its index for each element.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "arr.each_with_index(&fn)",
        js_code: "for(var i = 0; i < arr.length; i ++) { fn(arr[i], i); };",
        es5_code: "arr.forEach(fn);",
        sugar_code: "arr.each(fn);",
        sugar_enhancements: "Sugar's %each% method has a few enhancements including starting from an index, looping past the end of the array, and the ability to handle sparse arrays.",
        ref: 'Array/each'
      },
      {
        name: 'find',
        description: 'Returns the first element for which the block is not false.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.find { |n| n % 3 == 0 }",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { if(arr[i] % 3 == 0) { return arr[i]; } };",
        sugar_code: "arr.find(function(el) { return el % 3 == 0; });",
        sugar_enhancements: "Sugar's %find% method has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
        ref: 'Array/find'
      },
      {
        name: 'find_all',
        description: 'Returns an array containing all elements for which the block is not false.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.find_all { |n| n % 3 == 0 }",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { if(arr[i] % 3 == 0) { result.push(arr[i]); } } return result;",
        es5_code: "arr.filter(function(el) { return el % 3 == 0; });",
        sugar_code: "arr.findAll(function(el) { return el % 3 == 0; });",
        sugar_enhancements: "Sugar's %findAll% method has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
        ref: 'Array/findAll'
      },
      {
        name: 'first',
        description: 'Returns the first n elements of the array (1 by default).',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "arr.first;",
        js_code: "arr.slice(0,1);",
        sugar_code: "arr.first();"
      },
      {
        name: 'map',
        description: 'Creates an array from another via a mapping function.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.map { |x| x * 3 }",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { result.push(arr[i] * 3); } return result;",
        es5_code: "arr.map(function(el) { return el * 3; });",
        sugar_code: "arr.map(function(el) { return el * 3; });",
        sugar_enhancements: "Sugar enhances the %map% method to allow a string shortcut.",
        ref: 'Array/map'
      },
      {
        name: 'select',
        description: 'Returns an array containing all elements for which the block is not false.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.select { |n| n % 3 == 0 }",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { if(arr[i] % 3 == 0) { result.push(arr[i]); } } return result;",
        es5_code: "arr.filter(function(el) { return el % 3 == 0; });",
        sugar_code: "arr.findAll(function(el) { return el % 3 == 0; });",
        sugar_enhancements: "Sugar's %findAll% method has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
        ref: 'Array/findAll'
      },
    ]
  }
];
