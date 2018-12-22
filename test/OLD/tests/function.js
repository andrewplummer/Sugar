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

  method('delay', function() {
    var fn, ret, count;
    count = 0;
    fn = function() {
      count++;
    }
    run(fn, 'delay', []);
    clock.tick(1);
    equal(count, 1, 'no arguments should be equal to 1ms');

    clock.reset();
    count = 0;
    fn = function(one, two) {
      count++;
      equal(this, fn, 'this object should be the function');
      equal(one, 'one', 'first parameter');
      equal(two, 'two', 'second parameter');
    };
    equal(getTimers(fn), undefined, 'timers object should not exist yet');
    ret = run(fn, 'delay', [20, 'one', 'two']);
    equal(typeof getTimers(fn), 'object', 'timers object should be exposed');
    equal(typeof ret, 'function', 'returns the function');
    equal(count, 0, 'should not have run yet');
    clock.tick(20);
    equal(count, 1, 'should have run once');
    equal(getTimers(fn).length, 1, 'timers are not cleared after execution');

    count = 0;
    fn = function() {
      count++;
    }
    run(fn, 'delay', []);
    clock.tick(1);
    equal(count, 1, 'no arguments should be equal to 1ms');

  });

  method('cancel', function() {
    var fn, ref, count;

    // Basic functionality
    clock.reset();
    count = 0;
    fn = function() {
      count++;
    };
    run(fn, 'delay', [20 / 4]);
    run(fn, 'delay', [20 / 5]);
    run(fn, 'delay', [20 / 6]);
    ref = run(fn, 'cancel');
    equal(ref, fn, 'returns a reference to the function');
    clock.tick(20);
    equal(count, 0, 'all functions should be canceled');

    // Canceling after a delay
    clock.reset();
    count = 0;
    fn = function() {
      count++;
    };
    run(fn, 'delay', [50]);
    run(fn, 'delay', [10]);

    equal(count, 0, 'should not have been called yet');
    equal(getTimers(fn).length, 2, 'should be 2 calls pending');

    clock.tick(30);

    run(fn, 'cancel');
    equal(count, 1, 'should have called the function once');
    equal(getTimers(fn).length, 0, 'should have no more calls pending');

    clock.tick(30);
    equal(count, 1, 'should still have only been called once');
    equal(getTimers(fn).length, 0, 'should still be no more delays');


    // Canceling after first call (Issue #346)
    clock.reset();
    count = 0;
    fn = function() {
      count++;
      run(fn, 'cancel');
    };
    run(fn, 'delay', [5]);
    run(fn, 'delay', [20]);
    run(fn, 'delay', [20]);
    run(fn, 'delay', [20]);
    run(fn, 'delay', [20]);
    run(fn, 'delay', [20]);

    equal(count, 0, 'should not have been called yet');
    equal(getTimers(fn).length, 6, 'should be 6 calls pending');

    clock.tick(50);

    equal(count, 1, 'delays should have been canceled after 1');
    equal(getTimers(fn).length, 0, 'should be no more pending calls');


    // Canceling n functions in
    clock.reset();
    count = 0;
    fn = function() {
      count++;
      if (count === 2) {
        run(fn, 'cancel');
      }
    };
    run(fn, 'delay', [20]);
    run(fn, 'delay', [20]);
    run(fn, 'delay', [2]);
    run(fn, 'delay', [5]);
    run(fn, 'delay', [20]);
    run(fn, 'delay', [20]);

    equal(count, 0, 'should not have been called yet');
    equal(getTimers(fn).length, 6, 'should be 6 calls pending');

    clock.tick(50);

    equal(count, 2, 'should have been called twice');
    equal(getTimers(fn).length, 0, 'should be no more pending calls');

  });

  method('lazy', function() {
    var count, fn, expected;

    // Default
    clock.reset();
    expected = [['maybe','a',1],['baby','b',2],['you lazy','c',3],['biotch','d',4]];
    count = 0;
    fn = run(function(one, two) {
      equal([this.toString(), one, two], expected[count], 'scope and arguments are correct');
      count++;
    }, 'lazy');

    fn.call('maybe', 'a', 1);
    fn.call('baby', 'b', 2);
    fn.call('you lazy', 'c', 3);

    equal(count, 0, 'not immediate by default');

    clock.tick(5);

    equal(count, 3, 'was executed 3 times in 5ms');
    fn.call('biotch', 'd', 4);
    equal(count, 3, 'should not execute immediately on subsequent call');

    clock.tick(5);

    equal(count, 4, 'final call');


    // Immediate execution
    clock.reset();
    count = 0;
    expected = [['maybe','a',1],['baby','b',2],['you lazy','c',3],['biotch','d',4]];
    fn = run(function(one, two) {
      equal([this.toString(), one, two], expected[count], 'scope and arguments are correct');
      count++;
    }, 'lazy', [1, true]);

    fn.call('maybe', 'a', 1);
    fn.call('baby', 'b', 2);
    fn.call('you lazy', 'c', 3);

    equal(count, 1, 'immediately executed');

    clock.tick(5);
    equal(count, 3, 'was executed 3 times in 5ms');
    fn.call('biotch', 'd', 4);
    equal(count, 4, 'should execute immediately again');
    clock.tick(5);
    equal(count, 4, 'should still have executed 4 times');

    // Canceling lazy functions
    clock.reset();
    count = 0;
    fn = run(function() {
      count++;
    }, 'lazy');
    fn();
    fn();
    fn();

    equal(count, 0, 'no calls made yet before cancel');
    equal(getTimers(fn).length, 1, 'should have 1 pending call');

    run(fn, 'cancel');

    equal(count, 0, 'no calls made after cancel');
    equal(getTimers(fn).length, 0, 'should have no more pending calls');

    clock.tick(10);

    equal(count, 0, 'lazy function should have been canceled');
    equal(getTimers(fn).length, 0, 'should have no more pending calls');


    // Cancelling immediate lazy functions
    clock.reset();
    count = 0;
    fn = run(function() {
      count++;
    }, 'lazy', [1, true]);
    fn();
    fn();
    fn();

    equal(count, 1, 'should have run once before cancel');
    equal(getTimers(fn).length, 1, 'should have 1 pending call');

    run(fn, 'cancel');

    equal(count, 1, 'should still have only run once after cancel');
    equal(getTimers(fn).length, 0, 'should have no more pending calls');

    clock.tick(10);

    equal(count, 1, 'should still have only run once after 10ms');


    // Fractional ms values
    clock.reset();
    count = 0;
    fn = run(function() {
      count++;
    }, 'lazy', [0.1]);
    for(var i = 0; i < 20; i++) {
      fn();
    }

    equal(count, 0, 'no calls before tick');

    clock.tick(2);

    equal(count, 20, 'a fractional wait value will call multiple times in a single tick');


    // Upper limit for calls
    clock.reset();
    count = 0;
    fn = run(function() {
      count++;
    }, 'lazy', [0.1, false, 10]);
    for(var i = 0; i < 50; i++) {
      fn();
    }
    clock.tick(5);
    equal(count, 10, 'number of calls should be capped at 10');


    // Upper limit for calls with immediate execution
    clock.reset();
    count = 0;
    fn = run(function() {
      count++;
    }, 'lazy', [0.1, true, 10]);
    for(var i = 0; i < 50; i++) {
      fn();
    }
    clock.tick(5);
    equal(count, 10, 'number of calls should be capped at 10');


    // Upper limit of 1
    clock.reset();
    count = 0;
    fn = run(function() {
      count++;
    }, 'lazy', [0.1, false, 1]);
    for(var i = 0; i < 50; i++) {
      fn();
    }
    clock.tick(5);
    equal(count, 1, 'should have been called once');

    // Upper limit of 1 with immediate execution
    clock.reset();
    count = 0;
    fn = run(function() {
      count++;
    }, 'lazy', [0.1, true, 1]);
    for(var i = 0; i < 50; i++) {
      fn();
    }
    clock.tick(5);
    equal(count, 1, 'should have been called once');
  });

  method('debounce', function() {
    var fn, ret, count, expected;

    // Basic debouncing
    clock.reset();
    count = 0;
    expected = [['leia', 5], ['han solo', 7]];
    fn = run(function(one){
      equal([this.toString(), one], expected[count], 'scope and arguments are correct');
      count++;
    }, 'debounce', [20]);

    ret = fn.call('3p0', 1);
    fn.call('r2d2', 2);
    clock.tick(5);
    fn.call('chewie', 3);
    clock.tick(10);
    fn.call('leia', 5);

    clock.tick(20);
    equal(count, 1, 'should have fired after 30ms');
    fn.call('luke', 6);
    fn.call('han solo', 7);

    equal(ret, undefined, 'calls to a debounced function return undefined');

    clock.tick(40);
    equal(count, 2, 'count should still be correct after another 10ms');


    // Canceling debounced functions
    count = 0;
    fn = run(function() {
      count++;
    }, 'debounce', [50]);
    fn();
    fn();
    fn();
    run(fn, 'cancel');
    equal(count, 0, 'canceled debounce function should not have been called yet');
    clock.tick(50);
    equal(count, 0, 'canceled debounce function should not have been called after 50ms');

  });

  method('throttle', function() {
    var fn, ret, count, expected;

    // Basic throttle functionality
    clock.reset();
    count = 0;
    expected = [['3p0', 1], ['luke', 6]];
    fn = run(function(one){
      equal([this.toString(), one], expected[count], 'immediate execution | scope and arguments are correct');
      count++;
      return count;
    }, 'throttle', [50]);

    equal(fn.call('3p0', 1), 1, 'first run, gets value');
    equal(fn.call('r2d2', 2), 1, 'second run, return value is caching');
    equal(fn.call('chewie', 3), 1, 'third run, return value is caching');
    equal(fn.call('vader', 4), 1, 'fourth run, return value is caching');

    clock.tick(25);
    equal(fn.call('leia', 5), 1, 'fifth run, return value is caching');

    clock.tick(50);
    equal(fn.call('luke', 6), 2, 'sixth run, gets value');
    equal(fn.call('han solo', 7), 2, 'seventh run, return value is caching');

    clock.tick(100);
    equal(count, 2, 'count is correct');


    // Throttle memoizing
    clock.reset();
    count = 1;
    fn = run(function() {
      return ++count;
    }, 'throttle', [50]);

    equal(fn(), 2, 'iteration 1');
    equal(fn(), 2, 'iteration 2');
    equal(fn(), 2, 'iteration 3');

    clock.tick(200);
    equal(fn(), 3, 'memoize | result expires after 200 ms');

  });

  method('every', function() {
    var fn, count;

    // Basic
    clock.reset();
    count = 0;
    fn = function(one, two) {
      equal(this, fn, 'this object should be the function');
      equal(one, 'one', 'first argument should be curried');
      equal(two, 'two', 'second argument should be curried');
      count++;
    };
    run(fn, 'every' , [10, 'one', 'two']);
    clock.tick(100);
    equal(count, 10, 'should have been called 10 times');

    // Issue #488
    clock.reset();
    count = 0;
    fn = function(one, two) {
      count++;
      if (count === 5) {
        run(fn, 'cancel');
      }
    };
    run(fn, 'every' , [10]);
    clock.tick(100);
    equal(count, 5, 'should have been called 5 times');
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

  method('once', function() {
    var fn, count;

    // Simple count
    count = 0;
    fn = run(function(one, two) {
      count++;
    }, 'once');

    fn.call();
    fn.call();
    fn.call();

    equal(count, 1, 'returning undefined will not affect the number of calls');

    // Simple arguments
    count = 0;
    fn = run(function(n) {
      count++;
      return n + 1;
    }, 'once');
    equal(fn(3), 4, 'running with 3 should add 1');
    equal(fn(4), 4, 'running with 4 should remain 4');
    equal(fn(500), 4, 'running with 500 should still be 4');
    // Runs
    fn(1);
    // Runs
    fn(2);
    // Cached
    fn(3);
    equal(count, 1, 'should have run once');

    // Complex arguments
    var obj = { foo: 'bar' };
    count = 0;
    fn = run(function(one, two) {
      count++;
      equal(this, obj, 'scope is properly set');
      equal(one, 'one', 'first argument is passed');
      equal(two, 'two', 'second argument is passed');
      return count * 30;
    }, 'once');

    equal(fn.call(obj, 'one', 'two'), 30, 'first call calculates the result');
    equal(fn.call(obj, 'one', 'two'), 30, 'second call memoizes the result');
    equal(fn.call(obj, 'one', 'two'), 30, 'third call memoizes the result');
    equal(fn.call(obj, 'one', 'two'), 30, 'fourth call memoizes the result');
    equal(fn.call(obj, 'one', 'two'), 30, 'fifth call memoizes the result');

    equal(count, 1, 'count is only incremented once');

  });

  method('memoize', function() {

    // Simple memoization

    var count = 0;
    var fn = run(function(n) {
      count++;
      return n + 1;
    }, 'memoize');
    equal(fn(3), 4, 'running with 3 should add 1');
    equal(fn(4), 5, 'running with 4 should still add 1');
    equal(fn(500), 501, 'running with 500 should still add 1');
    // Runs
    fn(1);
    // Runs
    fn(2);
    // Cached
    fn(3);
    equal(count, 5, 'should have run 5 times');


    // Custom hash function.

    var firstArgument = function(x) {
      return x;
    }
    var count = 0;
    var fn = run(function(n) {
      count++;
      return n + 1;
    }, 'memoize', [firstArgument]);
    equal(fn(1, 'a'), 2, 'first time should run');
    equal(fn(1, 'a'), 2, 'second time should be cached');
    equal(fn(2, 'a'), 3, 'different first argument should run');
    equal(fn(2, 'b'), 3, 'different second argument should be cached');
    equal(count, 2, 'should have run 2 times');


    // Complex memoization

    var foo1 = { foo: 'bar' };
    var foo2 = { foo: 'bar' };
    var foo3 = { foo: 'bar', moo: 'car' };

    var count = 0;
    var fn = run(function(n) {
      count++;
    }, 'memoize');
    fn(foo1); // Should run
    fn(foo1); // Should cache
    fn(foo2); // Equal by value, should also cache
    fn(foo3); // Not equal by value, should run
    fn(foo2, 'c'); // Equal first argument, but different second so should run
    fn(foo2, 'c'); // Identical to last, should cache
    fn(foo1, 'c'); // Equivalent to last, should also cache

    equal(count, 3, 'should have run 3 times');


    // Dot operator can serve as a shortcut to the hashing function.

    var p1 = { name: { first: 'Tom', last: 'Hanks'  }};
    var p2 = { name: { first: 'Jon', last: 'Voight' }};
    var p3 = { name: { first: 'Tom', last: 'Cruise' }};
    var p4 = { name: { first: 'Joe', last: 'Rogan'  }};
    var p5 = { name: { first: 'Tom', last: 'Waits'  }};

    var count = 0;
    var fn = run(function(obj) {
      count++;
      return obj.name.first + ' ' + obj.name.last;
    }, 'memoize', ['name.first']);

    equal(fn(p1), 'Tom Hanks', 'first should run');
    equal(fn(p2), 'Jon Voight', 'second should run');
    equal(fn(p3), 'Tom Hanks', 'third should cache');
    equal(fn(p4), 'Joe Rogan', 'fourth should run');
    equal(fn(p5), 'Tom Hanks', 'fifth should run');
    equal(count, 3, 'should have run 3 times');


    // Limit argument

    var count = 0;
    var fn = run(function() { count++; }, 'memoize', [function() {}, 1]);
    fn(1);
    fn(2);
    fn(3);
    fn(4);
    // Noop hash function always returns undefined, which means
    // the function will be memoized indefinitely, so limit is ignored.
    equal(count, 1, 'limit ignored with noop');

    var count = 0;
    var fn = run(function() { count++; }, 'memoize', [2]);
    fn(1); // First hit, not cached. +1
    fn(2); // First hit, not cached. +1
    fn(1); // Second hit, cached. +0
    fn(2); // Second hit, cached. +0
    fn(3); // First hit, not cached. +1 - overflow so cache reset
    fn(1); // Second hit, was reset. +1
    fn(2); // Second hit, was reset. +1
    fn(3); // Third hit, was reset. +1
    fn(4); // First ,hit, not cached. +1

    // Cache was cleared once, fn should have been called 7 times.
    equal(count, 7, 'limit hit 7 times');


    // Class instances

    function Foo() {}
    var o1 = new Foo;
    var o2 = new Foo;

    var count = 0;
    var fn = run(function() { count++; }, 'memoize', []);
    fn(o1);
    fn(o1);
    equal(count, 1, 'instances | same reference is memoized');

    var count = 0;
    var fn = run(function() { count++; }, 'memoize', []);
    fn(o1);
    fn(o2);
    equal(count, 2, 'instances | different references are not memoized');

  });

  method('partial', function() {

    var format = function(place, last){
      return (last || '') + this.toFixed(place);
    }

    Number.prototype.two = run(format, 'partial', [2]);
    equal((18).two(), '18.00');
    equal((9999).two(), '9999.00');
    equal((9999).two('$'), '$9999.00');

    Number.prototype.euro = run(format, 'partial', [undefined, '€']);
    equal((9999.77).euro(), '€10000', 'euro | no params | 9.999,77');
    equal((9999.77).euro(0), '€10000', 'euro | 0 | 9.999');
    equal((9999.77).euro(1), '€9999.8', 'euro | 1 | 9.999,8');
    equal((9999.77).euro(2), '€9999.77', 'euro | 2 | 9.999,77');
    equal((9999.77).euro(3), '€9999.770', 'euro | 3 | 9.999,777');

    Number.prototype.noop = run(format, 'partial');
    equal((1000).noop(3, '$'), '$1000.000', 'noop | 1 000,000');
    equal((1000).noop(4, '$'), '$1000.0000', 'noop | 1 000,0000');
    equal((1000).noop(5, '$'), '$1000.00000', 'noop | 1 000,00000');

    var partial = run(function(first) {
      return first;
    }, 'partial', [['a', 'b']]);

    equal(partial(), ['a','b'], 'can be passed arrays');

    var partial = run(function(first) {
      return Array.prototype.slice.call(arguments);
    }, 'partial', [0]);

    equal(partial('a'), [0, 'a'], 'falsy values can be passed');

    function stringifyArray(arr) {
      var result = [];
      for (var i = 0; i < arr.length; i++) {
        if (testIsArray(arr[i])) {
          result.push('[' + stringifyArray(arr[i]) + ']');
        } else {
          result.push(String(arr[i]));
        }
      }
      return result.join(' ');
    }
    var fn = function() {
      return stringifyArray(arguments);
    }
    equal(run(fn, 'partial', [null, 'a'])('b'), 'null a b', 'null first will not act as a placeholder');
    equal(run(fn, 'partial', ['a', null])('b'), 'a null b', 'null second will not act as a placeholder');
    equal(run(fn, 'partial', [null, null, 'a'])(), 'null null a', 'null repeated first');
    equal(run(fn, 'partial', ['a', null, null])(), 'a null null', 'null repeated last');
    equal(run(fn, 'partial', [null, null, null])(), 'null null null', 'all null');
    equal(run(fn, 'partial', [null, null, null])('a','b','c'), 'null null null a b c', 'all null overflowing');

    equal(run(fn, 'partial', [undefined, 'a'])('b'), 'b a', 'undefined first will act as a placeholder');
    equal(run(fn, 'partial', ['a', undefined])('b'), 'a b', 'undefined second will act as a placeholder');
    equal(run(fn, 'partial', [undefined, undefined, 'a'])('a', 'b'), 'a b a', 'two placeholders first');
    equal(run(fn, 'partial', ['a', undefined, undefined])('a', 'b'), 'a a b', 'two placeholders last');
    equal(run(fn, 'partial', [undefined, undefined, undefined])('a', 'b', 'c'), 'a b c', 'all placeholders');
    equal(run(fn, 'partial', [undefined, undefined, undefined])('a', 'b'), 'a b undefined', 'all placeholders with last undefined');
    equal(run(fn, 'partial', [undefined, undefined, undefined])('a','b','c','d','e'), 'a b c d e', 'all undefined overflowing');

    equal(run(fn, 'partial', [null, undefined, null])(), 'null undefined null', 'null and undefined mixed');
    equal(run(fn, 'partial', [null, undefined, null])('a'), 'null a null', 'null and undefined mixed with 1 arg');
    equal(run(fn, 'partial', [null, undefined, null])('a', 'b'), 'null a null b', 'null and undefined mixed with 2 args');
    equal(run(fn, 'partial', [null, undefined, null])('a', 'b', 'c'), 'null a null b c', 'null and undefined mixed with 3 args');

    equal(run(fn, 'partial', [undefined, null, undefined])(), 'undefined null undefined', 'undefined and null mixed');
    equal(run(fn, 'partial', [undefined, null, undefined])('a'), 'a null undefined', 'undefined and null mixed with 1 arg');
    equal(run(fn, 'partial', [undefined, null, undefined])('a', 'b'), 'a null b', 'undefined and null mixed with 2 args');
    equal(run(fn, 'partial', [undefined, null, undefined])('a', 'b', 'c'), 'a null b c', 'undefined and null mixed with 3 args');

    equal(run(fn, 'partial', ['a'])(undefined), 'a undefined', 'passing undefined');
    equal(run(fn, 'partial', ['a'])(undefined, 'b'), 'a undefined b', 'passing undefined first');
    equal(run(fn, 'partial', ['a'])('b', undefined), 'a b undefined', 'passing undefined second');

    equal(run(fn, 'partial', [undefined])(undefined), 'undefined', 'passing undefined to a placeholder');
    equal(run(fn, 'partial', [undefined])(undefined, 'b'), 'undefined b', 'passing undefined to a placeholder first');
    equal(run(fn, 'partial', [undefined])('b', undefined), 'b undefined', 'passing undefined to a placeholder second');

    equal(run(fn, 'partial', ['a'])(null), 'a null', 'passing null');
    equal(run(fn, 'partial', ['a'])(null, 'b'), 'a null b', 'passing null first');
    equal(run(fn, 'partial', ['a'])('b', null), 'a b null', 'passing null second');

    equal(run(fn, 'partial', [undefined])(null), 'null', 'passing null to a placeholder');
    equal(run(fn, 'partial', [undefined])(null, 'b'), 'null b', 'passing null to a placeholder first');
    equal(run(fn, 'partial', [undefined])('b', null), 'b null', 'passing null to a placeholder second');

    // More complex
    equal(run(fn, 'partial', [[undefined]])('a'), '[undefined] a', 'array of undefined is not a placeholder');
    equal(run(fn, 'partial', [[undefined], undefined])('a'), '[undefined] a', 'placeholder after array');
    equal(run(fn, 'partial', [undefined, [undefined]])('a'), 'a [undefined]', 'placeholder before array');

    equal(run(fn, 'partial', [[null]])('a'), '[null] a', 'array of null is not a placeholder');
    equal(run(fn, 'partial', [[null], undefined])('a'), '[null] a', 'placeholder after array');
    equal(run(fn, 'partial', [undefined, [null]])('a'), 'a [null]', 'placeholder before array');


    // Tests lovingly borrowed from Underscore

    var obj = {name: 'moe'};
    var func = function() { return this.name + ' ' + Array.prototype.slice.call(arguments).join(' '); };

    obj.func = run(func, 'partial', ['a', 'b']);
    equal(obj.func('c', 'd'), 'moe a b c d', 'can partially apply');

    obj.func = run(func, 'partial', [undefined, 'b', undefined, 'd']);
    equal(obj.func('a', 'c'), 'moe a b c d', 'can partially apply with placeholders');

    func = run(function() { return arguments.length; }, 'partial', [undefined, 'b', undefined, 'd']);
    equal(func('a', 'c', 'e'), 5, 'accepts more arguments than the number of placeholders');
    equal(func('a'), 4, 'accepts fewer arguments than the number of placeholders');

    func = run(function() { return typeof arguments[2]; }, 'partial', [undefined, 'b', undefined, 'd']);
    equal(func('a'), 'undefined', 'unfilled placeholders are undefined');

    // passes context
    function MyWidget(name, options) {
      this.name = name;
      this.options = options;
    }
    MyWidget.prototype.get = function() {
      return this.name;
    };
    var MyWidgetWithCoolOpts = run(MyWidget, 'partial', [undefined, {a: 1}]);
    var widget = new MyWidgetWithCoolOpts('foo');
    equal(widget instanceof MyWidget, true, 'Can partially bind a constructor');
    equal(widget.get(), 'foo', 'keeps prototype');
    equal(widget.options, {a: 1}, 'options equal');

    // explicit return value in constructor
    function MyWidget2() {
      return {foo:'bar'};
    }
    var MyFilledWidget = run(MyWidget2, 'partial', [undefined, {a: 1}]);
    var widget = new MyFilledWidget();
    equal(widget instanceof MyWidget, false, 'explicit return value is no longer an instance of the constructor');
    equal(widget.foo, 'bar', 'respects return value');



    // Tests lovingly borrowed from Lodash

    function identity(n) {
      return n;
    }

    var partial = run(identity, 'partial', ['a']);
    equal(partial(), 'a', 'partially applies arguments');

    var fn = function(a, b) { return [a, b]; };
    var partial = run(fn, 'partial', ['a']);
    equal(partial('b'), ['a', 'b'], 'creates a function that can be invoked with additional arguments');

    var fn = function() { return arguments.length; };
    var partial = run(fn, 'partial', []);
    equal(partial(), 0, 'works when there are no partially applied arguments and the created function is invoked without additional arguments');

    var partial = run(identity, 'partial', []);
    equal(partial('a'), 'a', 'works when there are no partially applied arguments and the created function is invoked with additional arguments');


    // Placeholders are "undefined" in Sugar.

    var fn = function() { return Array.prototype.slice.call(arguments); };
    var partial = run(fn, 'partial', [undefined,'b',undefined]);
    equal(partial('a', 'c'), ['a','b','c'], 'placeholders | filling 2');
    equal(partial('a'), ['a','b',undefined], 'placeholders | filling 1');
    equal(partial(), [undefined,'b',undefined], 'placeholders | filling none');
    equal(partial('a','c','d'), ['a','b','c','d'], 'placeholders | filling 2 adding 1');


    var fn = function(a, b, c) {};
    var partial = run(fn, 'partial', ['a']);
    equal(partial.length, 0, 'creates a function with a length of 0');

    var object = {};
    function Foo(value) {
      return value && object;
    }
    var partial = run(Foo, 'partial', []);
    equal(new partial instanceof Foo, true, 'ensure new partialed is an instance of func');
    equal(new partial(true), object, 'ensure new partialed return value');

    function greet(greeting, name) {
      return greeting + ' ' + name;
    }
    var partial1 = run(greet, 'partial', ['hi']);
    var partial2 = run(partial1, 'partial', ['barney']);
    var partial3 = run(partial1, 'partial', ['pebbles']);
    equal(partial1('fred'), 'hi fred');
    equal(partial2(), 'hi barney');
    equal(partial3(), 'hi pebbles');


    var fn = function() {
      var result = [this.a];
      Array.prototype.push.apply(result, arguments);
      return result;
    };
    var object = { 'a': 1, 'fn': fn };

    var a = fn.bind(object);
    var b = run(a, 'partial', [2]);
    equal(b(3), [1,2,3], 'should work with combinations of bound and partial functions');

    var a = run(fn, 'partial', [2]);
    var b = a.bind(object);
    equal(b(3), [1,2,3], 'should work with combinations of partial and bound functions');


    // Function#bind is spec so our hands are tied here

    var fn = function() { return Array.prototype.slice.call(arguments); };
    var object = { 'fn': fn };

    var a = fn.bind(object, undefined, 2);
    var b = run(a, 'partial', [1, undefined, 4]);
    equal(b(3, 5), [undefined,2,1,3,4,5], 'should not work with combinations of functions with placeholders');

    var a = run(fn, 'partial', [undefined, 2]);
    var b = a.bind(object, 1, undefined, 4);
    equal(b(3, 5), [1, 2, undefined, 4, 3, 5], 'should not work with combinations of functions with placeholders');

  });

  method('lock', function() {

    // Force 3 arguments as .length could be lying

    var fn = run(takesNone, 'lock', []);
    equal(fn(),      safeArray(u, u, u), 'takes 0 | default | 0 args');
    equal(fn(1),     safeArray(u, u, u), 'takes 0 | default | 1 arg');
    equal(fn(1,2,3), safeArray(u, u, u), 'takes 0 | default | 3 args');

    var fn = run(takesOne, 'lock', []);
    equal(fn(),      safeArray(u, u, u), 'takes 1 | default | 0 args');
    equal(fn(1),     safeArray(1, u, u), 'takes 1 | default | 1 arg');
    equal(fn(1,2,3), safeArray(1, u, u), 'takes 1 | default | 3 args');

    var fn = run(takesTwo, 'lock', []);
    equal(fn(),      safeArray(u, u, u), 'takes 2 | default | 0 args');
    equal(fn(1),     safeArray(1, u, u), 'takes 2 | default | 1 arg');
    equal(fn(1,2,3), safeArray(1, 2, u), 'takes 2 | default | 3 args');

    var fn = run(takesNone, 'lock', [1]);
    equal(fn(),      safeArray(u, u, u), 'takes 0 | manual 1 | 0 args');
    equal(fn(1),     safeArray(1, u, u), 'takes 0 | manual 1 | 1 arg');
    equal(fn(1,2,3), safeArray(1, u, u), 'takes 0 | manual 1 | 3 args');

    var fn = run(takesOne, 'lock', [1]);
    equal(fn(),      safeArray(u, u, u), 'takes 1 | manual 1 | 0 args');
    equal(fn(1),     safeArray(1, u, u), 'takes 1 | manual 1 | 1 arg');
    equal(fn(1,2,3), safeArray(1, u, u), 'takes 1 | manual 1 | 3 args');

    var fn = run(takesTwo, 'lock', [1]);
    equal(fn(),      safeArray(u, u, u), 'takes 2 | manual 1 | 0 args');
    equal(fn(1),     safeArray(1, u, u), 'takes 2 | manual 1 | 1 arg');
    equal(fn(1,2,3), safeArray(1, u, u), 'takes 2 | manual 1 | 3 args');

    // Get all arguments by length as forcing 3 could mask
    // real number called with .apply

    var fn = run(takesNoneReturnsVaried, 'lock', []);
    equal(fn(),      [], 'takes 0 returns varied | default | 0 args');
    equal(fn(1),     [], 'takes 0 returns varied | default | 1 arg');
    equal(fn(1,2,3), [], 'takes 0 returns varied | default | 3 args');

    var fn = run(takesTwoReturnsVaried, 'lock', []);
    equal(fn(),      [],    'takes 2 returns varied | default | 0 args');
    equal(fn(1),     [1],   'takes 2 returns varied | default | 1 arg');
    equal(fn(1,2,3), [1,2], 'takes 2 returns varied | default | 3 args');

    var fn = run(takesNoneReturnsVaried, 'lock', [1]);
    equal(fn(),      [],  'takes 0 returns varied | manaual 1 | 0 args');
    equal(fn(1),     [1], 'takes 0 returns varied | manaual 1 | 1 arg');
    equal(fn(1,2,3), [1], 'takes 0 returns varied | manaual 1 | 3 args');

    var fn = run(takesTwoReturnsVaried, 'lock', [1]);
    equal(fn(),      [],  'takes 2 returns varied | manual 1 | 0 args');
    equal(fn(1),     [1], 'takes 2 returns varied | manual 1 | 1 arg');
    equal(fn(1,2,3), [1], 'takes 2 returns varied | manual 1 | 3 args');

  });

  group('Locking partial functions', function() {

    var partial = run(takesNoneReturnsVaried, 'partial', ['a', 'b']);
    var fn = run(partial, 'lock', []);
    equal(fn(),        ['a','b'], 'filled 2 | default lock | 0 args');
    equal(fn('c'),     ['a','b'], 'filled 2 | default lock | 1 arg');
    equal(fn('c','d'), ['a','b'], 'filled 2 | default lock | 2 args');

    var partial = run(takesNoneReturnsVaried, 'partial', ['a', 'b']);
    var fn = run(partial, 'lock', [0]);
    equal(fn(),        [], 'filled 2 | locked to 0 | 0 args');
    equal(fn('c'),     [], 'filled 2 | locked to 0 | 1 arg');
    equal(fn('c','d'), [], 'filled 2 | locked to 0 | 2 args');

    var partial = run(takesNoneReturnsVaried, 'partial', ['a', 'b']);
    var fn = run(partial, 'lock', [1]);
    equal(fn(),        ['a'], 'filled 2 | locked to 1 | 0 args');
    equal(fn('c'),     ['a'], 'filled 2 | locked to 1 | 1 arg');
    equal(fn('c','d'), ['a'], 'filled 2 | locked to 1 | 2 args');

    var partial = run(takesNoneReturnsVaried, 'partial', ['a', 'b']);
    var fn = run(partial, 'lock', [3]);
    equal(fn(),        ['a','b'],     'filled 2 | locked to 3 | 0 args');
    equal(fn('c'),     ['a','b','c'], 'filled 2 | locked to 3 | 1 arg');
    equal(fn('c','d'), ['a','b','c'], 'filled 2 | locked to 3 | 2 args');

    var partial = run(takesNoneReturnsVaried, 'partial', []);
    var fn = run(partial, 'lock', [1]);
    equal(fn(),        [],    'filled 0 | locked to 1 | 0 args');
    equal(fn('c'),     ['c'], 'filled 0 | locked to 1 | 1 arg');
    equal(fn('c','d'), ['c'], 'filled 0 | locked to 1 | 2 args');


    // Locking partial functions with curried arguments and holes

    var partial = run(takesNoneReturnsVaried, 'partial', [undefined, 'b']);
    var fn = run(partial, 'lock', []);
    equal(fn(),        safeArray( u, 'b'), 'filled 1 | 1 hole | default lock | 0 args');
    equal(fn('c'),     safeArray('c','b'), 'filled 1 | 1 hole | default lock | 1 arg');
    equal(fn('c','d'), safeArray('c','b'), 'filled 1 | 1 hole | default lock | 2 args');

    var partial = run(takesNoneReturnsVaried, 'partial', [undefined, 'b']);
    var fn = run(partial, 'lock', [1]);
    equal(fn(),        safeArray( u ), 'filled 1 | 1 hole | locked to 1 | 0 args');
    equal(fn('c'),     safeArray('c'), 'filled 1 | 1 hole | locked to 1 | 1 arg');
    equal(fn('c','d'), safeArray('c'), 'filled 1 | 1 hole | locked to 1 | 2 args');

    var partial = run(takesNoneReturnsVaried, 'partial', [undefined, 'b']);
    var fn = run(partial, 'lock', [3]);
    equal(fn(),        safeArray( u, 'b'),     'filled 1 | 1 hole | locked to 3 | 0 args');
    equal(fn('c'),     safeArray('c','b'),     'filled 1 | 1 hole | locked to 3 | 1 arg');
    equal(fn('c','d'), safeArray('c','b','d'), 'filled 1 | 1 hole | locked to 3 | 2 args');

    var partial = run(takesNoneReturnsVaried, 'partial', [undefined, undefined]);
    var fn = run(partial, 'lock', []);
    equal(fn(),        safeArray( u,  u ), 'filled 0 | 2 holes | default lock | 0 args');
    equal(fn('c'),     safeArray('c', u ), 'filled 0 | 2 holes | default lock | 1 arg');
    equal(fn('c','d'), safeArray('c','d'), 'filled 0 | 2 holes | default lock | 2 args');

    var partial = run(takesNoneReturnsVaried, 'partial', [undefined, undefined]);
    var fn = run(partial, 'lock', [1]);
    equal(fn(),        safeArray( u ), 'filled 0 | 2 holes | locked to 1 | 0 args');
    equal(fn('c'),     safeArray('c'), 'filled 0 | 2 holes | locked to 1 | 1 arg');
    equal(fn('c','d'), safeArray('c'), 'filled 0 | 2 holes | locked to 1 | 2 args');

    var partial = run(takesNoneReturnsVaried, 'partial', [undefined, undefined]);
    var fn = run(partial, 'lock', [3]);
    equal(fn(),        safeArray( u,  u ), 'filled 0 | 2 holes | locked to 3 | 0 args');
    equal(fn('c'),     safeArray('c', u ), 'filled 0 | 2 holes | locked to 3 | 1 arg');
    equal(fn('c','d'), safeArray('c','d'), 'filled 0 | 2 holes | locked to 3 | 2 args');

  });

});
