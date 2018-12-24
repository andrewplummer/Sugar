'use strict';

namespace('RegExp', function() {

  staticMethod('escape', function(escape) {
    assertEqual(escape('foo'), 'foo');
    assertEqual(escape('f|oo'), 'f\\|oo');
    assertEqual(escape('f(oo)'), 'f\\(oo\\)');
    assertEqual(escape('...'), '\\.\\.\\.');
    assertEqual(escape('?'), '\\?');
    assertEqual(escape('\\?'), '\\\\\\?');
    assertEqual(escape('-'), '\\-');
    assertEqual(escape('*.+[]{}()?|/\\-'), '\\*\\.\\+\\[\\]\\{\\}\\(\\)\\?\\|\\/\\\\\\-');
    assertEqual(escape(8.1), '8\\.1');
    assertEqual(escape(null), 'null');
    assertEqual(escape(NaN), 'NaN');
  });

});
