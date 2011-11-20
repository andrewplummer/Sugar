
//  Compatiblity index:
//
//  0 - Does not exist.
//  1 - Exists but does not support all functionality.
//  2 - Exists and supports all functionality.
//  3 - Exists and supports all functionality plus more.

var SugarRubyMethods = [
  {
    // Global namepace
    type: 'class',
    namespace: 'String',
    methods: [
      {
        name: '<<',
        description: 'Appends to the end of the string.',
        js_compatibility: 2,
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
        js_code: "str.charAt(2); str.slice(1,2); str.match(/[aeiou]/); str.match('lo');"
        js_notes: "Note that although Javascript does allow array-style access to strings (%[]%), this will break in IE8 and below, so it's best to use %charAt% instead. Sugar patches this method this and more with %at%. For a range of indexes, use %slice%. Javascript native %match% will return an array of matches instead of a substring, but will be %null% if there is no match, which can cause problems. Sugar's %each% method is essentially the same but will guarantee an empty array when no match occurs.",
        ref: 'String/at'
      },
      {
        name: '[]=',
        description: 'Replaces part of a string.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str[3] = 'h'",
        js_code: "str.slice(0,2) + 'h' + str.slice(4);"
        js_notes: "As Javascript string primitives are not passed by reference, changing an index of a string will not do anything. A new string instead needs to be concatenated together."
        sugar_code: "str.insert('h',3);",
        sugar_notes: "%insert% allows a simple, readable syntax to concatenate a string inside another. This method is an alias of %add%, which does the same thing, but reads better when doing a simple concatenation on a string."
      },
      {
        name: '*',
        description: 'Returns a string repeated %n% times.',
        js_compatibility: 0,
        sugar_compatibility: 2,
        original_code: "str * 3",
        js_code: "str + str + str"
        js_notes: "No such method exists in native Javascript, so straight concatenation or a for loop must be used."
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
        name: '+',
        description: 'Concatenates one string to another.',
        js_compatibility: 2,
        original_code: "str + 'hello'",
        js_code: "str + 'hello';"
      },
    ]
  }
];
