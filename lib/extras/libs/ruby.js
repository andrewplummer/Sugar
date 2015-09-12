
//  Compatibility index:
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
        js_notes: "Note that although Javascript does allow array-style access to strings (%[]%), this will break in IE8 and below, so it's best to use %charAt% instead. Sugar addresses this and more with %at%. For a range of indexes, use %slice%. Javascript native %match% will return an array of matches instead of a substring, but will be %null% if there is no match, which can cause problems. Sugar's %each% method is essentially the same but will guarantee an empty array when no match occurs.",
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
        description: 'Passes each byte into a block and returns an array.',
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
        js_code: "var first = str.slice(0,1).toUpperCase(); var rest = str.slice(1).toLowerCase(); str = first + rest;",
        sugar_code: "str.capitalize();",
        sugar_enhancements: "Sugar can also optionally capitalize all words in the string."
      },
      {
        name: 'center',
        description: 'Centers the string to a given length by padding it.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        js_code: "while(str.length < 8) { str = str.length % 2 == 0 ? '-' + str : str + '-'; }",
        sugar_code: "str.pad(8, '-');",
        original_code: "str.center(8, '-');",
        ref: 'String/pad'
      },
      {
        name: 'chars',
        description: 'Returns an array with all characters in the string passing them to an optional block.',
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
        js_code: "str.replace(/\\r?\\n$/m, '')",
      },
      {
        name: 'chop',
        description: 'Returns a string with the last character removed.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code: "str.chop",
        js_code: "str.replace(/\\r?[\\s\\S]$/m, '')",
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
        description: 'Passes each byte into a block and returns an array.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.each_byte { |byte| }",
        js_code: "for(var i = 0; i < str.length; i++) { str.charCodeAt(i); }",
        sugar_code: "str.codes(function(code){ });",
        ref: 'String/codes'
      },
      {
        name: 'each_char',
        description: 'Returns an array with all characters in the string passing them to an optional block.',
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
        description: 'Returns true if the string has a length of 0.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code: "str.empty?",
        js_code: "str === ''",
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
        sugar_code: "str.padRight(50, '-')"
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
        sugar_notes: "String#each will additionally run a callback if a match is made, and more closely matches Ruby's %match% method"
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
        js_notes: "Javascript strings are not passed by reference, so simply set the variable to a new string. %replace% in Javascript is instead similar to %gsub%."
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
        sugar_code: "str.padLeft(50, '-')"
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
        sugar_notes: "String#each will additionally run a callback if a match is made, and more closely matches Ruby's %scan% method"
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
        sugar_notes: "Although Javascript can split on RegExps natively the results can be unpredictable across browsers."
      },
      {
        name: 'squeeze',
        description: 'Returns a new string that has certain repeating characters "squeezed" into one, whitespace by default.',
        js_compatibility: 0,
        original_code:  "str.squeeze()",
        js_code: "str.replace(/(\s)+/g, '$1')",
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
        js_notes: "For non-global substitutions in Javascript, simply do not set the global flag. Javascript strings are never passed by reference so there is no %sub!% method, simply set the reference."
      },
      {
        name: 'swapcase',
        description: 'Swaps all lowercase strings to uppercase, and uppercase to lowercase.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "str.swapcase();",
        js_code: "str.replace(/[a-z]/gi, function(m) { var match = m.match(/[a-z]/); match ? m.toUpperCase() : m.toLowerCase(); });"
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
        sugar_notes: "%at% has some enhanced functionality including passing multiple indexes as well as looping past the end of the index range to allow cycling through the string."
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
        sugar_code: "str.from(3);",
        ref: 'String/from'
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
        sugar_compatibility: 2,
        original_code: "str.parameterize",
        js_code: "str.replace(/\W+/, function(match, index, str) { return index + match.length == str.length ? '' : '-';  });",
        sugar_code: "str.parameterize()"
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
        sugar_code: "Date.create(str);"
      },
      {
        name: 'truncate',
        description: 'Truncates the string if it is longer than a given length.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str.truncate(30)",
        sugar_code: "str.truncate(30);",
        sugar_notes: "Sugar also has %String#truncateOnWord% which will not split words apart."
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
        sugar_code: "num1.isMultipleOf(num2);"
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
        name: 'detect',
        description: 'Returns the first element for which the block is not false.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.detect { |n| n % 3 == 0 }",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { if(arr[i] % 3 == 0) { return arr[i]; } };",
        sugar_code: "arr.find(function(el) { return el % 3 == 0; });",
        sugar_enhancements: "%find% has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
        ref: 'Array/find'
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
        sugar_enhancements: "%each% has a few enhancements including starting from an index, looping past the end of the array, and the ability to handle sparse arrays.",
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
        sugar_enhancements: "%find% has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
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
        sugar_enhancements: "%findAll% has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
        ref: 'Array/findAll'
      },
      {
        name: 'grep',
        description: 'Returns an array containing all elements for which the pattern matches.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.grep(/id/)",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { if(arr[i].match(/id/)) { result.push(arr[i]); } } return result;",
        es5_code: "arr.filter(function(el) { return el.match(/id/); });",
        sugar_code: "arr.findAll(/id/);",
        sugar_enhancements: "%findAll% has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
        ref: 'Array/findAll'
      },
      {
        name: 'group_by',
        description: 'Returns a hash whose keys are the evalated result of a block passed, and values are arrays of elements returning that key.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.group_by { |el| el[:age] }",
        js_code: "var result = {}, age; for(var i = 0; i < arr.length; i++) { age = arr[i]['age']; if(!result[age]) { result[age] = []; } result[age].push(arr[i]); } return result;",
        sugar_code: "arr.groupBy('age');",
        sugar_enhancements: "%groupBy% additionally accepts a callback that can be called on each group.",
        ref: 'Array/groupBy'
      },
      {
        name: 'inject',
        description: 'Combines all elements of the array by applying a binary operation, specified by a block or symbol.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "arr.inject {|sum, n| sum + n }",
        js_code: "var result = 0; for(var i = 0; i <= 5; i++) { result += arr[i]; }; return result;",
        es5_code: "arr.reduce(function(a, b) { return a + b; });",
        ref: 'Array/reduce'
      },
      {
        name: 'max',
        description: 'Returns the largest item in the array.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.max { |a,b| a.length <=> b.length }",
        js_code: "var result; for(var i = 0; i < arr.length; i++) { if(arr[i].length > result || result === undefined) { result = arr[i].length; } } return result;",
        es5_code: "arr.reduce(function(a, b){ return a.length > b.length ? a.length : b.length; })",
        sugar_code: "arr.max('length').length;",
        sugar_notes: "Sugar's %max% method allows a function to transform the property to be checked, as well as a string shortcut to that property. Additionally, it returns the original array element, not the mapped property.",
        ref: 'Array/max'
      },
      {
        name: 'max_by',
        description: 'Returns the object in the enum that returns the greatest value for the given block.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.max_by { |el| el.length }",
        js_code: "var result; for(var i = 0; i < arr.length; i++) { if(arr[i].length > result || result === undefined) { result = arr[i]; } } return result;",
        sugar_code: "arr.max('length');",
        sugar_notes: "Sugar's %max% method allows a function to transform the property to be checked, as well as a string shortcut to that property. Additionally, it returns the original array element, not the mapped property.",
        ref: 'Array/max'
      },
      {
        name: 'member?',
        description: 'Returns true if any element of the array matches the object passed.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.member?('foo')",
        js_code: "for(var i = 0; i < arr.length; i++) { if(arr[i] == 'foo') { return true; } } return false;",
        es5_code: "arr.some(function(el){ return el == 'foo'; });",
        sugar_code: "arr.any('foo');",
        ref: 'Array/has'
      },
      {
        name: 'min',
        description: 'Returns the smallest item in the array.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.min { |a,b| a.length <=> b.length }",
        js_code: "var result; for(var i = 0; i < arr.length; i++) { if(arr[i].length < result || result === undefined) { result = arr[i].length; } } return result;",
        es5_code: "arr.reduce(function(a, b){ return a.length < b.length ? a.length : b.length; })",
        sugar_code: "arr.min('length').length;",
        sugar_notes: "Sugar's %min% method allows a function to transform the property to be checked, as well as a string shortcut to that property. Additionally, it returns the original array element, not the mapped property.",
        ref: 'Array/min'
      },
      {
        name: 'min_by',
        description: 'Returns the object in the enum that returns the greatest value for the given block.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.min_by { |el| el.length }",
        js_code: "var result; for(var i = 0; i < arr.length; i++) { if(arr[i].length > result || result === undefined) { result = arr[i]; } } return result;",
        sugar_code: "arr.min('length');",
        sugar_notes: "Sugar's %min% method allows a function to transform the property to be checked, as well as a string shortcut to that property. Additionally, it returns the original array element, not the mapped property.",
        ref: 'Array/min'
      },
      {
        name: 'minmax',
        description: 'Returns an array with two elements that are the maximum value and the minimum value.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "arr.minmax { |a,b| a.length <=> b.length }",
        js_code: "var min, max; for(var i = 0; i < arr.length; i++) { if(arr[i].length > max || max === undefined) { max = arr[i]; } if(arr[i].length < min || min === undefined) { min = arr[i]; } } return [min, max];",
        sugar_code: "var min = arr.min('length').length; var max = arr.max('length').length; return [min, max];",
        sugar_notes: "Sugar's %min% and %max% methods allow a function to transform the property to be checked, as well as a string shortcut to that property. Additionally, it returns the original array element, not the mapped property.",
        ref: 'Array/min'
      },
      {
        name: 'minmax_by',
        description: 'Returns an array with two elements that are the element with the maximum value and the element with the minimum value.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "arr.minmax { |a,b| a.length <=> b.length }",
        js_code: "var min, max; for(var i = 0; i < arr.length; i++) { if(arr[i].length > max || max === undefined) { max = arr[i]; } if(arr[i].length < min || min === undefined) { min = arr[i]; } } return [min, max];",
        sugar_code: "var min = arr.min('length'); var max = arr.max('length'); return [min, max];",
        sugar_notes: "Sugar's %min% and %max% methods allow a function to transform the property to be checked, as well as a string shortcut to that property. Additionally, it returns the original array element, not the mapped property.",
        ref: 'Array/min'
      },
      {
        name: 'none?',
        description: 'Returns true if the block never returns true for all elements.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "arr.none? { |n| n < 4 }",
        js_code: "for(var i = 0; i < arr.length; i++) { if(arr[i] < 4) { return false; } } return true;",
        es5_code: "arr.none(function(n) { return n < 4; });",
        sugar_code: "arr.none(function(n) { return n < 4; });",
        sugar_notes: "Sugar can also accept a string as a shortcut for the property to be tested against.",
        ref: 'Array/none'
      },
      {
        name: 'one?',
        description: 'Returns true if the block returns true exactly once.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "arr.one? { |n| n == 3 }",
        js_code: "var occurrences = 0; for(var i = 0; i < arr.length; i++) { if(arr[i] == 3) { occurrences += 1; } } return occurrences == 1;",
        es5_code: "arr.filter(function(n) { return n == 3; }).length == 1;",
        sugar_code: "arr.findAll(function(n) { return n == 3; }).length == 1;",
        sugar_enhancements: "%findAll% has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
        ref: 'Array/findAll'
      },
      {
        name: 'partition',
        description: 'Returns two arrays, the first with the elements for which the block returned true, and the rest.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "arr.partition { |n| n % 2 == 0 }",
        js_code: "var t = [], f = []; for(var i = 0; i < arr.length; i++) { if(arr[i] % 2 == 0) { t.push(arr[i]); } else { f.push(arr[i]) } } return [t, f];",
        sugar_code: "arr.groupBy(function(n) { return n % 2 == 0; });",
        sugar_notes: "%groupBy% will return an object whose keys are the result of the passed function. If a truthy/falsy function is passed, the keys will be %true% and %false%, and the groups can be accessed that way. This method allows more than a single 2 element split.",
        ref: 'Array/groupBy'
      },
      {
        name: 'reduce',
        description: 'Combines all elements of the array by applying a binary operation, specified by a block or symbol.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "arr.reduce {|sum, n| sum + n }",
        js_code: "var result = 0; for(var i = 0; i <= 5; i++) { result += arr[i]; }; return result;",
        es5_code: "arr.reduce(function(a, b) { return a + b; });",
        ref: 'Array/reduce'
      },
      {
        name: 'sum',
        description: 'Returns the sum of all elements in the iterable.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "arr.sum(&:price)",
        js_code: "var result = 0; for(var i = 0; i < arr.length; i++) { result += arr[i]['price']; } return result;",
        es5_code: "arr.reduce(function(a, b){ return a + b.price; }, 0)",
        sugar_code: "arr.sum('price')",
        ref: 'Array/sum'
      }
    ]
  },
  {
    type: 'instance',
    namespace: 'Array',
    methods: [
      {
        name: '<<',
        description: 'Pushes the object on to the end of the array.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code: "arr << 1",
        js_code: "arr.push(1);"
      },
      {
        name: '<=>',
        description: "Returns -1, 0, or 1 if the array is less than, equal to, or greater than the passed array. Returns %nil% if any element's %<=>% operator returns nil.",
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code: "arr1 <=> arr2",
        js_code: "--",
        js_notes: "Javascript does not define any means of comparing arrays to each other. If this is required it should be defined separately as application logic."
      },
      {
        name: '==',
        description: "Equality comparison. Two arrays are equal if they have the same number of elements and each element is equal.",
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "arr1 == arr2",
        js_code: "var equal = true; for(var i = 0; i < arr1.length; i++) { if(arr1[i] !== arr2[i]) { equal = false; }} return equal && arr1.length == arr2.length;",
        sugar_code: "Object.equal(arr1, arr2);"
      },
      {
        name: '|',
        description: "Returns an array with all elements found in either array, with no duplicates.",
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "arr1 | arr2",
        js_code: "var result = [], both = arr1.concat(arr2), exists; for(var i = 0; i < both.length; i++) { exists = false; for(var j = 0; j < result.length; j++) { if(result[j] == both[i]) { exists = true; } if(!exists) { result.push(both[i]); } } } return result;",
        sugar_code: "arr1.union(arr2);"
      },
      {
        name: '-',
        description: "Returns an array with all elements found in the passed array removed.",
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "arr1 - arr2",
        js_code: "var result = [], exists; for(var i = 0; i < arr1.length; i++) { exists = false; for(var j = 0; j < arr2.length; j++) { if(arr2[j] == arr1[i]) { exists = true; } if(!exists) { result.push(arr1[i]); } } } return result;",
        sugar_code: "arr1.subtract(arr2);"
      },
      {
        name: '*',
        description: "Performs a join when provided a string argument or returns a number of concatenated copies of itself for a numeric argument.",
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code: "arr * 3",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { for(var j = 0; j < 3; j++) { result.concat(arr[i]); } } return result;",
        sugar_code: "arr = arr.include(arr).include(arr);"
      },
      {
        name: '&',
        description: "Returns an array with all elements common to both arrays with no duplicates.",
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "arr1 & arr2",
        sugar_code: "arr1.intersect(arr2);"
      },
      {
        name: '+',
        description: "Concatenates two arrays together and returns the resulting array.",
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code: "arr1 + arr2",
        js_code: "arr1.concat(arr2);"
      },
      {
        name: 'at',
        description: "Returns the element at the given index.",
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code: "arr.at(0); arr.at(-1)",
        js_code: "arr[0]; arr[arr.length - 1]",
        sugar_code: "arr.at(0); arr.at(-1);"
      },
      {
        name: 'clear',
        description: "Removes all elements from the array.",
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code: "arr.clear()",
        js_code: "arr = [];",
        js_notes: "Javascript has no method specifically to empty arrays. Simply reset the variable."
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
        name: 'compact',
        description: 'Returns a copy of the array with %nil% elements removed.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.compact",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { if(arr[i] != null) { result.push(arr[i]); } return result;",
        sugar_code: "arr.compact();",
        sugar_enhancements: "%compact% will remove all elements that are %undefined%, %null%, or %NaN%. Additionally you can pass a parameter to remove all falsy values.",
        ref: 'Array/compact'
      },
      {
        name: 'concat',
        description: "Concatenates two arrays together and returns the resulting array.",
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code: "arr1 + arr2",
        js_code: "arr1.concat(arr2);"
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
        name: 'delete',
        description: "Deletes items from the array that are equal to the object passed. If items to delete are not found, returns %nil%, otherwise returns the passed object.",
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.delete('a')",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { if(arr[i] != 'a') { result.push(arr[i]); } } arr = result;",
        sugar_code: "arr.remove('a');",
        sugar_notes: "%remove% is a destructive method that affects the actual array. %exclude% is a non-destructive alias.",
        ref: 'Array/remove'
      },
      {
        name: 'delete_at',
        description: "Deletes the item at the given index, and returns it or %nil% if it is out of range.",
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.delete_at(3)",
        js_code: "arr.splice(3, 1);",
        sugar_code: "arr.removeAt(3);",
        sugar_notes: "%removeAt% can also remove a range of elements. This method will return the array.",
        ref: 'Array/remove'
      },
      {
        name: 'delete_if',
        description: "Deletes items from the array for which the block evaluates to true.",
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.delete_if { |str| str == 'a' }",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { if(arr[i] != 'a') { result.push(arr[i]); } } arr = result;",
        sugar_code: "arr.remove(function(str) { return str == 'a'; });",
        sugar_notes: "%remove% is a destructive method that affects the actual array. %exclude% is a non-destructive alias.",
        ref: 'Array/remove'
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
        name: 'each',
        description: 'Calls a block once for each element in the array.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "arr.each(&fn)",
        js_code: "for(var i = 0; i < arr.length; i ++) { fn(arr[i]); };",
        es5_code: "arr.forEach(fn);",
        sugar_code: "arr.each(fn);",
        sugar_enhancements: "%each% has a few enhancements including starting from an index, looping past the end of the array, and the ability to handle sparse arrays.",
        ref: 'Array/each'
      },
      {
        name: 'each_index',
        description: 'Same as Array#each but passes the index instead of the element.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "arr.each_index(&fn)",
        js_code: "for(var i = 0; i < arr.length; i ++) { fn(i); };",
        es5_code: "arr.forEach(function(el, i) { fn(i); });",
        sugar_code: "arr.each(function(el, i) { fn(i); });",
        sugar_enhancements: "%each% has a few enhancements including starting from an index, looping past the end of the array, and the ability to handle sparse arrays.",
        ref: 'Array/each'
      },
      {
        name: 'empty?',
        description: 'Returns true if the array contains no elements.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "arr.empty?",
        js_code: "arr.length == 0;",
        sugar_code: "arr.isEmpty();"
      },
      {
        name: 'fill',
        description: 'Fills the array with the passed argument or the result of a block.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "arr.fill('x')",
        js_code: "for(var i = 0; i < arr.length; i++) { arr[i] = 'x'; }",
        es5_code: "arr.map(function(){ return 'x'; });",
        ref: 'Array/map'
      },
      {
        name: 'find_index',
        description: 'Returns the index for the first element that matches the object passed or for which the block returns true.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "arr.find_index('a')",
        js_code: "for(var i = 0; i < arr.length; i++) { if(arr[i] == 'a') { return i; } } return result;",
        es5_code: "arr.indexOf('a');",
        sugar_code: "arr.findIndex(function(el) { return el == 'a'; });",
        sugar_enhancements: "%findIndex% allows a function to be passed to find the element, similar to %filter%.",
        ref: 'Array/findIndex'
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
        name: 'flatten',
        description: 'Returns an array that is a one dimensional flattening of the array.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "arr.flatten;",
        js_code: "function flatten(a) { var result = []; for(var i = 0; i < a.length; i++) { if(a[i] instanceof Array) { result.concat(flatten(a[i])); } else { result.push(a[i]); } } return result; } return flatten(arr);",
        sugar_code: "arr.flatten();"
      },
      {
        name: 'from',
        description: 'Returns the remainder of the array from the passed index.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "arr.from(3);",
        js_code: "arr.slice(3);",
        sugar_code: "arr.from(3);",
        ref: 'Array.from'
      },
      {
        name: 'include?',
        description: 'Returns true if any element of the array matches the object passed.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.include?('foo')",
        js_code: "for(var i = 0; i < arr.length; i++) { if(arr[i] == 'foo') { return true; } } return false;",
        es5_code: "arr.some(function(el){ return el == 'foo'; });",
        sugar_code: "arr.any('foo');",
        ref: 'Array/has'
      },
      {
        name: 'index',
        description: 'Returns the index for the first element that matches the object passed or for which the block returns true.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "arr.index('a')",
        js_code: "for(var i = 0; i < arr.length; i++) { if(arr[i] == 'a') { return i; } } return result;",
        es5_code: "arr.indexOf('a');",
        sugar_code: "arr.findIndex(function(el) { return el == 'a'; });",
        sugar_enhancements: "%findIndex% allows a function to be passed to find the element, similar to %filter%.",
        ref: 'Array/findIndex'
      },
      {
        name: 'in_groups',
        description: 'Splits or iterates over the array in a number of groups specified by the passed number.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "arr.in_groups(3); arr.in_groups(3, 'none')",
        sugar_code: "arr.inGroups(3); arr.inGroups(3, 'none');",
        ref: 'Array/inGroups'
      },
      {
        name: 'in_groups_of',
        description: 'Splits or iterates over the array in groups which are of a size equal to the number passed.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "arr.in_groups_of(3); arr.in_groups_of(3, 'none')",
        sugar_code: "arr.inGroupsOf(3); arr.inGroupsOf(3, 'none');",
        ref: 'Array/inGroupsOf'
      },
      {
        name: 'insert',
        description: 'Inserts the given values before the element with the given index.',
        js_compatibility: 1,
        sugar_compatibility: 2,
        original_code:  "arr.insert(1, 'a')",
        js_code: "arr.splice(1, 0, 'a');",
        js_notes: "The second parameter is the number of elements to remove at that index, so if you are just adding elements, pass 0.",
        sugar_code: "arr.insert('a', 1);",
        sugar_notes: "In addition to the parameters being reversed, %insert% performs a concat operation on the array, so nested arrays won't work here (use %splice% instead in this case).",
        ref: 'Array/insert'
      },
      {
        name: 'join',
        description: 'Returns a string with all elements in the array converted to a string and joined together with the passed separator.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "arr.join(',')",
        js_code: "arr.join(',');"
      },
      {
        name: 'keep_if',
        description: 'Returns an array containing all elements for which the block is not false.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.keep_if { |n| n % 3 == 0 }",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { if(arr[i] % 3 == 0) { result.push(arr[i]); } } return result;",
        es5_code: "arr.filter(function(el) { return el % 3 == 0; });",
        sugar_code: "arr.findAll(function(el) { return el % 3 == 0; });",
        sugar_enhancements: "%findAll% method has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
        ref: 'Array/findAll'
      },
      {
        name: 'last',
        description: 'Returns the last n elements of the array (1 by default).',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "arr.last",
        js_code: "arr.slice(-1);",
        sugar_code: "arr.last();",
        ref: 'Array/last'
      },
      {
        name: 'length',
        description: 'Returns the length of the array.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code: "arr.length",
        js_code: "arr.length;",
        sugar_code: "arr.length;"
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
        name: 'pop',
        description: 'Removes the last element from the end of the array and returns it.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "arr.pop",
        js_code: "arr.pop();"
      },
      {
        name: 'push',
        description: 'Pushes the given object(s) onto the end of the array.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "arr.push",
        js_code: "arr.push();"
      },
      {
        name: 'reject',
        description: 'Returns an array with all elements for which the block returned false.',
        js_compatibility: 0,
        sugar_compatibility: 3,
        original_code:  "arr.reject {|n| n % 3 == 0 }",
        js_code: "var result = []; for(var i = 0; i <= arr.length; i++) { if(n % 3 != 0) result.push(arr[i]); } return result;",
        es5_code: "arr.filter(function(n) { return n % 3 != 0; });",
        sugar_code: "arr.exclude(function() { return n % 3 == 0; })",
        ref: 'Array/exclude'
      },
      {
        name: 'replace',
        description: 'Replaces the contents of an array with contents of another one.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "arr1.replace(arr2)",
        js_code: "arr1 = arr2;",
        js_notes: "Javascript has no native method to replace the contents of an array, so simply set the variable to the other array."
      },
      {
        name: 'reverse',
        description: 'Traverses the array in reverse order.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "arr.reverse",
        js_code: "arr.reverse();"
      },
      {
        name: 'reverse_each',
        description: 'Traverses the array in reverse order.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "arr.reverse_each(&fn)",
        js_code: "var result = []; for(var i = arr.length; i > 0; i-- { fn(arr[i]); }",
        es5_code: "arr.reverse().forEach(fn);",
        sugar_code: "arr.reverse().each(fn);",
        sugar_enhancements: "%each% has a few enhancements including starting from an index, looping past the end of the array, and the ability to handle sparse arrays.",
        ref: 'Array/each'
      },
      {
        name: 'rotate',
        description: 'Returns a new array by rotating the number of elements by the number passed.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "arr.rotate(2)",
        js_code: "var result = [], cnt = 2, index; while(result.length < arr.length) { index = result.length + cnt; if(index > arr.length) { index -= arr.length; } result.push(arr[index]); } return result;",
        sugar_code: "arr = arr.map(function(el, i, arr) { return arr.at(i + 2); })",
        ref: 'Array/at'
      },
      {
        name: 'sample',
        description: 'Returns a random element or elements from the array.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "arr.sample",
        js_code: "arr[Math.floor(Math.random() * arr.length)];",
        sugar_code: "arr.sample();",
        ref: 'Array/sample'
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
        sugar_enhancements: "%findAll% method has a few enhancements including starting from an index, shortcuts for the passed function, and ability to handle sparse arrays.",
        ref: 'Array/findAll'
      },
      {
        name: 'shift',
        description: 'Removes the first element in an array and returns it. Also can remove an array of n elements.',
        js_compatibility: 1,
        sugar_compatibility: 1,
        original_code:  "arr.shift",
        js_code: "arr.shift();",
        js_notes: "Javascript can only shift one element at a time from the array."
      },
      {
        name: 'shuffle',
        description: 'Returns a new array with the elements shuffled.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "arr.shuffle",
        sugar_code: "arr.randomize();"
      },
      {
        name: 'size',
        description: 'Returns the length of the array.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code: "arr.size",
        js_code: "arr.length;",
        sugar_code: "arr.length;"
      },
      {
        name: 'slice',
        description: 'Returns the element at the index, or an array of elements starting at the index and continuing for n elements, or a subarray specified by a range.',
        js_compatibility: 1,
        sugar_compatibility: 1,
        original_code: "arr.slice(2, 2)",
        js_code: "arr.slice(2, 4);",
        js_notes: "The second parameter to %slice% is the index to end the slice at."
      },
      {
        name: 'sort',
        description: 'Returns an array with all of the elements sorted.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "arr.sort { |a, b| a <=> b }",
        js_code: "arr.sort(function(a, b) { return a - b; })",
        js_notes: "Note that %sort% is destructive here. If this is not intended, create a copy of the array first using %concat%.",
        sugar_code: "arr.sort(function(a, b) { return a.compare(b); }); arr.sortBy('id')",
        sugar_enhancements: "Sugar provides a %compare% method on strings, numbers, and dates, to allow complex sorting when the type isn't known. Addtionally, %sortBy% allows the array to be sorted by a given property.",
        ref: 'Array/sortBy'
      },
      {
        name: 'sort_by',
        description: 'Sorts the array using a set of keys generated by mapping the values with the given block.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "arr.sort { |word| word.length }",
        js_code: "arr.sort(function(aWord, bWord) { if(aWord == bWord) { return 0; } else if(aWord < bWord) { return -1; } else { return 1; });",
        js_notes: "Note that %sort% is destructive here. If this is not intended, create a copy of the array first using %concat%.",
        sugar_code: "arr.sortBy('length');",
        ref: 'Array/sortBy'
      },
      {
        name: 'split',
        description: 'Divides the array into subarrays based on a delimiter or result of a block.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code:  "arr.split(&:fn)",
        js_code: "var result = [], tmp = []; for(var i == 0; i < arr.length; i++) { if(fn(arr[i])) { result.push(tmp); tmp = []; } else { tmp.push(arr[i]); } }"
      },
      {
        name: 'take',
        description: 'Returns the first n elements of the array.',
        js_compatibility: 1,
        sugar_compatibility: 3,
        original_code:  "arr.take(3)",
        js_code: "arr.slice(0,3);",
        sugar_code: "arr.to(3);",
        ref: 'Array/to'
      },
      {
        name: 'take_while',
        description: 'Returns elements up to and including the first element for which the block returns nil or false.',
        js_compatibility: 0,
        sugar_compatibility: 1,
        original_code:  "arr.take_while { |n| n < 5 }",
        js_code: "var result; for(var i = 0; i < arr.length; i++) { if(arr[i] >= 5) { result = arr.slice(i); break; } }; return result;",
        sugar_code: "var take = true; arr.findAll(function(n) { if(n < 5) { return take; } else { return take = false; }});",
        ref: 'Array/findAll'
      },
      {
        name: 'to',
        description: 'Returns the beginning of the array up to the passed index.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "arr.to(3);",
        js_code: "arr.slice(0, 3);",
        sugar_code: "arr.to(3);",
        ref: 'Array.to'
      },
      {
        name: 'to_query',
        description: 'Converts the array to a string suitable to use as a URL query string.',
        js_compatibility: 0,
        sugar_compatibility: 0,
        original_code: "arr.to_query('key')",
        js_code: "var result = []; for(var i = 0; i < arr.length; i++) { result.push('key=' + encodeURICompinent(arr[i])); } return result.join('&');",
        sugar_code: "arr.map(function(el){ return 'key' + el.escapeURL(true); }).join('&');"
      },
      {
        name: 'uniq',
        description: 'Returns a new array removing all duplicate values.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "arr.uniq",
        js_code: "var result = [], exists; for(var i = 0; i < arr.length; i++) { exists = false; for(var j = 0; j < result.length; j++) { if(result[j] == arr[i]) { exists = true; } } if(!exists) { result.push(arr[i]); } } return result;",
        sugar_code: "arr.unique();",
        sugar_enhancements: "%unique% in Sugar can also take a mapping function that identifies the property to unique on. This is useful when a unique property is known ahead of time to avoid checking equality on all properties of objects.",
        ref: 'Array/unique'
      },
      {
        name: 'uniq_by',
        description: 'Returns a unique array based on a given criteria.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "arr.uniq_by { |i| i.odd? }",
        js_code: "var result = [], exists; for(var i = 0; i < arr.length; i++) { exists = false; for(var j = 0; j < result.length; j++) { if(result[j] % 2 == 0) { exists = true; } } if(!exists) { result.push(arr[i]); } } return result;",
        sugar_code: "arr.unique(function(i) { return i.isOdd(); });",
        ref: 'Array/unique'
      },
      {
        name: 'unshift',
        description: 'Prepends objects to the front of the array, moving them down.',
        js_compatibility: 2,
        sugar_compatibility: 2,
        original_code:  "arr.unshift(5)",
        js_code: "arr.unshift(5);"
      },
      {
        name: 'values_at',
        description: 'Returns an array containing the elements at the given indexes.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "arr.values_at(1,3,5)",
        js_code: "var result = [], at = [1,3,5]; for(var i = 0; i < arr.length; i++) { for(var j = 0; j < at.length; j++) { if(at[j] == i) { result.push(arr[i]); } } } return result;",
        sugar_code: "arr.at(1,3,5);",
        sugar_notes: "%at% will alternately return a single element if only one argument is given."
      },
      {
        name: 'zip',
        description: 'Takes one element from the array and merges corresponding elements from the passed arrays.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code:  "arr1.zip(arr2)",
        js_code: "var result = []; for(var i = 0; i < arr1.length; i++) { result.push([arr1[i], arr2[i] || null]); } return result;",
        sugar_code: "arr1.zip(arr2);",
        ref: 'Array/zip'
      }
    ]
  }
];
