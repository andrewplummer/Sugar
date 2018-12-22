namespace('RegExp', function () {
  'use strict';

  method('escape', function() {
    test(RegExp, ['test regexp'], 'test regexp', 'basic');
    test(RegExp, ['test reg|exp'], 'test reg\\|exp', 'pipe');
    test(RegExp, ['hey there (budday)'], 'hey there \\(budday\\)', 'parentheses');
    test(RegExp, ['what a day...'], 'what a day\\.\\.\\.', 'ellipsis');
    test(RegExp, ['.'], '\\.', 'single period');
    test(RegExp, ['*.+[]{}()?|/\\-'], '\\*\\.\\+\\[\\]\\{\\}\\(\\)\\?\\|\\/\\\\\\-', 'various tokens');
    test(RegExp, ['?'], '\\?', '?');
    test(RegExp, ['\?'], '\\?', 'one slash and ?');
    test(RegExp, ['\\?'], '\\\\\\?', 'two slashes and ?');
    test(RegExp, ['\\?'], '\\\\\\?', 'two slashes and ?');
    test(RegExp, ['-'], '\\-', 'dash');
    test(RegExp, [8], '8', 'non-string will be coerced to string');
  });

  method('setFlags', function() {
    var r = /foobar/;
    var n = run(r, 'setFlags', ['gim']);

    equal(n.global, true, 'global set');
    equal(n.ignoreCase, true, 'ignore set');
    equal(n.multiline, true, 'multiline set');

    equal(r.global, false, 'global untouched');
    equal(r.ignoreCase, false, 'ignore untouched');
    equal(r.multiline, false, 'multiline untouched');
  });

  method('addFlags', function() {
    var r = /foobar/;
    var n = run(r, 'addFlags', ['g']);

    equal(n.global, true, 'global added');
    equal(n.ignoreCase, false, 'ignore not added');
    equal(n.multiline, false, 'multiline not added');

    equal(r.global, false, 'original global untouched');
    equal(r.ignoreCase, false, 'original ignore untouched');
    equal(r.multiline, false, 'original multiline untouched');

    var r = /foobar/;
    var n = run(r, 'addFlags', ['gi']);

    equal(n.global, true, 'multiple | global added');
    equal(n.ignoreCase, true, 'multiple | ignore added');
    equal(n.multiline, false, 'multiple | multiline not added');

    equal(run(run(/foobar/gim, 'addFlags', ['d']), 'getFlags').length, 3, 'unknown flag is ignored');
  });


  method('removeFlags', function() {
    var r = /foobar/gim;
    var n = run(r, 'removeFlags', ['g']);

    equal(n.global, false, 'global removed');
    equal(n.ignoreCase, true, 'ignore not removed');
    equal(n.multiline, true, 'multiline not removed');

    equal(r.global, true, 'global untouched');
    equal(r.ignoreCase, true, 'ignore untouched');
    equal(r.multiline, true, 'multiline untouched');

    var r = /foobar/gim;
    var n = run(r, 'removeFlags', ['gi']);

    equal(n.global, false, 'multiple | global removed');
    equal(n.ignoreCase, false, 'multiple | ignore removed');
    equal(n.multiline, true, 'multiple | multiline not removed');

  });


  method('getFlags', function() {

    function flagsEqual(reg, expected) {
      var flags = run(reg);
      var actualSorted   = flags.split('').sort().join('');
      var expectedSorted = expected.split('').sort().join('');
      equal(actualSorted, expectedSorted, reg.source);
    }

    flagsEqual(/foobar/gim, 'gim');
    flagsEqual(/foobar/im, 'im');
    flagsEqual(/foobar/i, 'i');
    flagsEqual(/foobar/, '');
  });

});

