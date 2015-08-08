package('Function', function () {
  "use strict";

  var clock;

  setup(function() {
    clock = sinon.useFakeTimers();
  });

  teardown(function() {
    clock.restore();
  });

  method('delay', function() {
    var fn, ref, count;

    clock.reset();
    count = 0;
    fn = function(one, two) {
      count++;
      equal(this, fn, 'this object should be the function');
      equal(one, 'one', 'first parameter');
      equal(two, 'two', 'second parameter');
    };
    equal(fn.timers, undefined, 'timers object should not exist yet');
    ref = run(fn, 'delay', [20, 'one', 'two']);
    equal(typeof fn.timers, 'object', 'timers object should be exposed');
    equal(typeof ref, 'function', 'returns the function');
    equal(count, 0, 'should not have run yet');
    clock.tick(20);
    equal(count, 1, 'should have run once');
    equal(fn.timers.length, 1, 'timers are not cleared after execution');

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
    equal(fn.timers.length, 2, 'should be 2 calls pending');

    clock.tick(30);

    run(fn, 'cancel');
    equal(count, 1, 'should have called the function once');
    equal(fn.timers.length, 0, 'should have no more calls pending');

    clock.tick(30);
    equal(count, 1, 'should still have only been called once');
    equal(fn.timers.length, 0, 'should still be no more delays');


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
    equal(fn.timers.length, 6, 'should be 6 calls pending');

    clock.tick(50);

    equal(count, 1, 'delays should have been canceled after 1');
    equal(fn.timers.length, 0, 'should be no more pending calls');


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
    equal(fn.timers.length, 6, 'should be 6 calls pending');

    clock.tick(50);

    equal(count, 2, 'should have been called twice');
    equal(fn.timers.length, 0, 'should be no more pending calls');

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
    equal(fn.timers.length, 1, 'should have 1 pending call');

    run(fn, 'cancel');

    equal(count, 0, 'no calls made after cancel');
    equal(fn.timers.length, 0, 'should have no more pending calls');

    clock.tick(10);

    equal(count, 0, 'lazy function should have been canceled');
    equal(fn.timers.length, 0, 'should have no more pending calls');


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
    equal(fn.timers.length, 1, 'should have 1 pending call');

    run(fn, 'cancel');

    equal(count, 1, 'should still have only run once after cancel');
    equal(fn.timers.length, 0, 'should have no more pending calls');

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
    var fn, ret, count = 0, i = 1;
    var expectedArguments = [
      [[1,'bop'], [2,'bop'], [3,'bop'], [4,'bop'], [5,'bop']],
      [[6,'bop'],[7,'bop'],[8,'bop'],[9,'bop'],[10,'bop']]
    ];
    fn = run(function(args) {
      equal(args, expectedArguments[count], 'collects arguments called');
      equal(!!args[0].slice, true, 'arguments are converted to actual arrays');
      count++;
      return 'hooha';
    }, 'after', [5]);
    while(i <= 10) {
      ret = fn(i, 'bop');
      equal(ret, (i % 5 == 0 ? 'hooha' : undefined), 'collects return value as well');
      i++;
    }
    equal(count, 2, 'calls a function only after a certain number of calls');
  });

  method('after', function() {
    var fn, count = 0;
    var fn = run(function(args) { count++; }, 'after', [0]);
    equal(count, 1, '0 should fire the function immediately');
    equal(typeof fn, 'function', '0 should still return a function');
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
    var fn, count;

    // Simple memoization

    count = 0;
    fn = run(function(n) {
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

    count = 0;
    fn = run(function(n) {
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

    count = 0;
    fn = run(function(n) {
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

  });

  method('fill', function() {

    var format = function(place, last){
      return (last || '') + this.toFixed(place);
    }

    var filled;

    Number.prototype.two = run(format, 'fill', [2]);
    equal((18).two(), '18.00');
    equal((9999).two(), '9999.00');
    equal((9999).two('$'), '$9999.00');

    Number.prototype.euro = run(format, 'fill', [undefined, '€']);
    equal((9999.77).euro(), '€10000', 'euro | no params | 9.999,77');
    equal((9999.77).euro(0), '€10000', 'euro | 0 | 9.999');
    equal((9999.77).euro(1), '€9999.8', 'euro | 1 | 9.999,8');
    equal((9999.77).euro(2), '€9999.77', 'euro | 2 | 9.999,77');
    equal((9999.77).euro(3), '€9999.770', 'euro | 3 | 9.999,777');

    Number.prototype.noop = run(format, 'fill');
    equal((1000).noop(3, '$'), '$1000.000', 'noop | 1 000,000');
    equal((1000).noop(4, '$'), '$1000.0000', 'noop | 1 000,0000');
    equal((1000).noop(5, '$'), '$1000.00000', 'noop | 1 000,00000');

    filled = run(function(first) {
      return first;
    }, 'fill', [['a', 'b']]);

    equal(filled(), ['a','b'], 'can be passed arrays');

    filled = run(function(first) {
      return Array.prototype.slice.call(arguments);
    }, 'fill', [0]);

    equal(filled('a'), [0, 'a'], 'falsy values can be passed');
  });

});

