package('Function', function () {

  method('delay', function(async) {
    async(function(wrap, finish) {
      var fn, ref;

      fn = wrap(function(one, two) {
        equal(this, fn, 'this object should be the function');
        equal(one, 'one', 'first parameter');
        equal(two, 'two', 'second parameter');
        finish();
      });
      ref = run(fn, 'delay', [20, 'one', 'two']);
      equal(typeof ref, 'function', 'returns the function');
    });
  });

  method('delay', function(async) {
    async(function(wrap, finish) {
      var fn, ref, shouldBeFalse = false;
      fn = function() {
        shouldBeFalse = true;
      };
      run(fn, 'delay', [20 / 4]);
      run(fn, 'delay', [20 / 5]);
      run(fn, 'delay', [20 / 6]);
      ref = run(fn, 'cancel');
      equal(typeof fn.timers, 'object', 'timers object should be exposed');
      equal(ref, fn, 'returns a reference to the function');
      setTimeout(wrap(function() {
        equal(shouldBeFalse, false, 'cancel is working');
        finish();
      }), 60);
    });
  });

  method('delay', function(async) {
    async(function(wrap, finish) {
      var counter = 0;
      var fn = function(){
        counter++;
      }

      run(fn, 'delay', [50]);
      run(fn, 'delay', [10]);

      setTimeout(wrap(function() {
        run(fn, 'cancel');
      }), 30);

      setTimeout(wrap(function() {
        equal(counter, 1, 'should be able to find the correct timers');
        run(fn, 'cancel');
        finish();
      }), 60);
    });
  });


  // Note that lazy can be tricky to test, as it does not immediately
  // set a timeout when a lazy function is called, but rather queues, and
  // will set a timeout when execution of the first function has ended, meaning
  // that another asynchronous function set up later can sometimes fire before,
  // even if it has a longer timeout, so be careful here.
  method('lazy', function(async) {
    async(function(wrap, finish) {
      var counter = 0;
      var expected = [['maybe','a',1],['baby','b',2],['you lazy','c',3],['biotch','d',4]];
      var fn = run(wrap(function(one, two) {
        equal([this.toString(), one, two], expected[counter], 'scope and arguments are correct');
        counter++;
      }), 'lazy');
      fn.call('maybe', 'a', 1);
      fn.call('baby', 'b', 2);
      fn.call('you lazy', 'c', 3);
      setTimeout(wrap(function() {
        equal(counter, 3, 'was executed by 10ms');
        fn.call('biotch', 'd', 4);
        equal(counter, 3, 'counter should still be 3');
        setTimeout(wrap(function() {
          equal(counter, 4, 'final call');
          finish();
        }), 80);
      }), 80);
      equal(counter, 0, 'not immediate by default');
    });
  });

  method('lazy', function(async) {
    async(function(wrap, finish) {
      var counter = 0;
      var expected = [['maybe','a',1],['baby','b',2],['you lazy','c',3],['biotch','d',4]];
      var fn = run(wrap(function(one, two) {
        equal([this.toString(), one, two], expected[counter], 'scope and arguments are correct');
        counter++;
      }), 'lazy', [1, true]);
      fn.call('maybe', 'a', 1);
      fn.call('baby', 'b', 2);
      fn.call('you lazy', 'c', 3);
      equal(counter, 1, 'immediately executed');
      setTimeout(wrap(function() {
        equal(counter, 3, 'was executed by 10ms');
        fn.call('biotch', 'd', 4);
        equal(counter, 4, 'counter should now be 4');
        setTimeout(wrap(function() {
          equal(counter, 4, 'should still be 4');
          finish();
        }), 80);
      }), 80);
    });
  });

  method('lazy', function(async) {
    async(function(wrap, finish) {
      var counter = 0;
      var fn = run(function() {
        counter++;
      }, 'lazy');
      fn();
      fn();
      fn();
      run(fn, 'cancel');
      setTimeout(function() {
        equal(counter, 0, 'lazy functions can also be canceled');
        finish();
      }, 20);
    });
  });

  method('lazy', function(async) {
    async(function(wrap, finish) {
      var counter = 0;
      var fn = run(function() {
        counter++;
      }, 'lazy', [1, true]);
      fn();
      fn();
      fn();
      run(fn, 'cancel');
      setTimeout(function() {
        equal(counter, 1, 'immediate | lazy functions can also be canceled');
        finish();
      }, 10);
    });
  });


  method('lazy', function(async) {
    async(function(wrap, finish) {
      var counter = 0;
      var fn = run(function() {
        counter++;
      }, 'lazy', [0.1]);
      for(var i = 0; i < 20; i++) {
        fn();
      }
      setTimeout(function() {
        equal(counter, 20, 'lazy (throttled) functions can have a [wait] value of < 1ms');
        finish();
      }, 100);
    });
  });


  method('lazy', function(async) {
    async(function(wrap, finish) {

      var counter = 0;
      var fn = run(function() {
        counter++;
      }, 'lazy', [0.1, false, 10]);
      for(var i = 0; i < 50; i++) {
        fn();
      }
      setTimeout(wrap(function() {
        equal(counter, 10, 'lazy functions have an upper threshold');
        finish();
      }), 50);
    });
  });

  method('lazy', function(async) {
    async(function(wrap, finish) {
      var counter = 0;
      var fn = run(function() {
        counter++;
      }, 'lazy', [0.1, true, 10]);
      for(var i = 0; i < 50; i++) {
        fn();
      }
      setTimeout(wrap(function() {
        equal(counter, 10, 'immediate | should have same upper threshold as non-immediate');
        finish();
      }), 50);
    });
  });


  method('lazy', function(async) {
    async(function(wrap, finish) {
      var counter = 0;
      var fn = run(function() {
        counter++;
      }, 'lazy', [0.1, false, 1]);
      for(var i = 0; i < 50; i++) {
        fn();
      }
      setTimeout(wrap(function() {
        equal(counter, 1, 'lazy functions with a limit of 1 will still execute');
        finish();
      }), 50);
    });
  });

  method('lazy', function(async) {
    async(function(wrap, finish) {
      var counter = 0;
      var fn = run(function() {
        counter++;
      }, 'lazy', [0.1, true, 1]);
      for(var i = 0; i < 50; i++) {
        fn();
      }
      setTimeout(wrap(function() {
        equal(counter, 1, 'immediate | lazy functions with a limit of 1 will still execute');
        finish();
      }), 50);
    });
  });


  method('debounce', function(async) {
    async(function(wrap, finish) {
      var fn, ret, counter = 0, expected = [['leia', 5],['han solo', 7]];
      var fn = run(function(one){
        equal([this.toString(), one], expected[counter], 'scope and arguments are correct');
        counter++;
      }, 'debounce', [20]);

      fn.call('3p0', 1);
      fn.call('r2d2', 2);
      fn.call('chewie', 3);

      setTimeout(function() {
        fn.call('leia', 5);
      }, 10);

      setTimeout(function() {
        fn.call('luke', 6);
        fn.call('han solo', 7);
      }, 100);

      ret = fn.call('vader', 4);

      equal(ret, undefined, 'calls to a debounced function return undefined');

      setTimeout(wrap(function() {
        equal(counter, 2, 'counter is correct');
        finish();
      }), 150);
    });
  });


  method('debounce', function(async) {
    async(function(wrap, finish) {
      var counter = 0;
      var fn = run(function() {
        counter++;
      }, 'debounce', [50]);
      fn();
      fn();
      fn();
      run(fn, 'cancel');
      equal(counter, 0, 'debounced functions can also be canceled | immediate');
      setTimeout(wrap(function() {
        equal(counter, 0, 'debounced functions can also be canceled | after delay');
        finish();
      }), 50);
    });
  });

  method('throttle', function(async) {
    async(function(wrap, finish) {
      var fn, ret, counter = 0, expected = [['3p0', 1],['luke', 6]];
      fn = run(function(one){
        equal([this.toString(), one], expected[counter], 'immediate execution | scope and arguments are correct');
        counter++;
        return counter;
      }, 'throttle', [50]);

      equal(fn.call('3p0', 1), 1, 'first run, gets value');
      equal(fn.call('r2d2', 2), 1, 'second run, return value is caching');
      equal(fn.call('chewie', 3), 1, 'third run, return value is caching');

      setTimeout(wrap(function() {
        equal(fn.call('leia', 5), 1, 'fifth run, return value is caching');
      }), 10);

      setTimeout(wrap(function() {
        equal(fn.call('luke', 6), 2, 'sixth run, gets value');
        equal(fn.call('han solo', 7), 2, 'seventh run, return value is caching');
      }), 100);

      equal(fn.call('vader', 4), 1, 'fourth run, return value is caching');

      setTimeout(wrap(function() {
        equal(counter, 2, 'counter is correct');
        finish();
      }), 200);
    });
  });

  method('throttle', function(async) {
    async(function(wrap, finish) {
      var n = 1;
      var fn = run(function() {
        return ++n;
      }, 'throttle', [50]);

      equal(fn(), 2, 'memoize | iteration 1');
      equal(fn(), 2, 'memoize | iteration 2');
      equal(fn(), 2, 'memoize | iteration 3');

      setTimeout(wrap(function() {
        equal(fn(), 3, 'memoize | result expires after 200 ms');
        finish();
      }), 200);
    });
  });


  method('after', function() {
    var fn, ret, counter = 0, i = 1;
    var expectedArguments = [
      [[1,'bop'], [2,'bop'], [3,'bop'], [4,'bop'], [5,'bop']],
      [[6,'bop'],[7,'bop'],[8,'bop'],[9,'bop'],[10,'bop']]
    ];
    fn = run(function(args) {
      equal(args, expectedArguments[counter], 'collects arguments called');
      equal(!!args[0].slice, true, 'arguments are converted to actual arrays');
      counter++;
      return 'hooha';
    }, 'after', [5]);
    while(i <= 10) {
      ret = fn(i, 'bop');
      equal(ret, (i % 5 == 0 ? 'hooha' : undefined), 'collects return value as well');
      i++;
    }
    equal(counter, 2, 'calls a function only after a certain number of calls');
  });

  method('after', function() {
    var fn, counter = 0;
    var fn = run(function(args) { counter++; }, 'after', [0]);
    equal(counter, 1, '0 should fire the function immediately');
    equal(typeof fn, 'function', '0 should still return a function');
  });


  method('once', function() {
    var fn, obj = { foo:'bar' }, counter = 0;
    fn = run(function(one, two) {
      counter++;
      equal(this, obj, 'scope is properly set');
      equal(one, 'one', 'first argument is passed');
      equal(two, 'two', 'second argument is passed');
      return counter * 30;
    }, 'once');

    equal(fn.call(obj, 'one', 'two'), 30, 'first call calculates the result');
    equal(fn.call(obj, 'one', 'two'), 30, 'second call memoizes the result');
    equal(fn.call(obj, 'one', 'two'), 30, 'third call memoizes the result');
    equal(fn.call(obj, 'one', 'two'), 30, 'fourth call memoizes the result');
    equal(fn.call(obj, 'one', 'two'), 30, 'fifth call memoizes the result');

    equal(counter, 1, 'counter is only incremented once');
  });

  method('once', function() {
    var fn, counter = 0;
    fn = run(function(one, two) {
      counter++;
    }, 'once');

    fn.call();
    fn.call();
    fn.call();

    equal(counter, 1, 'returning undefined will not affect the number of calls');
  });

  method('once', function() {
    var fn, counter = 0;
    fn = run(function(n) {
      counter++;
      return n + 1;
    }, 'once');
    equal(fn(3), 4, 'running with 3 should add 1');
    equal(fn(4), 5, 'running with 4 should still add 1');
    equal(fn(500), 501, 'running with 500 should still add 1');
    // Runs
    fn(1);
    // Runs
    fn(2);
    // Cached
    fn(3);
    equal(counter, 5, 'should have run 5 times');
  });



  var format = function(place, last){
    return (last || '') + this.toFixed(place);
  }

  method('fill', function() {
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


  method('cancel', function(async) {
    async(function(wrap, finish) {
      // Issue #346
      var counter = 0;
      var fn = function() {
        counter++;
        run(fn, 'cancel');
      };
      run(fn, 'delay', [5]);
      run(fn, 'delay', [20]);
      run(fn, 'delay', [20]);
      run(fn, 'delay', [20]);
      run(fn, 'delay', [20]);
      run(fn, 'delay', [20]);
      setTimeout(wrap(function() {
        equal(counter, 1, 'delays should have been canceled after 1');
        finish();
      }), 50);
    });
  });

  method('cancel', function(async) {
    async(function(wrap, finish) {
      var counter = 0;
      var fn = function() {
        counter++;
        if (counter === 2) {
          run(fn, 'cancel');
        }
      };
      // Note that IE seems unable to clear timeouts that are too close
      // together, so spacing them out a bit.
      run(fn, 'delay', [20]);
      run(fn, 'delay', [20]);
      run(fn, 'delay', [2]);
      run(fn, 'delay', [5]);
      run(fn, 'delay', [20]);
      run(fn, 'delay', [20]);
      setTimeout(wrap(function() {
        equal(counter, 2, 'delays should have been canceled after 2');
        finish();
      }), 50);
    });
  });

  method('every', function(async) {
    async(function(wrap, finish) {
      // Issue #348
      var counter = 0;
      var check1Finished = false;
      var check2Finished = false;
      function checkFinished() {
        if (check1Finished && check2Finished) {
          finish();
        }
      }
      var fn = wrap(function(one, two) {
        equal(this, fn, 'this object should be the function');
        equal(one, 'one', 'first argument should be curried');
        equal(two, 'two', 'second argument should be curried');
        counter++;
        if (counter === 5) {
          run(fn, 'cancel');
          setTimeout(wrap(function() {
            // Issue #488
            equal(counter, 5, 'should not have been called since cancel was run');
            check1Finished = true;
            checkFinished();
          }), 50);
        }
      });
      run(fn, 'every' , [10, 'one', 'two']);
      setTimeout(wrap(function() {
        equal(counter, 5, 'should have been called 5 times');
        check2Finished = true;
        checkFinished();
      }), 100);
    });
  });

});

