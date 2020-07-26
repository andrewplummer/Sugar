namespace('Function', function () {
  'use strict';

  var clock, u;

  function getTimers(fn) {
    return testGetPrivateProp(fn, 'timers');
  }

  function getThreeNoLength(args) {
    var arr = [];
    for (var i = 0; i < 3; i++) {
      arr[i] = args[i];
    }
    return arr;
  }

  function getAllWithLength(args) {
    var arr = [];
    for (var i = 0; i < args.length; i++) {
      arr[i] = args[i];
    }
    return arr;
  }

  function takesNone() {
    return getThreeNoLength(arguments);
  }

  function takesOne(a) {
    return getThreeNoLength(arguments);
  }

  function takesTwo(a, b) {
    return getThreeNoLength(arguments);
  }

  function takesNoneReturnsVaried() {
    return getAllWithLength(arguments);
  }

  function takesTwoReturnsVaried(a, b) {
    return getAllWithLength(arguments);
  }


  setup(function() {
    clock = sinon.useFakeTimers();
  });

  teardown(function() {
    clock.restore();
  });


  method('after', function() {

    var count = 0, expected = true;
    var fn = function() { count++; };
    var onceFn = run(fn, 'once', []);
    var single = run(onceFn, 'after', [3]);
    for (var i = 0; i < 10; i++) {
      var target = i < 3 ? 0 : 1;
      if (count !== target) {
        expected = correct;
      }
      single();
    }
    equal(expected, true, 'works in conjunction with once to only be called a single time');

    function assertCalledAfter(times, arg) {
      var i = 0;
      var fn = run(function() {
        return true;
      }, 'after', [arg]);
      while(!fn()) {
        i++;
      };
      equal(i + 1, times, 'should have fired after ' + times + ' executions');
    }

    function assertCalledOutOfTen(times, args) {
      var count = 0;
      var fn = run(function() {
        count++;
      }, 'after', args);
      for (var i = 0; i < 10; i++) {
        fn();
      }
      equal(count, times, 'should have fired ' + times + ' times out of 10');
    }

    var count = 0, i = 1;
    var expectedArguments = [
      [[1,'bop'], [2,'bop'], [3,'bop'], [4,'bop'], [5,'bop']],
      [[1,'bop'], [2,'bop'], [3,'bop'], [4,'bop'], [5,'bop'], [6,'bop']],
      [[1,'bop'], [2,'bop'], [3,'bop'], [4,'bop'], [5,'bop'], [6,'bop'], [7,'bop']],
      [[1,'bop'], [2,'bop'], [3,'bop'], [4,'bop'], [5,'bop'], [6,'bop'], [7,'bop'], [8,'bop']]
    ];
    var fn = run(function(args) {
      equal(args, expectedArguments[count], 'collects arguments called');
      equal(!!args[0].slice, true, 'arguments are converted to actual arrays');
      count++;
      return 'hooha';
    }, 'after', [5]);
    while(i <= 8) {
      equal(fn(i, 'bop'), (i >= 5 ? 'hooha' : undefined), 'collects return value as well');
      i++;
    }
    equal(count, 4, 'calls function every time after n calls');

    assertCalledAfter(1,  0);
    assertCalledAfter(3,  3);
    assertCalledAfter(10, 10);
    assertCalledAfter(1,  1.5);
    assertCalledAfter(1,  '0');
    assertCalledAfter(3,  '3');
    assertCalledAfter(10, '10');

    assertCalledAfter(1,  null);
    assertCalledAfter(1,  undefined);
    assertCalledAfter(1,  NaN);
    assertCalledAfter(1,  false);
    assertCalledAfter(1,  true);
    assertCalledAfter(1,  []);
    assertCalledAfter(1,  {});

    assertCalledOutOfTen(10, [0]);
    assertCalledOutOfTen(10, [1]);
    assertCalledOutOfTen(9,  [2]);
    assertCalledOutOfTen(8,  [3]);

    assertCalledOutOfTen(10, [0]);
    assertCalledOutOfTen(10, [1]);
    assertCalledOutOfTen(9,  [2]);
    assertCalledOutOfTen(8,  [3]);

    raisesError(function() { run(fn, 'after', [-1]); }, 'negative raises an error');
    raisesError(function() { run(fn, 'after', ['-1']); }, 'negative string raises an error');
    raisesError(function() { run(fn, 'after', [Infinity]); }, 'Infinity raises an error');
    raisesError(function() { run(fn, 'after', [-Infinity]); }, '-Infinity raises an error');


    var count = 0;
    var fn = function() { count++; };
    var single = run(run(fn, 'once', []), 'after', [3]);
    for (var i = 0; i < 10; i++) {
      single();
    }
    equal(count, 1, 'works in conjunction with once to only be called a single time');

  });

});
