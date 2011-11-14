
var SugarPythonMethods = [
  {
    // Global namepace
    type: 'class',
    namespace: 'String',
    methods: [
      {
        name: 'capitalize',
        description: '',
        exists: true,
        is_native: false,
        ref: 'String/capitalize'
      },
      {
        name: 'center',
        description: 'Params are reversed.',
        original: "str.center(8, ' ');"
        js: "while(str.length < 8) { str = str.length % 2 == 0 ? ' ' + str : str + '_'; }",
        exists: true,
        is_native: false,
        ref: 'String/pad'
      },
      {
        name: 'count',
        description: 'String#count can be duplicated with browser native String#match, which will match against a regex or string, and return an array whose length is the number of times the string matched. When no match occurs, this can be null, which will throw an error if the length property is tested directly. Sugar adds the method String#each which, among other things, will behave like match but return an empty array if no match is made, so the length property can be tested directly. Each can additionally accept ',
        original: "count = str.count('h', 3, 10)",
        js: "var count, match; match = str.slice(3, 10).match('h'); count = match ? match.length : 0;",
        sugar: "var count = str.each('h').length;
        exists: true,
        is_native: true
      },
      {
        name: 'encode',
        description: 'Character encoding is not available natively in Javascript.'
      },
      {
        name: 'decode',
        description: 'Character decoding is not available natively in Javascript.'
      },
      {
        name: 'endsWith',
        original:  "str.endsWith('ing', 2, 6)",
        js: "/ing/.test(str.slice(2,6));",
        sugar: "str.slice(2,6).endsWith('ing')"
      },
      {
        name: 'startsWith',
        original:  "str.startsWith('ing', 2, 6)",
        js: "/ing/.test(str.slice(2,6));",
        sugar: "str.slice(2,6).startsWith('ing')"
      },
      {
        name: 'find',
        original:  "str.find('h', 2, 6)",
        js: "str.slice(2,6).indexOf('h')",
        polyfill_warning: true
      },
      {
        name: 'index',
        original:  "str.index('h', 2, 6)",
        js: "str.slice(2,6).indexOf('h')",
        polyfill_warning: true
      },
      {
        name: 'isalnum',
        original:  "str.isalnum()",
        js: "/^[\w\d]+$/.test(str)"
      },
      {
        name: 'isalpha',
        original:  "str.isalpha()",
        js: "/^\w+$/.test(str)"
      },
      {
        name: 'isdigit',
        original:  "str.isdigit()",
        js: "/^\d+$/.test(str)"
      },
      {
        name: 'islower',
        original:  "str.islower()",
        js: "/^[a-z]+$/.test(str)"
      },
      {
        name: 'isupper',
        original:  "str.isupper()",
        js: "/^[A-Z]+$/.test(str)"
      },
      {
        name: 'isspace',
        original:  "str.isspace()",
        js: "/^\s+$/.test(str)",
        sugar: "str.isBlank()"
      },
      {
        name: 'join',
        original:  "','.join(arr)",
        js: "arr.join(',')"
      },
      {
        name: 'len',
        original:  "len(str)",
        js: "str.length"
      },
      {
        name: 'ljust',
        original:  "str.ljust(50, '-')",
        js: "while(str.length < 50) { str += '-' }",
        sugar: "str.padLeft('-', 50 - str.length)"
      },
      {
        name: 'lower',
        original:  "str.lower()",
        js: "str.toLowerCase()"
      }
    ]
  }
];
